import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import t from '@/i18n'
import { OpenAIModel, OpenAIModelID } from '@/types/openai'
import { FC } from 'react'

interface Props {
	model: OpenAIModel
	models: OpenAIModel[]
	defaultModelId: OpenAIModelID
	onModelChange: (model: OpenAIModel) => void
}

export const ModelSelect: FC<Props> = ({
	model,
	models,
	defaultModelId,
	onModelChange,
}) => {
	return (
		<div className='flex flex-col gap-4'>
			<Label>{t('Model')}</Label>
			<Select
				value={model?.id || defaultModelId}
				onValueChange={(value) => {
					onModelChange(
						models.find((model) => model.id === value) as OpenAIModel
					)
				}}
			>
				<SelectTrigger className='w-full'>
					<SelectValue placeholder={t('Select a model')!} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{t('Available models:')!}</SelectLabel>
						{models.map((model) => (
							<SelectItem
								key={model.id}
								value={model.id}
							>
								{model.id === defaultModelId
									? `Default (${model.name})`
									: model.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}
