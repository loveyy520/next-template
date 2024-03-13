'use client'

import { useThemeStore } from '@/styles/themes/utils'
import { Button } from '../ui/button'

const ModeSwitch = () => {
	const { mode, toggleMode } = useThemeStore()
	enum ModeIcon {
		LIGHT = 'i-[ph--sun-duotone]',
		DARK = 'i-[tabler--moon-stars]',
	}

	return (
		<Button
			variant='ghost'
			size='icon'
			className='group'
			onClick={toggleMode}
		>
			<i
				className={`${
					ModeIcon[mode.toUpperCase() as Uppercase<'dark' | 'light'>]
				} dark:text-yellow-200 group-hover:text-primary text-2xl`}
			></i>
		</Button>
	)
}

export default ModeSwitch
