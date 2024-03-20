'use client'

import { Button } from '@/components/ui/button'
import t from '@/i18n'
import {
	generateRandomString,
	programmingLanguages,
} from '@/utils/app/codeblock'
import { FC, memo, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface Props {
	lang: string // 系统语言
	language: string // md的代码语言
	value: string
}

export const CodeBlock: FC<Props> = memo(({ lang, language, value }) => {
	const [isCopied, setIsCopied] = useState<Boolean>(false)

	const copyToClipboard = () => {
		if (!navigator.clipboard || !navigator.clipboard.writeText) {
			return
		}

		navigator.clipboard.writeText(value).then(() => {
			setIsCopied(true)

			setTimeout(() => {
				setIsCopied(false)
			}, 2000)
		})
	}
	const downloadAsFile = () => {
		const fileExtension = programmingLanguages[language] || '.file'
		const suggestedFileName = `file-${generateRandomString(
			3,
			true
		)}${fileExtension}`
		const fileName = window.prompt(
			t('Enter file name') || '',
			suggestedFileName
		)

		if (!fileName) {
			// user pressed cancel on prompt
			return
		}

		const blob = new Blob([value], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.download = fileName
		link.href = url
		link.style.display = 'none'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}
	return (
		<div className='codeblock relative font-sans text-[16px]'>
			<div className='flex items-center justify-between py-1.5 px-4'>
				<span className='text-xs lowercase text-foreground'>{language}</span>

				<div className='flex items-center'>
					<Button
						className='gap-1.5'
						onClick={copyToClipboard}
					>
						{isCopied ? (
							// <IconCheck size={18} />
							<i className='i-[ic--sharp-check] text-xl text-green-500 dark:text-green-400'></i>
						) : (
							// <IconClipboard size={18} />
							<i className='text-lg i-[fluent--clipboard-text-32-regular]'></i>
						)}
						{isCopied ? t('Copied!') : t('Copy code')}
					</Button>
					<Button
						size='icon'
						variant='ghost'
						onClick={downloadAsFile}
					>
						{/* <IconDownload size={18} /> */}
						<i className='text-lg i-[fluent--arrow-download-24-filled]'></i>
					</Button>
				</div>
			</div>

			<SyntaxHighlighter
				language={language}
				style={oneDark}
				customStyle={{ margin: 0 }}
			>
				{value}
			</SyntaxHighlighter>
		</div>
	)
})
CodeBlock.displayName = 'CodeBlock'
