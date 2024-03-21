import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import t from '@/i18n'
import { Prompt } from '@/types/prompt'
import { FC, KeyboardEvent, useCallback, useState } from 'react'

interface PromptModalProps {
	open: boolean
	prompt: Prompt
	onClose: () => void
	onUpdatePrompt: (prompt: Prompt) => void
}

const PromptModal: FC<PromptModalProps> = ({
	open,
	prompt,
	onClose,
	onUpdatePrompt,
}) => {
	const [name, setName] = useState(prompt?.name ?? '')
	const [description, setDescription] = useState(prompt.description)
	const [content, setContent] = useState(prompt.content)

	const handleEnter = useCallback(
		(e: KeyboardEvent<HTMLDivElement>) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				onUpdatePrompt({
					...prompt,
					name,
					description,
					content: content.trim(),
				})
				onClose()
			}
		},
		[prompt, name, description, content, onClose, onUpdatePrompt]
	)

	const handleOpenChange = useCallback(
		(value: boolean) => {
			!value && onClose()
		},
		[onClose]
	)
	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}
		>
			<DialogTrigger />
			<DialogContent
				className='max-w-screen sm:max-w-[425px] md:max-w-[600px]'
				onKeyDown={handleEnter}
			>
				<DialogHeader>
					<DialogTitle>{t('Edit Prompt')!}</DialogTitle>
					<DialogDescription>
						{
							t(
								'Make changes to your prompt here. Click save when you finish it.'
							)!
						}
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-5 py-4'>
					<div className='grid grid-cols-1 items-center gap-2'>
						<Label
							htmlFor='name'
							className='text-left'
						>
							{t('Name')!}
						</Label>
						<Input
							id='name'
							autoFocus
							defaultValue='Pedro Duarte'
							className='col-span-3'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className='grid grid-cols-1 items-center gap-2'>
						<Label
							htmlFor='description'
							className='text-left'
						>
							{t('Description')!}
						</Label>
						<Textarea
							id='description'
							defaultValue='@peduarte'
							placeholder={t('A description for your prompt.')!}
							className='col-span-3 resize-none'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
						/>
					</div>
					<div className='grid grid-cols-1 items-center gap-2'>
						<Label
							htmlFor='content'
							className='text-left'
						>
							{t('Content')!}
						</Label>
						<Textarea
							id='content'
							defaultValue='@peduarte'
							placeholder={
								t(
									'Prompt content. Use{{}} to denote a variable. Ex: {{name}} is a {{adjective}} {{noun}}'
								)!
							}
							className='col-span-3 resize-none'
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={5}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={() => {
							const updatedPrompt = {
								...prompt,
								name,
								description,
								content: content.trim(),
							}

							onUpdatePrompt(updatedPrompt)
							onClose()
						}}
					>
						{t('Save changes')!}
					</Button>
					<DialogClose>
						<Button
							variant='outline'
							onClick={onClose}
						>
							{t('Cancel')!}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default PromptModal
