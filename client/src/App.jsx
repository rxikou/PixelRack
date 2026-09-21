import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'
import GaragePage from './pages/GaragePage.jsx'
import KonbiniPage from './pages/KonbiniPage.jsx'

// import.meta.env.BASE_URL mirrors whatever `base` Vite was built with (see
// vite.config.js): "/" locally and on Vercel/Netlify, "/<repo-name>/" on a
// GitHub Pages project page. Hardcoding either one breaks the other.
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/konbini" element={<KonbiniPage />} />
      </Routes>
    </BrowserRouter>
  )
}
