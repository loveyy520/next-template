import { Button } from '@/components/ui/button'
import t from '@/i18n'
import { SupportedExportFormats } from '@/types/export'
import { FC, useRef } from 'react'
import { TextReader } from './TextReader'

interface Props {
	onImport: (data: SupportedExportFormats) => void
}

export const Import: FC<Props> = ({ onImport }) => {
	const textReaderRef = useRef<HTMLInputElement>(null)

	function handleClick() {
		textReaderRef.current?.click()
	}
	return (
		<>
			<TextReader
				ref={textReaderRef}
				onImport={onImport}
			/>
			<Button
				className='w-full justify-start gap-4'
				variant='ghost'
				onClick={handleClick}
			>
				<i className='text-lg i-[tabler--file-import]' />
				{t('Import data')!}
			</Button>
		</>
	)
}
