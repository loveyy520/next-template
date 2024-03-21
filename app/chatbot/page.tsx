'use client'

// import Head from 'next/head';

import t from '@/i18n'
import { ChatBody, Conversation, Message } from '@/types/chat'
import { KeyValuePair } from '@/types/data'
import { ErrorMessage } from '@/types/error'
import { LatestExportFormat, SupportedExportFormats } from '@/types/export'
import { Folder, FolderType } from '@/types/folder'
import { LangParams } from '@/types/i18n'
import { OpenAIModel, OpenAIModelID } from '@/types/openai'
import { Plugin, PluginKey } from '@/types/plugin'
import { Prompt } from '@/types/prompt'
import { getEndpoint } from '@/utils/app/api'
import {
	cleanConversationHistory,
	cleanSelectedConversation,
} from '@/utils/app/clean'
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const'
import {
	saveConversation,
	saveConversations,
	updateConversation,
} from '@/utils/app/conversation'
import { saveFolders } from '@/utils/app/folders'
import { exportData, importData } from '@/utils/app/importExport'
import { savePrompts } from '@/utils/app/prompts'
import { useCallback, useEffect, useRef, useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
	getStandardBody,
	getUpdatedConversation,
	updateCurrentConversation,
	updateStreamingConversation,
} from '@/utils/app/chat'
import { Chat } from './components/Chat/Chat'
import { Chatbar } from './components/Chatbar/Chatbar'
import { Navbar } from './components/Mobile/Navbar'
import { Promptbar } from './components/Promptbar/Promptbar'

const defaultModel: OpenAIModel = {
	id: 'gpt-3.5-turbo',
	name: 'GPT-3.5',
	maxLength: 12000,
	tokenLimit: 4000,
}

interface Props extends LangParams {}

