'use client'

import Spinner from '@/components/icons/spinner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import t from '@/i18n'
import { Message } from '@/types/chat'
import { OpenAIModel } from '@/types/openai'
import { Plugin } from '@/types/plugin'
import { Prompt } from '@/types/prompt'
import {
	FC,
	KeyboardEvent,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { PluginSelect } from './PluginSelect'
import { PromptList } from './PromptList'
import { VariableModal } from './VariableModal'

interface Props {
	messageIsStreaming: boolean
	model: OpenAIModel
	conversationIsEmpty: boolean
	prompts: Prompt[]
	onSend: (message: Message, plugin: Plugin | null) => void
	onRegenerate: () => void
	stopConversationRef: MutableRefObject<boolean>
	textareaRef: MutableRefObject<HTMLTextAreaElement | null>
}

export const ChatInput: FC<Props> = ({
	messageIsStreaming,
	model,
	conversationIsEmpty,
	prompts,
	onSend,
	onRegenerate,
	stopConversationRef,
	textareaRef,
}) => {
	const [content, setContent] = useState<string>()
	const [isTyping, setIsTyping] = useState<boolean>(false)
	const [showPromptList, setShowPromptList] = useState(false)
	const [activePromptIndex, setActivePromptIndex] = useState(0)
	const [promptInputValue, setPromptInputValue] = useState('')
	const [variables, setVariables] = useState<string[]>([])
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [showPluginSelect, setShowPluginSelect] = useState(false)
	const [plugin, setPlugin] = useState<Plugin | null>(null)

	const promptListRef = useRef<HTMLUListElement | null>(null)

	const filteredPrompts = prompts.filter((prompt) =>
		prompt.name.toLowerCase().includes(promptInputValue.toLowerCase())
	)

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value
		const maxLength = model.maxLength

		if (value.length > maxLength) {
			alert(
				t(
					`Message limit is {{maxLength}} characters. You have entered {{valueLength}} characters.`
					// { maxLength, valueLength: value.length },
				)
			)
			return
		}

		setContent(value)
		updatePromptListVisibility(value)
	}

	const handleSend = () => {
		if (messageIsStreaming) {
			return
		}

		if (!content) {
			alert(t('Please enter a message'))
			return
		}

		onSend({ role: 'user', content }, plugin)
		setContent('')
		setPlugin(null)

		if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
			textareaRef.current.blur()
		}
	}

	const handleStopConversation = () => {
		stopConversationRef.current = true
		setTimeout(() => {
			stopConversationRef.current = false
		}, 1000)
	}

	const isMobile = () => {
		const userAgent =
			typeof window.navigator === 'undefined' ? '' : navigator.userAgent
		const mobileRegex =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i
		return mobileRegex.test(userAgent)
	}

	const handleInitModal = () => {
		const selectedPrompt = filteredPrompts[activePromptIndex]
		if (selectedPrompt) {
			setContent((prevContent) => {
				const newContent = prevContent?.replace(
					/\/\w*$/,
					selectedPrompt.content
				)
				return newContent
			})
			handlePromptSelect(selectedPrompt)
		}
		setShowPromptList(false)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (showPromptList) {
			if (e.key === 'ArrowDown') {
				e.preventDefault()
				setActivePromptIndex((prevIndex) =>
					prevIndex < prompts.length - 1 ? prevIndex + 1 : prevIndex
				)
			} else if (e.key === 'ArrowUp') {
				e.preventDefault()
				setActivePromptIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : prevIndex
				)
			} else if (e.key === 'Tab') {
				e.preventDefault()
				setActivePromptIndex((prevIndex) =>
					prevIndex < prompts.length - 1 ? prevIndex + 1 : 0
				)
			} else if (e.key === 'Enter') {
				e.preventDefault()
				handleInitModal()
			} else if (e.key === 'Escape') {
				e.preventDefault()
				setShowPromptList(false)
			} else {
				setActivePromptIndex(0)
			}
		} else if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		} else if (e.key === '/' && e.metaKey) {
			e.preventDefault()
			setShowPluginSelect(!showPluginSelect)
		}
	}

	const parseVariables = (content: string) => {
		const regex = /{{(.*?)}}/g
		const foundVariables = []
		let match

		while ((match = regex.exec(content)) !== null) {
			foundVariables.push(match[1])
		}

		return foundVariables
	}

	const updatePromptListVisibility = useCallback((text: string) => {
		const match = text.match(/\/\w*$/)

		if (match) {
			setShowPromptList(true)
			setPromptInputValue(match[0].slice(1))
		} else {
			setShowPromptList(false)
			setPromptInputValue('')
		}
	}, [])

	const handlePromptSelect = (prompt: Prompt) => {
		const parsedVariables = parseVariables(prompt.content)
		setVariables(parsedVariables)

		if (parsedVariables.length > 0) {
			setIsModalVisible(true)
		} else {
			setContent((prevContent) => {
				const updatedContent = prevContent?.replace(/\/\w*$/, prompt.content)
				return updatedContent
			})
			updatePromptListVisibility(prompt.content)
		}
	}

	const handleSubmit = (updatedVariables: string[]) => {
		const newContent = content?.replace(/{{(.*?)}}/g, (match, variable) => {
			const index = variables.indexOf(variable)
			return updatedVariables[index]
		})

		setContent(newContent)

		if (textareaRef && textareaRef.current) {
			textareaRef.current.focus()
		}
	}

	useEffect(() => {
		if (promptListRef.current) {
			promptListRef.current.scrollTop = activePromptIndex * 30
		}
	}, [activePromptIndex])

	useEffect(() => {
		if (textareaRef && textareaRef.current) {
			textareaRef.current.style.height = 'inherit'
			textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`
			textareaRef.current.style.overflow = `${
				textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
			}`
		}
	}, [content, textareaRef])

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (
				promptListRef.current &&
				!promptListRef.current.contains(e.target as Node)
			) {
				setShowPromptList(false)
			}
		}

		window.addEventListener('click', handleOutsideClick)

		return () => {
			window.removeEventListener('click', handleOutsideClick)
		}
	}, [])

	return (
		<div className='absolute bottom-0 left-0 w-full border-transparent from-transparent pt-6 dark:border-border md:pt-2'>
			<div className='stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl'>
				{messageIsStreaming && (
					<Button
						className='absolute top-0 left-0 right-0 gap-4 mx-auto mb-3 w-fit'
						onClick={handleStopConversation}
					>
						<i className='text-base i-[tabler--player-stop-filled]'></i>
						{t('Stop Generating')}
					</Button>
				)}

				{!messageIsStreaming && !conversationIsEmpty && (
					<Button
						className='absolute top-0 left-0 right-0 gap-4 mx-auto mb-3 w-fit'
						size='lg'
						onClick={onRegenerate}
					>
						<i className='text-base i-[bi--arrow-repeat]'></i>
						{t('Regenerate response')!}
					</Button>
				)}

				<div className='relative mx-2 flex w-full flex-grow flex-col rounded-md border border-border bg-background shadow-[0_0_10px_rgba(0,0,0,0.10)]  dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] sm:mx-4'>
					<PluginSelect
						plugin={plugin}
						onPluginChange={(plugin: Plugin) => {
							setPlugin(plugin)
							setShowPluginSelect(false)

							if (textareaRef && textareaRef.current) {
								textareaRef.current.focus()
							}
						}}
					/>

					<Textarea
						ref={textareaRef}
						className='m-0 w-full min-h-10 max-h-[400px] resize-none text-foreground md:py-3 px-10'
						style={{
							bottom: `${textareaRef?.current?.scrollHeight}px`,
							overflow: `${
								textareaRef.current && textareaRef.current.scrollHeight > 400
									? 'auto'
									: 'hidden'
							}`,
						}}
						placeholder={
							t('Type a message or type "/" to select a prompt...') || ''
						}
						value={content}
						rows={1}
						onCompositionStart={() => setIsTyping(true)}
						onCompositionEnd={() => setIsTyping(false)}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
					/>

					<Button
						variant='ghost'
						size='icon'
						className='absolute right-0.5 top-0.5 active:scale-100'
						onClick={handleSend}
					>
						{messageIsStreaming ? (
							<Spinner />
						) : (
							<i className='text-lg text-primary i-[cil--send]'></i>
						)}
					</Button>

					{showPromptList && filteredPrompts.length > 0 && (
						<div className='absolute bottom-12 w-full'>
							<PromptList
								activePromptIndex={activePromptIndex}
								prompts={filteredPrompts}
								onSelect={handleInitModal}
								onMouseOver={setActivePromptIndex}
								promptListRef={promptListRef}
							/>
						</div>
					)}

					{isModalVisible && (
						<VariableModal
							prompt={prompts[activePromptIndex]}
							variables={variables}
							onSubmit={handleSubmit}
							onClose={() => setIsModalVisible(false)}
						/>
					)}
				</div>
			</div>
			<div className='px-3 pt-2 pb-3 text-center text-[12px] text-foreground/50 md:px-4 md:pt-3 md:pb-6'>
				{t('Chrior keeps everything convinient.')}
			</div>
		</div>
	)
}
