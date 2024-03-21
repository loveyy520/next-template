'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Folder } from '@/types/folder'
import { Prompt } from '@/types/prompt'
import { FC, KeyboardEvent, useEffect, useState } from 'react'
import { PromptComponent } from '../../../components/Promptbar/Prompt'

interface Props {
	searchTerm: string
	prompts: Prompt[]
	currentFolder: Folder
	onDeleteFolder: (folder: string) => void
	onUpdateFolder: (folder: string, name: string) => void
	// prompt props
	onDeletePrompt: (prompt: Prompt) => void
	onUpdatePrompt: (prompt: Prompt) => void
}

export const PromptFolder: FC<Props> = ({
	searchTerm,
	prompts,
	currentFolder,
	onDeleteFolder,
	onUpdateFolder,
	// prompt props
	onDeletePrompt,
	onUpdatePrompt,
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

			const prompt = JSON.parse(e.dataTransfer.getData('prompt'))

			const updatedPrompt = {
				...prompt,
				folderId: folder.id,
			}

			onUpdatePrompt(updatedPrompt)

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
			<div className='relative flex items-center'>
				{isRenaming ? (
					<div className='flex w-full items-center gap-3 bg-background/90 p-3'>
						{isOpen ? (
							// <IconCaretDown size={18} />
							<i className='text-lg i-[ph--caret-down]'></i>
						) : (
							// <IconCaretRight size={18} />
							<i className='text-lg i-[ph--caret-right]'></i>
						)}
						<Input
							type='text'
							value={renameValue}
							onChange={(e) => setRenameValue(e.target.value)}
							onKeyDown={handleEnterDown}
							autoFocus
						/>
					</div>
				) : (
					<Button
						className='w-full gap-4 active:scale-100'
						variant='ghost'
						onClick={() => setIsOpen(!isOpen)}
						onDrop={(e) => handleDrop(e, currentFolder)}
						onDragOver={allowDrop}
						onDragEnter={highlightDrop}
						onDragLeave={removeHighlight}
					>
						{isOpen ? (
							// <IconCaretDown size={18} />
							<i className='text-lg i-[ph--caret-down]'></i>
						) : (
							// <IconCaretRight size={18} />
							<i className='text-lg i-[ph--caret-right]'></i>
						)}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className='relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3'>
										{currentFolder.name}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>{currentFolder.name}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</Button>
				)}

				{(isDeleting || isRenaming) && (
					<div className='absolute right-1 z-10 flex text-gray-300'>
						<Button
							variant='ghost'
							size='icon'
							className='h-4 w-4'
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
							{/* <IconCheck size={18} /> */}
							<i className='i-[ic--sharp-check] text-xl text-green-500 dark:text-green-400'></i>
						</Button>
						<Button
							variant='ghost'
							size='icon'
							className='h-4 w-4'
							onClick={(e) => {
								e.stopPropagation()
								setIsDeleting(false)
								setIsRenaming(false)
							}}
						>
							{/* <IconX size={18} /> */}
							<i className='text-lg i-[ph--x-bold]'></i>
						</Button>
					</div>
				)}

				{!isDeleting && !isRenaming && (
					<div className='absolute right-1 z-10 flex gap-2 text-gray-300'>
						<Button
							variant='ghost'
							size='icon'
							className='h-4 w-4'
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
							className='h-4 w-4'
							onClick={(e) => {
								e.stopPropagation()
								setIsDeleting(true)
							}}
						>
							<i className='i-[ion--trash-outline] text-lg text-red-400'></i>
						</Button>
					</div>
				)}
			</div>

			{isOpen
				? prompts.map((prompt, index) => {
						if (prompt.folderId === currentFolder.id) {
							return (
								<div
									key={index}
									className='ml-5 gap-2 border-l pl-2'
								>
									<PromptComponent
										prompt={prompt}
										onDeletePrompt={onDeletePrompt}
										onUpdatePrompt={onUpdatePrompt}
									/>
								</div>
							)
						}
				  })
				: null}
		</>
	)
}
