import type { Metadata } from 'next'
// import { Inter } from "next/font/google";
import './globals.css'

// const inter = Inter({ subsets: ["latin"] });
import Nav from '@/components/nav'
import { defaultRadius, defaultTheme } from '@/styles/themes/consts'

import getCurrentUser from '@/actions/getCurrentUser'
import { Toaster } from '@/components/ui/toaster'
import { CSSProperties, ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Next Template',
	description: 'Generated by create next app',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	const currentUser = await getCurrentUser()
	console.log('=====================user:', currentUser)

	return (
		<html
			lang='en'
			style={{ '--radius': `${defaultRadius}em;` } as CSSProperties}
			data-theme={defaultTheme.toLowerCase()}
		>
			<body>
				<Nav currentUser={currentUser} />
				<Toaster />
				<div className='px-8 lg:px-16 pt-20 lg:pt-28 pb-12 h-screen overflow-x-hidden'>
					{children}
				</div>
				<div className='texture'></div>
				<div className='dark:bg-[url(/images/bg-color.png)] bg-[-450px_-300px] md:bg-center lg:bg-left dark:h-screen dark:w-screen opacity-90 fixed top-0 z-[9999] pointer-events-none'></div>
			</body>
		</html>
	)
}
