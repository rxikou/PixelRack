import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/pixelrack-logo.png'

const NAV_LINKS = [
  { to: '/', label: 'My Rack' },
  { to: '/garage', label: 'Garage' },
  { to: '/konbini', label: 'Konbini' },
]

const navItemClass = (active) =>
  `pixel-text border-b-2 pb-1 font-mono text-xs uppercase tracking-wide ${
    active
      ? 'border-amber-400 text-amber-300'
      : 'border-transparent text-white/85 hover:text-amber-200'
  }`

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="pixel-panel flex flex-wrap items-center justify-between gap-4 bg-sky-800 px-6 py-3">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="PixelRack" className="h-10 w-10 object-contain" />
          <h1 className="pixel-text font-pixel text-2xl uppercase tracking-wide text-white">
            PixelRack
          </h1>
        </Link>
        <nav className="flex gap-4">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={navItemClass(pathname === link.to)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