const ChatHome = ({ params: { lang } }: Props) => {
	// STATE ----------------------------------------------

	const [pluginKeys, setPluginKeys] = useState<PluginKey[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [lightMode, setLightMode] = useState<'dark' | 'light'>('dark')
	const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false)

	const [modelError, setModelError] = useState<ErrorMessage | null>(null)

	const [models, setModels] = useState<OpenAIModel[]>(() => [defaultModel])

	const [folders, setFolders] = useState<Folder[]>([])

	const [conversations, setConversations] = useState<Conversation[]>([])
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation>(() => ({
			id: 'user',
			messages: [],
			name: 'Chris',
			prompt: '你是一只猫娘',
			folderId: null,
			model: {
				id: 'gpt-3.5-turbo',
				name: 'GPT-3.5',
				maxLength: 12000,
				tokenLimit: 4000,
			},
		}))
	const [currentMessage, setCurrentMessage] = useState<Message>()

	const [showSidebar, setShowSidebar] = useState<boolean>(true)

	const [prompts, setPrompts] = useState<Prompt[]>([])
	const [showPromptbar, setShowPromptbar] = useState<boolean>(false)

	// REFS ----------------------------------------------

	const stopConversationRef = useRef<boolean>(false)

	const saveAndUpdateConversations = useCallback(
		(updatedConversation: Conversation) => {
			saveConversation(updatedConversation)
			const updatedConversations: Conversation[] = conversations.map(
				(conversation) => {
					if (conversation.id === selectedConversation.id) {
						return updatedConversation
					}

					return conversation
				}
			)

			if (updatedConversations.length === 0) {
				updatedConversations.push(updatedConversation)
			}

			setConversations(updatedConversations)
			saveConversations(updatedConversations)
			setMessageIsStreaming(false)
			setLoading(false)
		},
		[conversations, selectedConversation]
	)
	// FETCH RESPONSE ----------------------------------------------

	const { toast } = useToast()
	const handleSend = useCallback(
		async (
			message: Message,
			deleteCount: number = 0,
			plugin: Plugin | null = null
		) => {
			if (selectedConversation) {
				let updatedConversation = getUpdatedConversation(
					selectedConversation,
					deleteCount,
					message
				)

				setSelectedConversation(updatedConversation)
				setLoading(true)
				setMessageIsStreaming(true)

				const chatBody: ChatBody = {
					model: updatedConversation.model,
					messages: updatedConversation.messages,
					prompt: updatedConversation.prompt,
				}

				const endpoint = getEndpoint(plugin)
				const body = getStandardBody(plugin, chatBody, pluginKeys)

				const controller = new AbortController()
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: controller.signal,
					body,
				})

				if (!response.ok) {
					setLoading(false)
					setMessageIsStreaming(false)
					toast({
						description: response.statusText,
						variant: 'destructive',
					})
					return
				}

				const data = response.body

				if (!data) {
					setLoading(false)
					return setMessageIsStreaming(false)
				}

				if (!plugin) {
					if (updatedConversation.messages.length === 1) {
						const { content } = message
						const customName =
							content.length > 30 ? content.substring(0, 30) + '...' : content

						updatedConversation = {
							...updatedConversation,
							name: customName,
						}
					}

					const reader = data.getReader()
					const decoder = new TextDecoder()
					let done = false
					let isFirst = true
					let text = ''

					while (!done) {
						// 停止生成
						if (stopConversationRef.current === true) {
							controller.abort()
							done = true
							break
						}
						const { value, done: doneReading } = await reader.read()
						done = doneReading
						const chunkValue = decoder.decode(value)

						text += chunkValue

						if (isFirst) {
							isFirst = false
							updatedConversation.messages = [
								...updatedConversation.messages,
								{ role: 'assistant', content: chunkValue },
							]

							updateCurrentConversation(
								setSelectedConversation,
								updatedConversation,
								updatedConversation.messages
							)
						} else {
							updateStreamingConversation(
								setSelectedConversation,
								updatedConversation,
								text
							)
						}
					}
				} else {
					const { answer } = await response.json()

					const updatedMessages: Message[] = [
						...updatedConversation.messages,
						{ role: 'assistant', content: answer },
					]

					updateCurrentConversation(
						setSelectedConversation,
						updatedConversation,
						updatedMessages
					)
				}
				saveAndUpdateConversations(updatedConversation)
			}
		},
		[pluginKeys, selectedConversation, saveAndUpdateConversations]
	)

	const handleToggleChatbar = () => {
		setShowSidebar(!showSidebar)
		localStorage.setItem('showChatbar', JSON.stringify(!showSidebar))
	}

	const handleTogglePromptbar = () => {
		setShowPromptbar(!showPromptbar)
		localStorage.setItem('showPromptbar', JSON.stringify(!showPromptbar))
	}

	const handleExportData = () => {
		exportData()
	}

	const handleImportConversations = (data: SupportedExportFormats) => {
		const { history, folders, prompts }: LatestExportFormat = importData(data)

		setConversations(history)
		setSelectedConversation(history[history.length - 1])
		setFolders(folders)
		setPrompts(prompts)
	}

	const handleSelectConversation = (conversation: Conversation) => {
		setSelectedConversation(conversation)
		saveConversation(conversation)
	}

	// FOLDER OPERATIONS  --------------------------------------------

	const handleCreateFolder = (name: string, type: FolderType) => {
		const newFolder: Folder = {
			id: uuidv4(),
			name,
			type,
		}

		const updatedFolders = [...folders, newFolder]

		setFolders(updatedFolders)
		saveFolders(updatedFolders)
	}

	const handleDeleteFolder = (folderId: string) => {
		const updatedFolders = folders.filter((f) => f.id !== folderId)
		setFolders(updatedFolders)
		saveFolders(updatedFolders)

		const updatedConversations: Conversation[] = conversations.map((c) => {
			if (c.folderId === folderId) {
				return {
					...c,
					folderId: null,
				}
			}

			return c
		})
		setConversations(updatedConversations)
		saveConversations(updatedConversations)

		const updatedPrompts: Prompt[] = prompts.map((p) => {
			if (p.folderId === folderId) {
				return {
					...p,
					folderId: null,
				}
			}

			return p
		})
		setPrompts(updatedPrompts)
		savePrompts(updatedPrompts)
	}

	const handleUpdateFolder = (folderId: string, name: string) => {
		const updatedFolders = folders.map((f) => {
			if (f.id === folderId) {
				return {
					...f,
					name,
				}
			}

			return f
		})

		setFolders(updatedFolders)
		saveFolders(updatedFolders)
	}

	// CONVERSATION OPERATIONS  --------------------------------------------

	const handleNewConversation = () => {
		const lastConversation = conversations[conversations.length - 1]

		const newConversation: Conversation = {
			id: uuidv4(),
			name: `${t('New Conversation')}`,
			messages: [],
			model: lastConversation?.model || defaultModel,
			prompt: DEFAULT_SYSTEM_PROMPT,
			folderId: null,
		}

		const updatedConversations = [...conversations, newConversation]

		setSelectedConversation(newConversation)
		setConversations(updatedConversations)

		saveConversation(newConversation)
		saveConversations(updatedConversations)

		setLoading(false)
	}

	const handleDeleteConversation = (conversation: Conversation) => {
		const updatedConversations = conversations.filter(
			(c) => c.id !== conversation.id
		)
		setConversations(updatedConversations)
		saveConversations(updatedConversations)

		if (updatedConversations.length > 0) {
			setSelectedConversation(
				updatedConversations[updatedConversations.length - 1]
			)
			saveConversation(updatedConversations[updatedConversations.length - 1])
		} else {
			setSelectedConversation({
				id: uuidv4(),
				name: 'New conversation',
				messages: [],
				model: defaultModel,
				prompt: DEFAULT_SYSTEM_PROMPT,
				folderId: null,
			})
			localStorage.removeItem('selectedConversation')
		}
	}

	const handleUpdateConversation = (
		conversation: Conversation,
		data: KeyValuePair
	) => {
		const updatedConversation = {
			...conversation,
			[data.key]: data.value,
		}

		const { single, all } = updateConversation(
			updatedConversation,
			conversations
		)

		setSelectedConversation(single)
		setConversations(all)
	}

	const handleClearConversations = () => {
		setConversations([])
		localStorage.removeItem('conversationHistory')

		setSelectedConversation({
			id: uuidv4(),
			name: 'New conversation',
			messages: [],
			model: defaultModel,
			prompt: DEFAULT_SYSTEM_PROMPT,
			folderId: null,
		})
		localStorage.removeItem('selectedConversation')

		const updatedFolders = folders.filter((f) => f.type !== 'chat')
		setFolders(updatedFolders)
		saveFolders(updatedFolders)
	}

	const handleEditMessage = (message: Message, messageIndex: number) => {
		if (selectedConversation) {
			const updatedMessages = selectedConversation.messages
				.map((m, i) => {
					if (i < messageIndex) {
						return m
					}
				})
				.filter((m) => m) as Message[]

			const updatedConversation = {
				...selectedConversation,
				messages: updatedMessages,
			}

			const { single, all } = updateConversation(
				updatedConversation,
				conversations
			)

			setSelectedConversation(single)
			setConversations(all)

			setCurrentMessage(message)
		}
	}

	// PROMPT OPERATIONS --------------------------------------------

	const handleCreatePrompt = () => {
		const newPrompt: Prompt = {
			id: uuidv4(),
			name: `Prompt ${prompts.length + 1}`,
			description: '',
			content: '',
			model: defaultModel,
			folderId: null,
		}

		const updatedPrompts = [...prompts, newPrompt]

		setPrompts(updatedPrompts)
		savePrompts(updatedPrompts)
	}

	const handleUpdatePrompt = (prompt: Prompt) => {
		const updatedPrompts = prompts.map((p) => {
			if (p.id === prompt.id) {
				return prompt
			}

			return p
		})

		setPrompts(updatedPrompts)
		savePrompts(updatedPrompts)
	}

	const handleDeletePrompt = (prompt: Prompt) => {
		const updatedPrompts = prompts.filter((p) => p.id !== prompt.id)
		setPrompts(updatedPrompts)
		savePrompts(updatedPrompts)
	}

	// EFFECTS  --------------------------------------------

	useEffect(() => {
		if (currentMessage) {
			handleSend(currentMessage)
			setCurrentMessage(undefined)
		}
	}, [currentMessage, handleSend])

	useEffect(() => {
		if (window.innerWidth < 640) {
			setShowSidebar(false)
		}
	}, [selectedConversation])

	// ON LOAD --------------------------------------------

	useEffect(() => {
		const theme = localStorage.getItem('theme')
		if (theme) {
			setLightMode(theme as 'dark' | 'light')
		}

		if (window.innerWidth < 640) {
			setShowSidebar(false)
		}

		const showChatbar = localStorage.getItem('showChatbar')
		if (showChatbar) {
			setShowSidebar(showChatbar === 'true')
		}

		const showPromptbar = localStorage.getItem('showPromptbar')
		if (showPromptbar) {
			setShowPromptbar(showPromptbar === 'true')
		}

		const folders = localStorage.getItem('folders')
		if (folders) {
			setFolders(JSON.parse(folders))
		}

		const prompts = localStorage.getItem('prompts')
		if (prompts) {
			setPrompts(JSON.parse(prompts))
		}

		const conversationHistory = localStorage.getItem('conversationHistory')
		if (conversationHistory) {
			const parsedConversationHistory: Conversation[] =
				JSON.parse(conversationHistory)
			const cleanedConversationHistory = cleanConversationHistory(
				parsedConversationHistory
			)
			setConversations(cleanedConversationHistory)
		}

		const selectedConversation = localStorage.getItem('selectedConversation')
		if (selectedConversation) {
			const parsedSelectedConversation: Conversation =
				JSON.parse(selectedConversation)
			const cleanedSelectedConversation = cleanSelectedConversation(
				parsedSelectedConversation
			)
			setSelectedConversation(cleanedSelectedConversation)
		} else {
			setSelectedConversation({
				id: uuidv4(),
				name: 'New conversation',
				messages: [],
				model: defaultModel,
				prompt: DEFAULT_SYSTEM_PROMPT,
				folderId: null,
			})
		}
	}, [])

	return (
		<main
			className={`flex h-full flex-col text-sm text-foreground bg-background`}
		>
			<div className='fixed w-full sm:hidden'>
				<Navbar
					selectedConversation={selectedConversation}
					onNewConversation={handleNewConversation}
				/>
			</div>
			<section className='flex h-full w-full pt-[48px] sm:pt-0'>
				<div
					className={`${
						showSidebar ? '' : '-translate-x-[350px] w-0'
					} relative overflow-hidden transition-transform duration-300`}
				>
					<Chatbar
						lang={lang}
						loading={messageIsStreaming}
						conversations={conversations}
						lightMode={lightMode}
						selectedConversation={selectedConversation}
						pluginKeys={pluginKeys}
						folders={folders.filter((folder) => folder.type === 'chat')}
						onCreateFolder={(name) => handleCreateFolder(name, 'chat')}
						onDeleteFolder={handleDeleteFolder}
						onUpdateFolder={handleUpdateFolder}
						onNewConversation={handleNewConversation}
						onSelectConversation={handleSelectConversation}
						onDeleteConversation={handleDeleteConversation}
						onUpdateConversation={handleUpdateConversation}
						onClearConversations={handleClearConversations}
						onExportConversations={handleExportData}
						onImportConversations={handleImportConversations}
					/>
				</div>
				<Button
					size='icon'
					variant='ghost'
					className={`${
						showSidebar ? 'left-[276px]' : 'left-8'
					} transition-[left] duration-300 fixed top-20 z-20`}
					onClick={handleToggleChatbar}
				>
					<i
						className={`
							${
								showSidebar
									? 'i-[solar--round-alt-arrow-left-bold]'
									: 'i-[solar--round-alt-arrow-right-bold]'
							}
							text-2xl
							text-foreground
						`}
					/>
				</Button>
				<div className='flex flex-1'>
					<Chat
						lang={lang}
						conversation={selectedConversation}
						messageIsStreaming={messageIsStreaming}
						defaultModelId={'gpt-3.5-turbo' as OpenAIModelID}
						modelError={modelError}
						models={models}
						loading={loading}
						prompts={prompts}
						onSend={handleSend}
						onUpdateConversation={handleUpdateConversation}
						onEditMessage={handleEditMessage}
						stopConversationRef={stopConversationRef}
					/>
				</div>
				<div
					className={`${
						showPromptbar ? 'right-0' : '-right-[270px] w-0'
					} relative top-0 overflow-hidden transition-[right] duration-300`}
				>
					<Promptbar
						prompts={prompts}
						folders={folders.filter((folder) => folder.type === 'prompt')}
						onCreatePrompt={handleCreatePrompt}
						onUpdatePrompt={handleUpdatePrompt}
						onDeletePrompt={handleDeletePrompt}
						onCreateFolder={(name) => handleCreateFolder(name, 'prompt')}
						onDeleteFolder={handleDeleteFolder}
						onUpdateFolder={handleUpdateFolder}
					/>
				</div>
				<Button
					size='icon'
					variant='ghost'
					className={`${
						showPromptbar ? 'right-[288px]' : 'right-8'
					} transition-[right] duration-300 fixed top-20 z-20`}
					onClick={handleTogglePromptbar}
				>
					<i
						className={`
							${
								showPromptbar
									? 'i-[solar--round-alt-arrow-right-bold]'
									: 'i-[solar--round-alt-arrow-left-bold]'
							}
							text-2xl
							text-foreground
						`}
					/>
				</Button>
			</section>
		</main>
	)
}
export default ChatHome
