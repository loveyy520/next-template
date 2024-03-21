'use client'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import t from '@/i18n'
import { Conversation, Message } from '@/types/chat'
import { KeyValuePair } from '@/types/data'
import { ErrorMessage } from '@/types/error'
import { OpenAIModel, OpenAIModelID } from '@/types/openai'
import { Plugin } from '@/types/plugin'
import { Prompt } from '@/types/prompt'
import { throttle } from '@/utils'
import {
	FC,
	MutableRefObject,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Spinner } from '../Global/Spinner'
import { ChatInput } from './ChatInput'
import { ChatLoader } from './ChatLoader'
import { ChatMessage } from './ChatMessage'
import { ErrorMessageDiv } from './ErrorMessageDiv'
import { ModelSelect } from './ModelSelect'
import { SystemPrompt } from './SystemPrompt'

interface Props {
	lang: string
	conversation: Conversation
	models: OpenAIModel[]
	defaultModelId: OpenAIModelID
	messageIsStreaming: boolean
	modelError: ErrorMessage | null
	loading: boolean
	prompts: Prompt[]
	onSend: (message: Message, deleteCount: number, plugin: Plugin | null) => void
	onUpdateConversation: (conversation: Conversation, data: KeyValuePair) => void
	onEditMessage: (message: Message, messageIndex: number) => void
	stopConversationRef: MutableRefObject<boolean>
}

