import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Prompt } from '@/types/prompt'
import { FC, MutableRefObject } from 'react'

interface Props {
	prompts: Prompt[]
	activePromptIndex: number
	onSelect: () => void
	onMouseOver: (index: number) => void
	promptListRef: MutableRefObject<HTMLUListElement | null>
}

export const PromptList: FC<Props> = ({
	prompts,
	activePromptIndex,
	onSelect,
	onMouseOver,
	promptListRef,
}) => {
	return (
		<Card className='z-10 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'>
			<ScrollArea>
				<ul
					ref={promptListRef}
					className='w-full max-h-52 rounded-[var(--radius)]'
				>
					{prompts.map((prompt, index) => (
						<li
							key={prompt.id}
							className={`${
								index === activePromptIndex ? 'bg-background' : ''
							} cursor-pointer px-3 py-2 text-sm rounded-[var(--radius)] text-foreground`}
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								onSelect()
							}}
							autoFocus={!index}
							onMouseEnter={() => onMouseOver(index)}
						>
							{prompt.name}
						</li>
					))}
				</ul>
			</ScrollArea>
		</Card>
	)
}
