'use client'

import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
// import { immer } from 'zustand/middleware/immer'
import { ModeName, ThemeName, defaultRadius, defaultTheme } from './consts'

interface ThemeState {
	theme: ThemeName
	setTheme: (theme: ThemeName) => void
	recoverTheme: () => void
	resetTheme: () => void
	mode: ModeName,
	setMode: (mode: ModeName) => void
	setDarkMode: () => void
	setLightMode: () => void
	toggleMode: () => void
	radius: number
	setRadius: (radius: number) => void
}

const THEME_STORAGE_NAME = 'theme-storage'
const localThemeData = JSON.parse(globalThis.localStorage?.getItem?.(THEME_STORAGE_NAME)! ?? null)

const initialMode = 'light'
const initialTheme = 'Slate'
const initialRadius = 0.75

const useThemeStore = create<ThemeState>()(
	subscribeWithSelector(
		persist((set, get) => ({
				theme: localThemeData?.state?.theme ?? initialTheme,
				setTheme: (theme) => set({ theme }),
				resetTheme: () => set({theme: defaultTheme, radius: defaultRadius}),
				recoverTheme: () => set({ theme: get().theme, mode: get().mode, radius: get().radius }),
				mode: localThemeData?.state?.mode ?? initialMode,
				setMode: (mode) => set({mode}),
				setDarkMode: () => set({mode: 'dark'}),
				setLightMode: () => set({mode: 'light'}),
				toggleMode: () => set({
					mode: get().mode === 'dark' ? 'light' : 'dark'
				}),
				radius: localThemeData?.state?.radius ?? initialRadius,
				setRadius: (radius) => set({radius})
			}),
			{
				name: THEME_STORAGE_NAME, // name of the item in the storage (must be unique)
				// storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			}
		)
	)
)

const themeSub = useThemeStore.subscribe(
	(state) => state.theme,
	(theme, prevTheme) => {
		const root = globalThis.document?.documentElement
		if (!root) return
		root.setAttribute('data-theme', theme.toLowerCase())
	},
	{
		fireImmediately: true
	}
)

const modeSub = useThemeStore.subscribe(
	(state) => state.mode,
	(mode) => {
		const root = globalThis.document?.documentElement
		if (!root) return
		const action = mode === 'light' ? 'remove' : 'add'
		root.classList[action]('dark')
	},
	{
		fireImmediately: true
	}
)
const radiusSub = useThemeStore.subscribe(
	(state) => state.radius,
	(radius) => {
		const root = globalThis.document?.documentElement
		if (!root) return
		root.style.setProperty('--radius', `${radius}em;`)
	},
	{
		fireImmediately: true
	}
)

let isThemeRecovered = false
// const {setMode, setRadius, setTheme} = useThemeStore()
const recoverTheme = (theme: ThemeName = initialTheme, mode: ModeName = initialMode, radius: number = initialRadius) => {
	if (isThemeRecovered) return
	const root = document.documentElement
	root.setAttribute('data-theme', theme.toLocaleLowerCase())
	// setTheme()
	root.style.setProperty('--radius', `${radius}em`)
	const action = mode === 'dark' ? 'add' : 'remove'
	root.classList[action]('dark')
	isThemeRecovered = true
}

export {
	useThemeStore,
	recoverTheme
}
