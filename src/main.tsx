import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './styles/main.scss'
import App from './App.tsx'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
)
