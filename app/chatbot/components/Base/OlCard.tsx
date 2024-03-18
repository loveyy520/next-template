'use client'
import Image from 'next/image'
import { FC, ReactElement, ReactNode, useState } from 'react'
interface Props {
	showHeader?: boolean
	headerIcon?: string
	closeable?: boolean
	title?: string
	subtitle?: string
	suffix?: ReactElement | ReactElement[]
	opacity?: number
	children?: ReactNode
	footer?: ReactElement | ReactElement[]
}

export const OlCard: FC<Props> = ({
	showHeader = false,
	headerIcon = '',
	closeable = false,
	title = '',
	subtitle = '',
	suffix = <></>,
	opacity = 100, // 0 - 100
	children = <></>,
	footer = <></>,
}) => {
	const [visible, setVisible] = useState(true)
	function close() {
		setVisible(false)
	}

	const olCardClassNames = [
		'border',
		'rounded-lg',
		'shadow-sm hover:shadow-md',
		'shadow-green-100 hover:shadow-slate-500',
		'dark:hover:shadow-white',
		'p-6',
		`opacity-${opacity}`,
	]
	return visible ? (
		<section className={olCardClassNames.join(' ')}>
			{showHeader && (
				<header className='pb-3 flex items-center justify-between'>
					<div className='flex items-center justify-between'>
						{!!headerIcon && (
							<Image
								className='mr-4 rounded-md'
								src={headerIcon}
								alt='header-icon'
								height={30}
								width={30}
							/>
						)}
						<span className='card-title font-semibold text-base text-slate-700 '>
							{title}
						</span>
						{!!subtitle && (
							<span className='card-subtitle font-norma text-xs text-slate-400 '>{` - ${subtitle}`}</span>
						)}
						{!!suffix && suffix}
					</div>
					{closeable && <i onClick={close}>x</i>}
				</header>
			)}
			<section>{children}</section>
			{footer && <footer>{footer}</footer>}
		</section>
	) : (
		<></>
	)
}
