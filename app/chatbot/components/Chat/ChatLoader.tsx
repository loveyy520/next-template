import { FC } from 'react'

interface Props {}

export const ChatLoader: FC<Props> = () => {
	return (
		<div
			className='group border-b border-border bg-background text-gray-800   dark:text-gray-100'
			style={{ overflowWrap: 'anywhere' }}
		>
			<div className='m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl'>
				<div className='min-w-[40px] text-right font-bold'>Bot:</div>
				<i className='animate-pulse i-[eos-icons--three-dots-loading]'></i>
			</div>
		</div>
	)
}
