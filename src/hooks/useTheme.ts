import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'
const THEME_EVENT = 'resolvio-theme-change'

function getTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(THEME_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(THEME_EVENT, onChange)
  }
}

function toggleTheme() {
  localStorage.setItem('theme', getTheme() === 'light' ? 'dark' : 'light')
  window.dispatchEvent(new Event(THEME_EVENT))
}

export function useTheme() {
  // Prerendered pages use light mode until hydration reads the saved preference.
  const theme = useSyncExternalStore(subscribe, getTheme, (): Theme => 'light')
  return { theme, toggleTheme }
}
