'use client'

import { type TFunction } from '@/i18n'
import { Plugin, PluginList } from '@/types/plugin'
import { FC, useEffect, useRef } from 'react'

interface Props {
	t: TFunction
	plugin: Plugin | null
	onPluginChange: (plugin: Plugin) => void
}

export const PluginSelect: FC<Props> = ({ t, plugin, onPluginChange }) => {
	const selectRef = useRef<HTMLSelectElement>(null)

	useEffect(() => {
		if (selectRef.current) {
			selectRef.current.focus()
		}
	}, [])

	return (
		<div className='flex flex-col'>
			<div className='w-full rounded-lg border border-border bg-transparent pr-2 text-foreground  '>
				<select
					ref={selectRef}
					className='w-full cursor-pointer bg-transparent p-2'
					placeholder={t('Select a plugin') || ''}
					value={plugin?.id || ''}
					onChange={(e) => {
						onPluginChange(
							PluginList.find(
								(plugin) => plugin.id === e.target.value
							) as Plugin
						)
					}}
				>
					<option
						key='none'
						value=''
						className=' '
					>
						Select Plugin
					</option>

					{PluginList.map((plugin) => (
						<option
							key={plugin.id}
							value={plugin.id}
							className=' '
						>
							{plugin.name}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}
