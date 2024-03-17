import t from '@/i18n'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center gap-6'>
			<h2>{t('Not Found')}</h2>
			<p>{t('Could not find requested resource')}</p>
			<div
				className='
                    w-fit
                    px-4
                    py-2
                    rounded-[var(--radius)]
                    bg-primary
                    text-foreground
                    hover:bg-primary/90
                    cursor-pointer'
			>
				<Link href='/'>{t('Return Home')}</Link>
			</div>
		</div>
	)
}
