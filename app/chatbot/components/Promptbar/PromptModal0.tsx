'use client'
import { Button } from '@/components/ui/button'
import t from '@/i18n'
import { Prompt } from '@/types/prompt'
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'

interface Props {
	prompt: Prompt
	onClose: () => void
	onUpdatePrompt: (prompt: Prompt) => void
}

export const PromptModal: FC<Props> = ({ prompt, onClose, onUpdatePrompt }) => {
	const [name, setName] = useState(prompt.name)
	const [description, setDescription] = useState(prompt.description)
	const [content, setContent] = useState(prompt.content)

	const modalRef = useRef<HTMLDivElement>(null)
	const nameInputRef = useRef<HTMLInputElement>(null)

	const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			onUpdatePrompt({ ...prompt, name, description, content: content.trim() })
			onClose()
		}
	}

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				window.addEventListener('mouseup', handleMouseUp)
			}
		}

		const handleMouseUp = (e: MouseEvent) => {
			window.removeEventListener('mouseup', handleMouseUp)
			onClose()
		}

		window.addEventListener('mousedown', handleMouseDown)

		return () => {
			window.removeEventListener('mousedown', handleMouseDown)
		}
	}, [onClose])

	useEffect(() => {
		nameInputRef.current?.focus()
	}, [])

	return (
		<div
			className='fixed inset-0 flex items-center justify-center bg-background bg-opacity-50 z-100'
			onKeyDown={handleEnter}
		>
			<div className='fixed inset-0 z-10 overflow-y-auto'>
				<div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
					<div
						className='hidden sm:inline-block sm:h-screen sm:align-middle'
						aria-hidden='true'
					/>

					<div
						ref={modalRef}
						className='overflow-scroll inline-block max-h-[400px] transform rounded-lg border border-border bg-background px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle'
						role='dialog'
					>
						<div className='text-sm font-bold text-foreground'>{t('Name')}</div>
						<input
							ref={nameInputRef}
							className='mt-2 w-full rounded-lg border border-border px-4 py-2 text-foreground shadow focus:outline-none'
							placeholder={t('A name for your prompt.') || ''}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>

						<div className='mt-6 text-sm font-bold text-foreground'>
							{t('Description')}
						</div>
						<textarea
							className='mt-2 w-full rounded-lg border border-border px-4 py-2 text-foreground shadow focus:outline-none'
							style={{ resize: 'none' }}
							placeholder={t('A description for your prompt.') || ''}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
						/>

						<div className='mt-6 text-sm font-bold text-foreground'>
							{t('Prompt')}
						</div>
						<textarea
							className='mt-2 w-full rounded-lg border border-border px-4 py-2 text-foreground shadow focus:outline-none'
							style={{ resize: 'none' }}
							placeholder={
								t(
									'Prompt content. Use {{}} to denote a variable. Ex: {{name}} is a {{adjective}} {{noun}}'
								) || ''
							}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={10}
						/>

						<Button
							className='mt-6'
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
							{t('Save')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
