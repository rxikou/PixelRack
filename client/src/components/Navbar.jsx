import logo from '../assets/pixelrack-logo.png'

export default function Navbar() {
  return (
    <header className="pixel-panel flex items-center justify-between gap-4 bg-sky-800 px-6 py-3">
      <div className="flex items-center gap-3">
        <img src={logo} alt="PixelRack" className="h-10 w-10 object-contain" />
        <h1 className="pixel-text font-pixel text-2xl uppercase tracking-wide text-white">
          PixelRack
        </h1>
      </div>
      <p className="hidden font-mono text-xs uppercase tracking-wide text-white/80 sm:block">
        Your Hot Wheels, pixelated
      </p>
    </header>
  )
}
