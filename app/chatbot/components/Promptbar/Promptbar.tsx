'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import t from '@/i18n'
import { Folder } from '@/types/folder'
import { Prompt } from '@/types/prompt'
import { FC, useEffect, useState } from 'react'
import { PromptFolders } from '../Folders/Prompt/PromptFolders'
import { Search } from '../Sidebar/Search'
import { PromptbarSettings } from './PromptbarSettings'
import { Prompts } from './Prompts'

interface Props {
	prompts: Prompt[]
	folders: Folder[]
	onCreateFolder: (name: string) => void
	onDeleteFolder: (folderId: string) => void
	onUpdateFolder: (folderId: string, name: string) => void
	onCreatePrompt: () => void
	onUpdatePrompt: (prompt: Prompt) => void
	onDeletePrompt: (prompt: Prompt) => void
}

export const Promptbar: FC<Props> = ({
	folders,
	prompts,
	onCreateFolder,
	onDeleteFolder,
	onUpdateFolder,
	onCreatePrompt,
	onUpdatePrompt,
	onDeletePrompt,
}) => {
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts)

	const handleUpdatePrompt = (prompt: Prompt) => {
		onUpdatePrompt(prompt)
		setSearchTerm('')
	}

	const handleDeletePrompt = (prompt: Prompt) => {
		onDeletePrompt(prompt)
		setSearchTerm('')
	}

	const handleDrop = (e: any) => {
		if (e.dataTransfer) {
			const prompt = JSON.parse(e.dataTransfer.getData('prompt'))

			const updatedPrompt = {
				...prompt,
				folderId: e.target.dataset.folderId,
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
		if (searchTerm) {
			setFilteredPrompts(
				prompts.filter((prompt) => {
					const searchable =
						prompt.name.toLowerCase() +
						' ' +
						prompt.description.toLowerCase() +
						' ' +
						prompt.content.toLowerCase()
					return searchable.includes(searchTerm.toLowerCase())
				})
			)
		} else {
			setFilteredPrompts(prompts)
		}
	}, [searchTerm, prompts])

	return (
		<div
			className={`fixed top-header-height bottom-0 right-0 z-50 flex h-full w-[270px] flex-none flex-col space-y-2 p-2 text-[14px] transition-all sm:relative sm:h-inherit sm:top-0`}
		>
			<div className='flex gap-4 items-center'>
				<Button
					className='text-primary-foreground w-[190px] flex-shrink-0 select-none items-center gap-3'
					onClick={() => {
						onCreatePrompt()
						setSearchTerm('')
					}}
				>
					{/* <IconPlus size={16} /> */}
					<i className='text-base i-[material-symbols--add]'></i>
					{t('New prompt')}
				</Button>

				<Button
					size='icon'
					onClick={() => onCreateFolder(t('New folder'))}
				>
					{/* <IconFolderPlus size={16} /> */}
					<i className='text-base text-primary-foreground i-[tabler--folder-plus]'></i>
				</Button>
			</div>

			{prompts.length > 1 && (
				<Search
					placeholder={t('Search prompts...') || ''}
					searchTerm={searchTerm}
					onSearch={setSearchTerm}
				/>
			)}

			<ScrollArea>
				{folders.length > 0 && (
					<div className='flex pb-2 border-b border-border'>
						<PromptFolders
							searchTerm={searchTerm}
							prompts={filteredPrompts}
							folders={folders}
							onUpdateFolder={onUpdateFolder}
							onDeleteFolder={onDeleteFolder}
							// prompt props
							onDeletePrompt={handleDeletePrompt}
							onUpdatePrompt={handleUpdatePrompt}
						/>
					</div>
				)}

				{prompts.length > 0 ? (
					<div
						className='pt-2'
						onDrop={(e) => handleDrop(e)}
						onDragOver={allowDrop}
						onDragEnter={highlightDrop}
						onDragLeave={removeHighlight}
					>
						<Prompts
							prompts={filteredPrompts.filter((prompt) => !prompt.folderId)}
							onUpdatePrompt={handleUpdatePrompt}
							onDeletePrompt={handleDeletePrompt}
						/>
					</div>
				) : (
					<div className='mt-8 text-center text-foreground opacity-50 select-none'>
						{/* <IconMistOff className='mx-auto mb-3' /> */}
						<i className='i-[tabler--mist-off] mx-auto mb-3'></i>
						<span className='text-[14px] leading-normal'>
							{t('No prompts.')}
						</span>
					</div>
				)}
			</ScrollArea>

			<PromptbarSettings />
		</div>
	)
}
