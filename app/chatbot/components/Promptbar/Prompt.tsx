'use client'
import { Button } from '@/components/ui/button'
import { Prompt } from '@/types/prompt'
import { DragEvent, FC, useEffect, useState } from 'react'
import PromptModal from './PromptModal'

interface Props {
	prompt: Prompt
	onUpdatePrompt: (prompt: Prompt) => void
	onDeletePrompt: (prompt: Prompt) => void
}

export const PromptComponent: FC<Props> = ({
	prompt,
	onUpdatePrompt,
	onDeletePrompt,
}) => {
	const [showModal, setShowModal] = useState<boolean>(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isRenaming, setIsRenaming] = useState(false)
	const [renameValue, setRenameValue] = useState('')

	const handleDragStart = (e: DragEvent<HTMLButtonElement>, prompt: Prompt) => {
		if (e.dataTransfer) {
			e.dataTransfer.setData('prompt', JSON.stringify(prompt))
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
		<Button
			variant='ghost'
			className='w-full group justify-between gap-4 active:scale-100'
			draggable='true'
			onDragStart={(e) => handleDragStart(e, prompt)}
			onMouseLeave={() => {
				setIsDeleting(false)
				setIsRenaming(false)
				setRenameValue('')
			}}
		>
			<div className='flex flex-row w-[150px] items-center gap-4'>
				<i className='text-lg i-[tabler--bulb-filled] text-primary'></i>

				<div
					onClick={(e) => {
						e.stopPropagation()
						setShowModal(true)
					}}
					className='relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all pr-4 text-left text-[12.5px] leading-3'
				>
					{prompt.name}
				</div>
			</div>

			{(isDeleting || isRenaming) && (
				<div className='absolute right-1 z-10 flex text-gray-300'>
					<Button
						size='icon'
						variant='ghost'
						onClick={(e) => {
							e.stopPropagation()

							if (isDeleting) {
								onDeletePrompt(prompt)
							}

							setIsDeleting(false)
						}}
					>
						<i className='i-[ic--sharp-check] text-xl text-green-500 dark:text-green-400'></i>
					</Button>

					<Button
						size='icon'
						variant='ghost'
						onClick={(e) => {
							e.stopPropagation()
							setIsDeleting(false)
						}}
					>
						{/* <IconX size={18} /> */}
						<i className='text-lg i-[ph--x-bold]'></i>
					</Button>
				</div>
			)}

			{!isDeleting && !isRenaming && (
				<div className='z-10 hidden group-hover:flex text-gray-300'>
					<Button
						className='w-5 h-5'
						size='icon'
						variant='ghost'
						onClick={(e) => {
							e.stopPropagation()
							setIsDeleting(true)
						}}
					>
						{/* <IconTrash size={18} /> */}
						<i className='i-[ion--trash-outline] text-lg text-red-500'></i>
					</Button>
				</div>
			)}

			{showModal && (
				<PromptModal
					open={showModal}
					prompt={prompt}
					onClose={() => setShowModal(false)}
					onUpdatePrompt={onUpdatePrompt}
				/>
			)}
		</Button>
	)
}
