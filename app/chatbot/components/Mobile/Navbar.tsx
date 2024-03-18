import { Button } from '@/components/ui/button'
import { Conversation } from '@/types/chat'
import { FC } from 'react'

interface Props {
	selectedConversation: Conversation
	onNewConversation: () => void
}

export const Navbar: FC<Props> = ({
	selectedConversation,
	onNewConversation,
}) => {
	return (
		<nav className='fixed left-0 top-16 flex w-full justify-between bg-background border-b border-border py-2 px-4'>
			<div className='mr-4'></div>

			<div className='flex justify-center items-center max-w-[240px] overflow-hidden text-ellipsis text-foreground whitespace-nowrap'>
				{selectedConversation.name}
			</div>

			<Button
				size='icon'
				variant='ghost'
			>
				<i
					className='i-[material-symbols--add]'
					onClick={onNewConversation}
				/>
			</Button>
		</nav>
	)
}
