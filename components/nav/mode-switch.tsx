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
			size='sm'
			className='group'
			onClick={toggleMode}
		>
			<i
				className={`${
					ModeIcon[mode.toUpperCase() as Uppercase<'dark' | 'light'>]
				} group-hover:text-primary`}
			></i>
		</Button>
	)
}

export default ModeSwitch
