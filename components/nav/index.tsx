import { SafeUser } from '@/types'
import { NextPage } from 'next'
import { Suspense } from 'react'
import Logo from './logo'
import Menu from './menu'
import ModeSwitch from './mode-switch'
import ThemeSwitch from './theme-switch'
import User from './user'

interface NavProps {
	currentUser: SafeUser | null
}

const Nav: NextPage<NavProps> = ({ currentUser }) => {
	return (
		<nav className='fixed top-0 z-30 flex flex-row justify-between items-center backdrop-blur-md w-full max-w-screen px-8 lg:px-16 border-b border-border h-navbar-height'>
			<div className='flex flex-row items-center gap-16'>
				<Logo />
				<Menu currentUser={currentUser} />
			</div>
			<div className='flex flex-row items-center gap-2'>
				<Suspense>
					<ThemeSwitch />
					<ModeSwitch />
					<User currentUser={currentUser} />
				</Suspense>
			</div>
		</nav>
	)
}

export default Nav
