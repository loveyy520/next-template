'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Conversation } from '@/types/chat'
import { KeyValuePair } from '@/types/data'
import { Folder } from '@/types/folder'
import { FC, KeyboardEvent, useEffect, useState } from 'react'
import { ConversationComponent } from '../../Chatbar/Conversation'

interface Props {
	searchTerm: string
	conversations: Conversation[]
	currentFolder: Folder
	onDeleteFolder: (folder: string) => void
	onUpdateFolder: (folder: string, name: string) => void
	// conversation props
	selectedConversation: Conversation
	loading: boolean
	onSelectConversation: (conversation: Conversation) => void
	onDeleteConversation: (conversation: Conversation) => void
	onUpdateConversation: (conversation: Conversation, data: KeyValuePair) => void
}

export const ChatFolder: FC<Props> = ({
	searchTerm,
	conversations,
	currentFolder,
	onDeleteFolder,
	onUpdateFolder,
	// conversation props
	selectedConversation,
	loading,
	onSelectConversation,
	onDeleteConversation,
	onUpdateConversation,
}) => {
	const [isDeleting, setIsDeleting] = useState(false)
	const [isRenaming, setIsRenaming] = useState(false)
	const [renameValue, setRenameValue] = useState('')
	const [isOpen, setIsOpen] = useState(false)

	const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleRename()
		}
	}

	const handleRename = () => {
		onUpdateFolder(currentFolder.id, renameValue)
		setRenameValue('')
		setIsRenaming(false)
	}

	const handleDrop = (e: any, folder: Folder) => {
		if (e.dataTransfer) {
			setIsOpen(true)

			const conversation = JSON.parse(e.dataTransfer.getData('conversation'))
			onUpdateConversation(conversation, { key: 'folderId', value: folder.id })

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
		if (isRenaming) {
			setIsDeleting(false)
		} else if (isDeleting) {
			setIsRenaming(false)
		}
	}, [isRenaming, isDeleting])

	useEffect(() => {
		if (searchTerm) {
			setIsOpen(true)
		} else {
			setIsOpen(false)
		}
	}, [searchTerm])

	return (
		<>
			<Button
				variant='ghost'
				className='justify-start gap-4 active:scale-100'
				onClick={() => setIsOpen(!isOpen)}
				onDrop={(e) => handleDrop(e, currentFolder)}
				onDragOver={allowDrop}
				onDragEnter={highlightDrop}
				onDragLeave={removeHighlight}
			>
				{isRenaming ? (
					<div className='flex w-full items-center gap-3 bg-transparent py-3 rounded-lg'>
						{isOpen ? (
							<i className='text-lg i-[ph--caret-down]'></i>
						) : (
							<i className='text-lg i-[ph--caret-right]'></i>
						)}

						<Input
							className='!h-7'
							value={renameValue}
							onChange={(e) => setRenameValue(e.target.value)}
							onKeyDown={handleEnterDown}
							autoFocus
						/>
					</div>
				) : (
					<>
						{isOpen ? (
							<i className='text-lg i-[ph--caret-down]'></i>
						) : (
							<i className='text-lg i-[ph--caret-right]'></i>
						)}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className='relative max-h-5 max-w-[120px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3'>
										{currentFolder.name}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>{currentFolder.name}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</>
				)}

				{(isDeleting || isRenaming) && (
					<div className='flex gap-2 ml-auto'>
						<Button
							variant='ghost'
							size='icon'
							className='h-4 w-4 p-0'
							onClick={(e) => {
								e.stopPropagation()

								if (isDeleting) {
									onDeleteFolder(currentFolder.id)
								} else if (isRenaming) {
									handleRename()
								}

								setIsDeleting(false)
								setIsRenaming(false)
							}}
						>
							<i className='i-[ic--sharp-check] text-lg'></i>
						</Button>
						<Button
							variant='ghost'
							size='icon'
							className='h-4 w-4 p-0'
							onClick={(e) => {
								e.stopPropagation()
								setIsDeleting(false)
								setIsRenaming(false)
							}}
						>
							<i className='text-lg i-[ph--x-bold]'></i>
						</Button>
					</div>
				)}

				{!isDeleting && !isRenaming && (
					<div className='flex gap-2 ml-auto'>
						<Button
							variant='ghost'
							size='icon'
							className='h-4 w-4 p-0'
							onClick={(e) => {
								e.stopPropagation()
								setIsRenaming(true)
								setRenameValue(currentFolder.name)
							}}
						>
							<i className='text-lg i-[jam--pencil-f] text-primary'></i>
						</Button>
						<Button
							variant='ghost'
							size='icon'
							className='h-4 w-4 p-0'
							onClick={(e) => {
								e.stopPropagation()
								setIsDeleting(true)
							}}
						>
							<i className='i-[ion--trash-outline] text-lg text-red-400'></i>
						</Button>
					</div>
				)}
			</Button>

			{isOpen
				? conversations.map((conversation, index) => {
						if (conversation.folderId === currentFolder.id) {
							return (
								<div
									key={index}
									className='ml-5 gap-2 border-l pl-2'
								>
									<ConversationComponent
										selectedConversation={selectedConversation}
										conversation={conversation}
										loading={loading}
										onSelectConversation={onSelectConversation}
										onDeleteConversation={onDeleteConversation}
										onUpdateConversation={onUpdateConversation}
									/>
								</div>
							)
						}
				  })
				: null}
		</>
	)
}
