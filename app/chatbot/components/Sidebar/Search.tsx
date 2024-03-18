import { Button } from '@/components/ui/button'
import t from '@/i18n'
import { ChangeEvent, FC } from 'react'
import { OlInput } from '../Base'

interface Props {
	placeholder: string
	searchTerm: string
	onSearch: (searchTerm: string) => void
}

export const Search: FC<Props> = ({ placeholder, searchTerm, onSearch }) => {
	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		onSearch(e.target.value)
	}

	const clearSearch = () => {
		onSearch('')
	}

	return (
		<div className='relative flex items-center'>
			<OlInput
				className='w-full !h-10 !bg-background'
				placeholder={t(placeholder) || ''}
				value={searchTerm}
				onChange={handleSearchChange}
			/>

			{searchTerm && (
				<Button size='icon'>
					<i
						className='i-[material-symbols--add]'
						onClick={clearSearch}
					/>
				</Button>
			)}
		</div>
	)
}