export const Chat: FC<Props> = memo(
	({
		lang,
		conversation,
		models,
		defaultModelId,
		messageIsStreaming,
		modelError,
		loading,
		prompts,
		onSend,
		onUpdateConversation,
		onEditMessage,
		stopConversationRef,
	}) => {
		const [currentMessage, setCurrentMessage] = useState<Message>()
		const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true)
		const [showScrollDownButton, setShowScrollDownButton] =
			useState<boolean>(false)

		const messagesEndRef = useRef<HTMLDivElement>(null)
		const chatContainerRef = useRef<HTMLDivElement>(null)
		const textareaRef = useRef<HTMLTextAreaElement>(null)

		const scrollToBottom = useCallback(() => {
			if (autoScrollEnabled) {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
				textareaRef.current?.focus()
			}
		}, [autoScrollEnabled])

		const handleScroll = () => {
			if (chatContainerRef.current) {
				const { scrollTop, scrollHeight, clientHeight } =
					chatContainerRef.current
				const bottomTolerance = 30

				if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
					setAutoScrollEnabled(false)
					setShowScrollDownButton(true)
				} else {
					setAutoScrollEnabled(true)
					setShowScrollDownButton(false)
				}
			}
		}

		const handleScrollDown = () => {
			chatContainerRef.current?.scrollTo({
				top: chatContainerRef.current.scrollHeight,
				behavior: 'smooth',
			})
		}

		const onClearAll = () => {
			onUpdateConversation(conversation, { key: 'messages', value: [] })
		}

		const scrollDown = () => {
			if (autoScrollEnabled) {
				messagesEndRef.current?.scrollIntoView(true)
			}
		}
		const throttledScrollDown = throttle(scrollDown, 250)

		useEffect(() => {
			throttledScrollDown()
			setCurrentMessage(conversation.messages[conversation.messages.length - 2])
		}, [conversation.messages, throttledScrollDown])

		useEffect(() => {
			const observer = new IntersectionObserver(
				([entry]) => {
					setAutoScrollEnabled(entry.isIntersecting)
					if (entry.isIntersecting) {
						textareaRef.current?.focus()
					}
				},
				{
					root: null,
					threshold: 0.5,
				}
			)
			const messagesEndElement = messagesEndRef.current
			if (messagesEndElement) {
				observer.observe(messagesEndElement)
			}
			return () => {
				if (messagesEndElement) {
					observer.unobserve(messagesEndElement)
				}
			}
		}, [messagesEndRef])

		return (
			<section className='relative flex-1 overflow-hidden bg-background '>
				{modelError ? (
					<ErrorMessageDiv error={modelError} />
				) : (
					<>
						<div
							className='max-h-full pt-9 overflow-x-hidden bg-background '
							ref={chatContainerRef}
							onScroll={handleScroll}
						>
							{conversation.messages.length === 0 ? (
								<>
									<section className='mx-auto flex w-[350px] flex-col space-y-10 pt-12 sm:w-[600px]'>
										<div className='text-center text-3xl font-semibold text-foreground'>
											{models.length === 0 ? (
												<Spinner
													size='16px'
													className='mx-auto'
												/>
											) : (
												'Chrior'
											)}
										</div>

										{models.length > 0 && (
											<Card className='flex h-full flex-col space-y-4 p-4 '>
												<ModelSelect
													model={conversation.model}
													models={models}
													defaultModelId={defaultModelId}
													onModelChange={(model) =>
														onUpdateConversation(conversation, {
															key: 'model',
															value: model,
														})
													}
												/>

												{process.env.OPENAI_API_KEY && (
													<SystemPrompt
														conversation={conversation}
														prompts={prompts}
														onChangePrompt={(prompt) =>
															onUpdateConversation(conversation, {
																key: 'prompt',
																value: prompt,
															})
														}
													/>
												)}
											</Card>
										)}
									</section>
								</>
							) : (
								<>
									<Card className='flex absolute w-full h-12 top-0 z-10 justify-center items-center border border-border bg-background py-2 text-sm text-foreground dark:border-none'>
										{t('Model')}: {conversation.model.name}
										<Popover>
											<PopoverTrigger asChild>
												<Button
													size='icon'
													variant='ghost'
													className='ml-2'
												>
													<i className='i-[material-symbols--settings]'></i>
												</Button>
											</PopoverTrigger>
											<PopoverContent className='w-80'>
												<ModelSelect
													model={conversation.model}
													models={models}
													defaultModelId={defaultModelId}
													onModelChange={(model) =>
														onUpdateConversation(conversation, {
															key: 'model',
															value: model,
														})
													}
												/>
											</PopoverContent>
										</Popover>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													size='icon'
													variant='ghost'
													className='ml-2'
												>
													<i className='i-[codicon--clear-all]'></i>
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														{t('Are you sure you want to clear all messages?')!}
													</AlertDialogTitle>
													<AlertDialogDescription>
														{
															t(
																'This action cannot be undone. This will permanently delete the messages.'
															)!
														}
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>{t('Cancel')!}</AlertDialogCancel>
													<AlertDialogAction onClick={onClearAll}>
														{t('Continue')}
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</Card>

									{conversation.messages.map((message, index) => (
										<ChatMessage
											lang={lang}
											key={index}
											message={message}
											messageIndex={index}
											onEditMessage={onEditMessage}
										/>
									))}

									{loading && <ChatLoader />}

									<div
										className='h-[162px] bg-background '
										ref={messagesEndRef}
									/>
								</>
							)}
						</div>

						<ChatInput
							stopConversationRef={stopConversationRef}
							textareaRef={textareaRef}
							messageIsStreaming={messageIsStreaming}
							conversationIsEmpty={conversation.messages.length === 0}
							model={conversation.model}
							prompts={prompts}
							onSend={(message, plugin) => {
								setCurrentMessage(message)
								onSend(message, 0, plugin)
							}}
							onRegenerate={() => {
								if (currentMessage) {
									onSend(currentMessage, 2, null)
								}
							}}
						/>
					</>
				)}
				{showScrollDownButton && (
					<div className='absolute bottom-52 right-0 mb-4 mr-4 pb-20'>
						<Button
							size='icon'
							variant='ghost'
							className='rounded-full h-7 w-7'
							onClick={handleScrollDown}
						>
							<i className='i-[material-symbols--keyboard-arrow-down-rounded] text-lg'></i>
						</Button>
					</div>
				)}
			</section>
		)
	}
)
Chat.displayName = 'Chat'
