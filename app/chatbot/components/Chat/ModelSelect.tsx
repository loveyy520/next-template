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
		<div className='flex flex-col'>
			<label className='mb-2 text-left text-neutral-700 dark:text-neutral-400'>
				{t('Model')}
			</label>
			<div className='w-full rounded-lg border border-border bg-transparent pr-2 text-neutral-900  '>
				<select
					className='w-full bg-transparent p-2'
					placeholder={t('Select a model') || ''}
					value={model?.id || defaultModelId}
					onChange={(e) => {
						onModelChange(
							models.find((model) => model.id === e.target.value) as OpenAIModel
						)
					}}
				>
					{models.map((model) => (
						<option
							key={model.id}
							value={model.id}
							className=' '
						>
							{model.id === defaultModelId
								? `Default (${model.name})`
								: model.name}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}
