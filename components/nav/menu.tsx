'use client'

import Link from 'next/link'

import { cn } from '@/lib/utils'
// import { Icons } from '@/components/icons'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import t from '@/i18n'
import { SafeUser } from '@/types'
import { NextPage } from 'next'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip'

interface MenuProps {
	currentUser: SafeUser | null
}

const components: { title: string; href: string; description: string }[] = [
	{
		title: 'Alert Dialog',
		href: '/docs/primitives/alert-dialog',
		description:
			'A modal dialog that interrupts the user with important content and expects a response.',
	},
	{
		title: 'Hover Card',
		href: '/docs/primitives/hover-card',
		description:
			'For sighted users to preview content available behind a link.',
	},
	{
		title: 'Progress',
		href: '/docs/primitives/progress',
		description:
			'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
	},
	{
		title: 'Scroll-area',
		href: '/docs/primitives/scroll-area',
		description: 'Visually or semantically separates content.',
	},
	{
		title: 'Tabs',
		href: '/docs/primitives/tabs',
		description:
			'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
	},
	{
		title: 'Tooltip',
		href: '/docs/primitives/tooltip',
		description:
			'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
	},
]

const Menu: NextPage<MenuProps> = ({ currentUser }) => {
	return (
		<NavigationMenu className='hidden md:flex'>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>{t('Chatbot')}</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
							<li className='row-span-3'>
								<NavigationMenuLink asChild>
									<Link
										className='flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
										href='/chatbot'
									>
										{/* <Icons.logo className='h-6 w-6' /> */}
										<div className='mb-2 text-lg font-medium'>
											{t('Chriorist')}
										</div>
										<p className='text-sm leading-tight text-muted-foreground'>
											{t(
												'Chriorist could chat with you as a partner or assistant so as to help you to find inspiration.'
											)}
										</p>
									</Link>
								</NavigationMenuLink>
							</li>
							<ListItem
								href='/chatbot/v3'
								title={t('Chriorist 3.0')}
							>
								{t('Get started with Chriorist 3.0.')}
							</ListItem>
							<ListItem
								href='/chatbot/v4'
								title={t('Chriorist 4.0')}
							>
								{t('This is a new version of Chriorist.')}
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<TooltipProvider delayDuration={300}>
						<Tooltip>
							<TooltipTrigger asChild>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									asChild
								>
									<Link
										href='/photor'
										passHref
									>
										{t('Photor')}
									</Link>
								</NavigationMenuLink>
							</TooltipTrigger>
							<TooltipContent>
								<p>{t('Generate photo from text.')}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<TooltipProvider delayDuration={300}>
						<Tooltip>
							<TooltipTrigger asChild>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									asChild
								>
									<Link
										href='/video-maker'
										passHref
									>
										{t('VideoGenerator')}
									</Link>
								</NavigationMenuLink>
							</TooltipTrigger>
							<TooltipContent>
								<p>{t('Generate video from photo.')}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	)
}

export default Menu

const ListItem = forwardRef<ElementRef<'a'>, ComponentPropsWithoutRef<'a'>>(
	({ className, title, children, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<a
						ref={ref}
						className={cn(
							'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
							className
						)}
						{...props}
					>
						<div className='text-sm font-medium leading-none'>{title}</div>
						<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
							{children}
						</p>
					</a>
				</NavigationMenuLink>
			</li>
		)
	}
)
ListItem.displayName = 'ListItem'
