import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import t from '@/i18n'
import { Conversation } from '@/types/chat'
import { KeyValuePair } from '@/types/data'
import { SupportedExportFormats } from '@/types/export'
import { Folder } from '@/types/folder'
import { PluginKey } from '@/types/plugin'
import { FC, useEffect, useState } from 'react'
import { ChatFolders } from '../Folders/Chat/ChatFolders'
import { Search } from '../Sidebar/Search'
import { ChatbarSettings } from './ChatbarSettings'
import { Conversations } from './Conversations'

interface Props {
	lang: string
	loading: boolean
	className?: string
	conversations: Conversation[]
	lightMode: 'light' | 'dark'
	selectedConversation: Conversation
	pluginKeys: PluginKey[]
	folders: Folder[]
	onCreateFolder: (name: string) => void
	onDeleteFolder: (folderId: string) => void
	onUpdateFolder: (folderId: string, name: string) => void
	onNewConversation: () => void
	onSelectConversation: (conversation: Conversation) => void
	onDeleteConversation: (conversation: Conversation) => void
	onUpdateConversation: (conversation: Conversation, data: KeyValuePair) => void
	onClearConversations: () => void
	onExportConversations: () => void
	onImportConversations: (data: SupportedExportFormats) => void
}

export const Chatbar: FC<Props> = ({
	lang,
	loading,
	className = '',
	conversations,
	lightMode,
	selectedConversation,
	pluginKeys,
	folders,
	onCreateFolder,
	onDeleteFolder,
	onUpdateFolder,
	onNewConversation,
	onSelectConversation,
	onDeleteConversation,
	onUpdateConversation,
	onClearConversations,
	onExportConversations,
	onImportConversations,
}) => {
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [filteredConversations, setFilteredConversations] =
		useState<Conversation[]>(conversations)

	const handleUpdateConversation = (
		conversation: Conversation,
		data: KeyValuePair
	) => {
		onUpdateConversation(conversation, data)
		setSearchTerm('')
	}

	const handleDeleteConversation = (conversation: Conversation) => {
		onDeleteConversation(conversation)
		setSearchTerm('')
	}

	const handleDrop = (e: any) => {
		if (e.dataTransfer) {
			const conversation = JSON.parse(e.dataTransfer.getData('conversation'))
			onUpdateConversation(conversation, { key: 'folderId', value: 0 })

			e.target.style.background = 'none'
		}
	}

	const allowDrop = (e: any) => {
		e.preventDefault()
	}

	const highlightDrop = (e: any) => {
		e.target.style.background = '#343541'
	}

	const removeHighlight = (e: any) => {
		e.target.style.background = 'none'
	}

	useEffect(() => {
		if (searchTerm) {
			setFilteredConversations(
				conversations.filter((conversation) => {
					const searchable =
						conversation.name.toLocaleLowerCase() +
						' ' +
						conversation.messages.map((message) => message.content).join(' ')
					return searchable.toLowerCase().includes(searchTerm.toLowerCase())
				})
			)
		} else {
			setFilteredConversations(conversations)
		}
	}, [searchTerm, conversations])

	return (
		<div
			className={`${className} fixed top-header-height bottom-0 z-10 flex w-[260px] flex-none flex-col space-y-2 bg-background p-2 transition-all sm:relative sm:h-full sm:top-0`}
		>
			<div className='flex items-center justify-between gap-4'>
				<Button
					className='justify-start gap-4 flex-1'
					onClick={() => {
						onNewConversation()
						setSearchTerm('')
					}}
				>
					<i className='text-lg i-[material-symbols--add]'></i>
					{t('New chat')}
				</Button>
				<Button
					size='icon'
					onClick={() => onCreateFolder(t('New folder'))}
				>
					<i className='text-lg i-[bi--folder-plus]'></i>
				</Button>
			</div>

			{conversations.length > 1 && (
				<Search
					placeholder='Search conversations...'
					searchTerm={searchTerm}
					onSearch={setSearchTerm}
				/>
			)}

			<ScrollArea>
				{folders.length > 0 && (
					<div className='flex border-b border-border pb-2'>
						<ChatFolders
							searchTerm={searchTerm}
							conversations={filteredConversations.filter(
								(conversation) => conversation.folderId
							)}
							folders={folders}
							onDeleteFolder={onDeleteFolder}
							onUpdateFolder={onUpdateFolder}
							selectedConversation={selectedConversation}
							loading={loading}
							onSelectConversation={onSelectConversation}
							onDeleteConversation={handleDeleteConversation}
							onUpdateConversation={handleUpdateConversation}
						/>
					</div>
				)}

				{conversations.length > 0 ? (
					<div
						className='pt-2'
						onDrop={(e) => handleDrop(e)}
						onDragOver={allowDrop}
						onDragEnter={highlightDrop}
						onDragLeave={removeHighlight}
					>
						<Conversations
							loading={loading}
							conversations={filteredConversations.filter(
								(conversation) => !conversation.folderId
							)}
							selectedConversation={selectedConversation}
							onSelectConversation={onSelectConversation}
							onDeleteConversation={handleDeleteConversation}
							onUpdateConversation={handleUpdateConversation}
						/>
					</div>
				) : (
					<div className='mt-8 flex flex-col items-center gap-3 text-sm leading-normal text-foreground opacity-50'>
						<i className='i-[tabler--message-off]'></i>
						{t('No conversations.')}
					</div>
				)}
			</ScrollArea>

			<ChatbarSettings
				lang={lang}
				lightMode={lightMode}
				pluginKeys={pluginKeys}
				conversationsCount={conversations.length}
				onClearConversations={onClearConversations}
				onExportConversations={onExportConversations}
				onImportConversations={onImportConversations}
			/>
		</div>
	)
}
