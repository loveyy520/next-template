'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import t from '@/i18n'
import { SafeUser } from '@/types'
import { NextPage } from 'next'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import MenuItemLogin from './menu-item-login'

interface UserProps {
	currentUser: SafeUser | null
}

const User: NextPage<UserProps> = ({ currentUser }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className='group'
					variant={'ghost'}
					size={'icon'}
				>
					<i className='i-[tabler--user-circle] text-gray-500 group-hover:text-primary text-2xl'></i>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				{!currentUser ? (
					<DropdownMenuGroup>
						<DropdownMenuItem>
							{/* <Link
								href='/login'
								className='flex w-full items-center'
							>
								<i className='i-[lets-icons--sign-in-circle-duotone-line] mr-2 h-4 w-4'></i>
								<span>{t('Login')}</span>
								<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
							</Link> */}
							<MenuItemLogin />
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link
								href='/register'
								className='flex w-full items-center'
							>
								<i className='i-[ph--trademark-registered] mr-2 h-4 w-4'></i>
								<span>{t('Sign up for free')}</span>
								<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				) : (
					<>
						<DropdownMenuGroup>
							<DropdownMenuLabel>
								{currentUser?.name ?? t('My Account')}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								{/* <User className='mr-2 h-4 w-4' /> */}
								<span>{t('Profile')}</span>
								<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuItem>
								{/* <Users className='mr-2 h-4 w-4' /> */}
								<span>Team</span>
							</DropdownMenuItem>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									{/* <UserPlus className='mr-2 h-4 w-4' /> */}
									<span>Invite users</span>
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuItem>
											{/* <Mail className='mr-2 h-4 w-4' /> */}
											<span>Email</span>
										</DropdownMenuItem>
										<DropdownMenuItem>
											{/* <MessageSquare className='mr-2 h-4 w-4' /> */}
											<span>Message</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											{/* <PlusCircle className='mr-2 h-4 w-4' /> */}
											<span>More...</span>
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
							<DropdownMenuItem>
								{/* <Plus className='mr-2 h-4 w-4' /> */}
								<span>New Team</span>
								<DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => signOut()}>
							{/* <LogOut className='mr-2 h-4 w-4' /> */}
							<i className='i-[lets-icons--sign-out-circle-duotone-line] mr-2 h-4 w-4 text-red-300'></i>
							<span className='text-red-300'>{t('Log out')}</span>
							<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default User
