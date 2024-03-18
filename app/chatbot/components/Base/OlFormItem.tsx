import { FC, ReactElement } from 'react'
import { Rules } from './OlForm'
interface Props {
	children?: ReactElement
	rules?: Rules
	prop?: string
	required?: boolean
	label?: string
	labelWidth?: number
	withSemicolon?: boolean
}

export const OlFormItem: FC<Props> = ({
	children = <></>,
	label = '',
	prop = '',
	rules = [],
	labelWidth = 90,
	withSemicolon = true,
}) => {
	const labelClassNames = [
		'pr-4',
		'h-[34px]',
		'leading-[34px]',
		'self-center',
		'text-slate-700',
		'',
		'text-right',
	]
	return (
		<div className='flex items-start justify-start pt-1 pb-4'>
			<div
				className={labelClassNames.join(' ')}
				style={{ width: `${labelWidth}px` }}
			>
				{withSemicolon ? label + ':' : label}
			</div>
			{children}
		</div>
	)
}
