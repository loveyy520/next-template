'use client'

import { Message } from '@/types/chat'
import Image from 'next/image'
import { FC, memo, useEffect, useRef, useState } from 'react'
// import rehypeMathjax from 'rehype-mathjax';
import t from '@/i18n'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { CodeBlock } from '../Markdown/CodeBlock'
import { MemoizedReactMarkdown } from '../Markdown/MemoizedReactMarkdown'

interface Props {
	lang: string
	message: Message
	messageIndex: number
	onEditMessage: (message: Message, messageIndex: number) => void
}

const userAvatar = 'https://assets.onlyy.vip/icons/dst/Willow.png'
const botAvatar = 'https://assets.onlyy.vip/icons/dst/Wendy.png'
const avatarSize = 36

const decorations = ['🦋', '🦋', '🍒', '🍒', '🍭', '🍭', '🍷', '🍷']

export const ChatMessage: FC<Props> = memo(
	({ message, messageIndex, onEditMessage, lang }) => {
		const [isEditing, setIsEditing] = useState<boolean>(false)
		const [isTyping, setIsTyping] = useState<boolean>(false)
		const [messageContent, setMessageContent] = useState(message.content)
		const [messagedCopied, setMessageCopied] = useState(false)

		const textareaRef = useRef<HTMLTextAreaElement>(null)

		const toggleEditing = () => {
			setIsEditing(!isEditing)
		}

		const handleInputChange = (
			event: React.ChangeEvent<HTMLTextAreaElement>
		) => {
			setMessageContent(event.target.value)
			if (textareaRef.current) {
				textareaRef.current.style.height = 'inherit'
				textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
			}
		}

		const handleEditMessage = () => {
			if (message.content != messageContent) {
				onEditMessage({ ...message, content: messageContent }, messageIndex)
			}
			setIsEditing(false)
		}

		const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
				e.preventDefault()
				handleEditMessage()
			}
		}

		const copyOnClick = () => {
			if (!navigator.clipboard) return

			navigator.clipboard.writeText(message.content).then(() => {
				setMessageCopied(true)
				setTimeout(() => {
					setMessageCopied(false)
				}, 2000)
			})
		}

		useEffect(() => {
			if (textareaRef.current) {
				textareaRef.current.style.height = 'inherit'
				textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
			}
		}, [isEditing])

		return (
			<div
				className={`group ${
					message.role === 'assistant'
						? 'text-gray-800 dark:text-gray-100'
						: 'text-gray-800 dark:text-gray-100'
				}`}
				style={{ overflowWrap: 'anywhere' }}
			>
				<div
					className={`relative m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl ${
						message.role === 'assistant'
							? 'chat-message'
							: 'chat-message-reverse'
					}`}
				>
					{message.role === 'assistant' ? (
						<Image
							className='rounded'
							src={botAvatar}
							alt='Onlyy Bot'
							width={avatarSize}
							height={avatarSize}
							typeof='round'
							quality={100}
						/>
					) : (
						<Image
							className='rounded'
							src={userAvatar}
							alt='Me'
							width={avatarSize}
							height={avatarSize}
							quality={100}
						/>
					)}

					<div
						className={`prose dark:prose-invert rounded relative ${
							message.role === 'assistant'
								? 'message-bubble-wrapper'
								: 'message-bubble-reverse-wrapper'
						}`}
					>
						<div
							className={`prose w-full dark:prose-invert rounded overflow-hidden p-1 ${
								message.role === 'assistant'
									? 'message-bubble'
									: 'message-bubble-reverse'
							}`}
						>
							{message.role === 'assistant' && (
								<span className='bubble-decoration'>
									{decorations[messageIndex % 8]}
								</span>
							)}
							{message.role === 'user' ? (
								<div className='flex w-full'>
									{isEditing ? (
										<div className='flex w-full flex-col'>
											<textarea
												ref={textareaRef}
												className='w-full resize-none whitespace-pre-wrap border-none  rounded p-1 '
												value={messageContent}
												onChange={handleInputChange}
												onKeyDown={handlePressEnter}
												onCompositionStart={() => setIsTyping(true)}
												onCompositionEnd={() => setIsTyping(false)}
												style={{
													fontFamily: 'inherit',
													fontSize: 'inherit',
													lineHeight: 'inherit',
													padding: '0',
													margin: '0',
													overflow: 'hidden',
												}}
											/>

											<div className='mt-10 flex justify-center space-x-4'>
												<button
													className='h-[40px] rounded-md bg-blue-500 px-4 py-1 text-sm font-medium text-foreground enabled:hover:bg-blue-600 disabled:opacity-50'
													onClick={handleEditMessage}
													disabled={messageContent.trim().length <= 0}
												>
													{t('Save & Submit')}
												</button>
												<button
													className='h-[40px] rounded-md border border-border px-4 py-1 text-sm font-medium text-foreground bg-background dark:hover:bg-neutral-800'
													onClick={() => {
														setMessageContent(message.content)
														setIsEditing(false)
													}}
												>
													{t('Cancel')}
												</button>
											</div>
										</div>
									) : (
										<div className='prose whitespace-pre-wrap dark:prose-invert  '>
											{message.content}
										</div>
									)}

									{((typeof window !== 'undefined' &&
										window.innerWidth < 640) ||
										!isEditing) && (
										<button
											className={`absolute translate-x-[1000px] text-gray-500 hover:text-gray-700 focus:translate-x-0 group-hover:translate-x-0 dark:text-gray-400 dark:hover:text-gray-300 top-0 right-0`}
											onClick={toggleEditing}
										>
											<i className='text-lg i-[material-symbols--contract-edit-rounded]'></i>
										</button>
									)}
								</div>
							) : (
								<>
									<div
										className={`absolute top-0 right-0 ${
											typeof window !== 'undefined' && window.innerWidth < 640
												? ''
												: 'm-0'
										}`}
									>
										{messagedCopied ? (
											<i className='i-[ic--sharp-check] text-xl text-green-500 dark:text-green-400'></i>
										) : (
											<button
												className='translate-x-[1000px] text-gray-500 hover:text-gray-700 focus:translate-x-0 group-hover:translate-x-0 dark:text-gray-400 dark:hover:text-gray-300'
												onClick={copyOnClick}
											>
												<i className='text-xl i-[ph--copy-simple]'></i>
											</button>
										)}
									</div>

									<MemoizedReactMarkdown
										className='prose dark:prose-invert '
										remarkPlugins={[remarkGfm, remarkMath]}
										// rehypePlugins={[rehypeMathjax]}
										components={{
											code({ node, inline, className, children, ...props }) {
												const match = /language-(\w+)/.exec(className || '')

												return !inline ? (
													<CodeBlock
														lang={lang}
														key={Math.random()}
														language={(match && match[1]) || ''}
														value={String(children).replace(/\n$/, '')}
														{...props}
													/>
												) : (
													<code
														className={className}
														{...props}
													>
														{children}
													</code>
												)
											},
											table({ children }) {
												return (
													<table className='border-collapse border border-border px-3 py-1'>
														{children}
													</table>
												)
											},
											th({ children }) {
												return (
													<th className='break-words border border-border bg-background px-3 py-1 text-foreground'>
														{children}
													</th>
												)
											},
											td({ children }) {
												return (
													<td className='break-words border border-border px-3 py-1'>
														{children}
													</td>
												)
											},
										}}
									>
										{message.content}
									</MemoizedReactMarkdown>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		)
	}
)
ChatMessage.displayName = 'ChatMessage'
