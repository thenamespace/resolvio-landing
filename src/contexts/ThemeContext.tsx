import { useLayoutEffect } from 'react'
import { useTheme } from '../hooks/useTheme'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  useLayoutEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme-switching', '')
    root.setAttribute('data-theme', theme)
    // Let the new theme paint before restoring interaction transitions.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        root.removeAttribute('data-theme-switching')
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      root.removeAttribute('data-theme-switching')
    }
  }, [theme])
  return children
}
