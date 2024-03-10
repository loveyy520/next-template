import { Suspense } from 'react'
import Logo from './logo'
import Menu from './menu'
import ModeSwitch from './mode-switch'
import ThemeSwitch from './theme-switch'

const Nav = () => {
	return (
		<nav className='flex flex-row justify-between items-center h-navbar-height'>
			<Logo />
			<Menu />
			<div className='flex flex-row items-center gap-2'>
				<Suspense>
					<ThemeSwitch />
				</Suspense>
				<ModeSwitch />
			</div>
		</nav>
	)
}

export default Nav
