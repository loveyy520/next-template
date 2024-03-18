'use client'

import {
	ButtonHTMLAttributes,
	ReactNode,
	forwardRef,
	useImperativeHandle,
} from 'react'

type Theme = 'primary' | 'success' | 'danger' | 'warning' | 'dark' | 'default'
type Size = 'mini' | 'small' | 'normal' | 'large'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	theme?: Theme
	size?: Size
	full?: boolean
	label?: string
	icon?: JSX.Element
	align?: 'left' | 'right' | 'center'
	isLink?: boolean
	className?: string
	children?: ReactNode
	onClick?: (...args: any) => any
}

interface Refs {
	click: () => void
}

interface SizeMap {
	[key: string]: string[]
}

export const OlButton = forwardRef<Refs, Props>(({ children, label, icon = <>

		</>, align = 'center', theme = 'default', size = 'normal', full = false, isLink = false, className = '', onClick = () => null, ...restProps }, ref) => {
	// 文字颜色
	const textColor = theme === 'default' ? 'text-black' : 'text-foreground'
	// 黑暗主题文字颜色
	const darkTextColor = 'text-foreground'

	// 按钮颜色
	const theme2ColorMap = {
		default:
			'bg-background hover:bg-red active:bg-background dark:bg-[#202123] dark:hover:bg-[#343541] dark:active:bg-red',
		primary:
			'bg-blue-500 hover:bg-blue-500 active:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-500 dark:active:bg-blue-500',
		success:
			'bg-green-300 hover:bg-green-300 active:bg-green-300 dark:bg-green-300 dark:hover:bg-green-300 dark:active:bg-green-300',
		danger:
			'bg-red-700 hover:bg-red-700 active:bg-red-700 dark:bg-red-700 dark:hover:bg-red-700 dark:active:bg-red-700',
		warning:
			'bg-origin-700 hover:bg-origin-700 active:bg-origin-700 dark:bg-origin-700 dark:hover:bg-origin-700 dark:active:bg-origin-700',
		dark: 'bg-[#202123] hover:bg-[#343541]/90 active:bg-origin-700 dark:bg-[#202123] dark:hover:bg-[#343541]/90 dark:active:bg-origin-700',
	}

	const sizeMap = {
		mini: ['h-3', 'text-xs'],
		small: ['h-6', 'text-sm'],
		normal: ['h-9', 'text-sm'],
		large: ['h-12', 'text-base'],
	}
	const height = sizeMap[size][0]
	const width = full ? 'w-full' : 'w-fit'
	const fontSize = sizeMap[size][1]

	const justifyMap = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end',
	}

	const classNames = [
		'flex items-center',
		justifyMap[align],
		'rounded-md',
		isLink ? 'border-none' : 'border',
		'px-2 py-1',
		textColor,
		`dark:${darkTextColor}`,
		theme2ColorMap[theme],
		width,
		height,
		className,
	]
	useImperativeHandle(ref, () => ({
		click: onClick,
	}))
	return (
		<button
			className={classNames.join(' ')}
			{...restProps}
			onClick={onClick}
		>
			{children || (
				<>
					{!!icon && <div>{icon}</div>}
					{!!label && (
						<span className={`${!!icon ? 'ml-3' : ''} ${fontSize}`}>
							{label}
						</span>
					)}
				</>
			)}
		</button>
	)
})

OlButton.displayName = 'ol-button'
