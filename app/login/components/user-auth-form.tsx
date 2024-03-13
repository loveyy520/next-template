'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
// import { Icons } from "@/components/icons"
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import t from '@/i18n'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { type BuiltInProviderType } from 'next-auth/providers/index'
import { signIn, type LiteralUnion } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const formSchema = z.object({
	email: z.string().email({
		message: 'Email is required.',
	}),
	name: z
		.string()
		.min(8, {
			message: 'Name needs at least 8 characters.',
		})
		.max(20, {
			message: 'Name needs at most 20 characters.',
		}),
	password: z
		.string()
		.min(8, {
			message: 'Password needs at least 8 characters.',
		})
		.max(16, {
			message: 'Password needs at most 16 characters.',
		}),
})
type RegisterFormSchemaType = z.infer<typeof formSchema>

function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	// async function onSubmit(event: React.SyntheticEvent) {
	// 	event.preventDefault()
	// 	setIsLoading(true)
	// 	setTimeout(() => {
	// 		setIsLoading(false)
	// 	}, 3000)
	// }

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			name: '',
			password: '',
		},
	})

	const { toast } = useToast()

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true)
			await axios.post('/api/register', data)
			toast({
				description: t('Success'),
			})
		} catch (e: any) {
			toast({
				description: e.message || e,
			})
		} finally {
			setIsLoading(false)
		}
	}

	const Spinner = () => (
		<i className='i-[svg-spinners--clock] mr-2 h-4 w-4 text-blue-600'></i>
	)

	const signInWith = async (provider: LiteralUnion<BuiltInProviderType>) => {
		setIsLoading(true)
		await signIn(provider)
		setIsLoading(false)
	}

	return (
		<div
			className={cn('grid gap-6', className)}
			{...props}
		>
			<Form {...form}>
				<form
					className='flex flex-col gap-4'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem className='relative'>
								<FormControl>
									<Input
										className='peer'
										placeholder=''
										disabled={isLoading}
										{...field}
									/>
								</FormControl>
								<FormLabel
									className='
										absolute
										top-0
										left-3
										transform
										origin-top-left
										duration-300
										-translate-y-2
										scale-75
										peer-placeholder-shown:scale-100
										peer-placeholder-shown:translate-y-1
										peer-focus:scale-75
										peer-focus:-translate-y-2
									'
								>
									{t('Email')}
								</FormLabel>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='relative'>
								<FormControl>
									<Input
										className='peer'
										placeholder=''
										disabled={isLoading}
										{...field}
									/>
								</FormControl>
								<FormLabel
									className='
										absolute
										top-0
										left-3
										duration-300
										transform
										origin-top-left
										-translate-y-2
										scale-75
										peer-placeholder-shown:translate-y-1
										peer-placeholder-shown:scale-100
										peer-focus:-translate-y-2
										peer-focus:scale-75
									'
								>
									{t('Name')}
								</FormLabel>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem className='relative'>
								<FormControl>
									<Input
										className='peer'
										placeholder=''
										type='password'
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormLabel
									className='
										absolute
										top-0
										left-3
										duration-300
										transform
										origin-top-left
										-translate-y-2
										scale-75
										peer-placeholder-shown:translate-y-1
										peer-placeholder-shown:scale-100
										peer-focus:-translate-y-2
										peer-focus:scale-75
									'
								>
									{t('Password')}
								</FormLabel>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						disabled={isLoading}
						type='submit'
					>
						{isLoading && <Spinner />}
						{t('Sign In with Email')}
					</Button>
				</form>
			</Form>
			<div className='flex flex-row justify-between items-center'>
				<Separator className='flex-1 w-fit' />
				<div className='text-muted-foreground mx-2'>
					{t('or continue with')}
				</div>
				<Separator className='flex-1 w-fit' />
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<Button
					variant='outline'
					type='button'
					disabled={isLoading}
					onClick={() => signInWith('google')}
				>
					{isLoading ? (
						<Spinner />
					) : (
						<i className='i-[logos--google-icon] h-4 w-4 mr-2'></i>
					)}{' '}
					{t('Google')}
				</Button>
				<Button
					variant='outline'
					type='button'
					disabled={isLoading}
					onClick={() => signInWith('github')}
				>
					{isLoading ? (
						<Spinner />
					) : (
						<i className='i-[tabler--brand-github-filled] h-4 w-4 mr-2'></i>
					)}{' '}
					{t('GitHub')}
				</Button>
				<Button
					variant='outline'
					type='button'
					disabled={isLoading}
				>
					{isLoading ? (
						<Spinner />
					) : (
						<i className='i-[bi--wechat] text-green-500 h-4 w-4 mr-2'></i>
					)}{' '}
					{t('WeChat')}
				</Button>
				<Button
					variant='outline'
					type='button'
					disabled={isLoading}
				>
					{isLoading ? (
						<Spinner />
					) : (
						//   <Icons.gitHub className="mr-2 h-4 w-4" />
						<i className='i-[fa6-brands--qq] text-blue-700 h-4 w-4 mr-2'></i>
					)}{' '}
					{t('QQ')}
				</Button>
			</div>
		</div>
	)
}

export { UserAuthForm as default, type RegisterFormSchemaType }
