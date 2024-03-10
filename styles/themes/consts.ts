type ThemeName = 'Zinc' | 'Slate' | 'Stone' | 'Gray' | 'Neutral' | 'Red' | 'Rose' | 'Orange' | 'Green' | 'Blue' | 'Yellow' | 'Violet'
type ModeName = 'light' | 'dark'
const defaultTheme: ThemeName = 'Slate'

const themes:( Record<'color', string> & Record<'label', ThemeName>)[] = [
	{
		color: '240 5.9% 10%',
		label: 'Zinc',
	},
	{
		color: '25 5.3% 44.7%',
		label: 'Slate',
	},
	{
		color: '25 5.3% 44.7%',
		label: 'Stone',
	},
	{
		color: '220 8.9% 46.1%',
		label: 'Gray',
	},
	{
		color: '0 0% 45.1%', // 使用theme-primary的值 而非primary的值
		label: 'Neutral',
	},
	{
		color: '0 72.2% 50.6%',
		label: 'Red',
	},
	{
		color: '346.8 77.2% 49.8%',
		label: 'Rose',
	},
	{
		color: '24.6 95% 53.1%',
		label: 'Orange',
	},
	{
		color: '142.1 76.2% 36.3%',
		label: 'Green',
	},
	{
		color: '221.2 83.2% 53.3%',
		label: 'Blue',
	},
	{
		color: '47.9 95.8% 53.1%',
		label: 'Yellow',
	},
	{
		color: '262.1 83.3% 57.8%',
		label: 'Violet',
	},
]

const defaultRadius = 0.75
const radiusPool: number[] = [0, 0.3, 0.5, 0.75, 1.0]

export {
	defaultTheme,
	themes,
	defaultRadius,
	radiusPool,
	type ThemeName,
	type ModeName
}

