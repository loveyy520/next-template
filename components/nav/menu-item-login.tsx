import t from '@/i18n'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useMemo } from 'react'
import { DropdownMenuShortcut } from '../ui/dropdown-menu'
const MenuItem = () => {
	const redirectPathname = usePathname()
	const redirectSearchParams = useSearchParams()
	const loginUrl = useMemo(
		() =>
			['/', '/register', '/login'].includes(redirectPathname)
				? '/login'
				: `/login?redirect=${redirectPathname}${redirectSearchParams}`,
		[redirectPathname, redirectSearchParams]
	)
	return (
		<Link
			href={loginUrl}
			className='flex w-full items-center'
		>
			<i className='i-[lets-icons--sign-in-circle-duotone-line] mr-2 h-4 w-4'></i>
			<span>{t('Login')}</span>
			<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
		</Link>
	)
}

const MenuItemLogin = () => (
	<Suspense>
		<MenuItem />
	</Suspense>
)

export default MenuItemLogin
