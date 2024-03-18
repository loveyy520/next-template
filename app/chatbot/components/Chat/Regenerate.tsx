import { Button } from '@/components/ui/button'
import t from '@/i18n'
import { FC } from 'react'

interface Props {
	onRegenerate: () => void
}

export const Regenerate: FC<Props> = ({ onRegenerate }) => {
	return (
		<div className='fixed bottom-4 left-0 right-0 ml-auto mr-auto w-full px-2 sm:absolute sm:bottom-8 sm:left-[280px] sm:w-1/2 lg:left-[200px]'>
			<div className='mb-4 text-center text-red-500'>
				{t('Sorry, there was an error.')}
			</div>
			<Button onClick={onRegenerate}>
				{/* <IconRefresh /> */}
				<i className='i-[jam--refresh]'></i>
				<span>{t('Regenerate response')}</span>
			</Button>
		</div>
	)
}
