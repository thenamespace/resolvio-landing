import { useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return children
}
