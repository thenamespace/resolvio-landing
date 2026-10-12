import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { TopNavigation } from './sections/TopNavigation'
import { Footer } from './sections/Footer'
import { LandingPage } from './pages/LandingPage'
import { BlogIndex } from './pages/BlogIndex'
import { BlogPost } from './pages/BlogPost'
import { LegalPage } from './pages/LegalPage'

export default function App() {
  return (
    <ThemeProvider>
      <div>
        <TopNavigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/terms" element={<LegalPage slug="terms" />} />
          <Route path="/privacy" element={<LegalPage slug="privacy" />} />
        </Routes>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
