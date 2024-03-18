'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Conversation } from '@/types/chat'
import { KeyValuePair } from '@/types/data'
import { DragEvent, FC, KeyboardEvent, useEffect, useState } from 'react'

interface Props {
	selectedConversation: Conversation
	conversation: Conversation
	loading: boolean
	onSelectConversation: (conversation: Conversation) => void
	onDeleteConversation: (conversation: Conversation) => void
	onUpdateConversation: (conversation: Conversation, data: KeyValuePair) => void
}

export const ConversationComponent: FC<Props> = ({
	selectedConversation,
	conversation,
	loading,
	onSelectConversation,
	onDeleteConversation,
	onUpdateConversation,
}) => {
	const [isDeleting, setIsDeleting] = useState(false)
	const [isRenaming, setIsRenaming] = useState(false)
	const [renameValue, setRenameValue] = useState('')

	const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleRename(selectedConversation)
		}
	}

	const handleDragStart = (
		e: DragEvent<HTMLDivElement>,
		conversation: Conversation
	) => {
		if (e.dataTransfer) {
			e.dataTransfer.setData('conversation', JSON.stringify(conversation))
		}
	}

	const handleRename = (conversation: Conversation) => {
		if (renameValue.trim().length > 0) {
			onUpdateConversation(conversation, { key: 'name', value: renameValue })
			setRenameValue('')
			setIsRenaming(false)
		}
	}

	useEffect(() => {
		if (isRenaming) {
			setIsDeleting(false)
		} else if (isDeleting) {
			setIsRenaming(false)
		}
	}, [isRenaming, isDeleting])

	return (
		<Button className='gap-4 active:scale-1'>
			{isRenaming && selectedConversation.id === conversation.id ? (
				<div className='!w-4/5 p-0 flex items-center gap-4'>
					{/* <IconMessage size={18} /> */}
					<i className='text-lg i-[material-symbols-light--mark-unread-chat-alt-outline-sharp]'></i>
					<Input
						className='!h-7'
						value={renameValue}
						onChange={(e) => setRenameValue(e.target.value)}
						onKeyDown={handleEnterDown}
						autoFocus
					></Input>
				</div>
			) : (
				<div
					className={`!w-4/5 p-0 flex items-center gap-4 ${
						loading ? 'pointer-events-none' : ''
					}`}
					onClick={() => onSelectConversation(conversation)}
					draggable
					onDragStart={(e) => handleDragStart(e, conversation)}
				>
					{/* <IconMessage size={18} /> */}
					<i className='text-lg i-[material-symbols-light--mark-unread-chat-alt-outline-sharp]'></i>
					<div
						className={`relative flex items-center max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all`}
					>
						{conversation.name}
					</div>
				</div>
			)}

			{(isDeleting || isRenaming) &&
				selectedConversation.id === conversation.id && (
					<div className='flex items-center gap-2 p-0 text-foreground'>
						<Button
							className='!w-4 !h-4'
							size='icon'
							variant='ghost'
							onClick={(e) => {
								e.stopPropagation()
								if (isDeleting) {
									onDeleteConversation(conversation)
								} else if (isRenaming) {
									handleRename(conversation)
								}
								setIsDeleting(false)
								setIsRenaming(false)
							}}
						>
							<i className='i-[ic--sharp-check] text-lg text-green-500 dark:text-green-400'></i>
						</Button>
						<Button
							className='!w-4 !h-4'
							size='icon'
							variant='ghost'
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

			{selectedConversation.id === conversation.id &&
				!isDeleting &&
				!isRenaming && (
					<div className='flex items-center gap-2 text-foreground'>
						<Button
							className='!w-4 !h-4'
							size='icon'
							variant='ghost'
							onClick={(e) => {
								e.stopPropagation()
								setIsRenaming(true)
								setRenameValue(selectedConversation.name)
							}}
						>
							<i className='text-lg i-[jam--pencil-f]'></i>
						</Button>
						<Button
							className='!w-4 !h-4'
							size='icon'
							variant='ghost'
							onClick={(e) => {
								e.stopPropagation()
								setIsDeleting(true)
							}}
						>
							<i className='i-[ion--trash-outline] text-lg'></i>
						</Button>
					</div>
				)}
		</Button>
	)
}
