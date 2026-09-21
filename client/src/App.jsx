import { useEffect, useState } from 'react'
import { listCars, createCar, deleteCar } from './api'
import DemoNotice from './components/DemoNotice.jsx'
import logo from './assets/pixelrack-logo.png'

// The Week 1-2 interface pass: the rack and the add-a-car form, both running
// on the simulated backend in src/api/mockApi.js. Photo upload and the pixel
// art redraw step are backend work for a later week; for now a car is just a
// name, a series, and a colour swatch, matching the placeholder sprite the
// real app falls back to before a photo has been processed.
//
// What is worth keeping from the template is the SHAPE: four states rather
// than two, a loading message that admits a free-tier server can be slow to
// wake, and errors that say something rather than rendering an empty list.

const SWATCHES = ['#f87171', '#38bdf8', '#fbbf24', '#4ade80', '#f472b6', '#a78bfa']

const EMPTY_FORM = { name: '', series: '', color: SWATCHES[0] }

export default function App() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [cars, setCars] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  async function load() {
    setStatus('loading')
    setError(null)

    // A free-tier API sleeps. If this is taking a while, say so rather than
    // spinning silently, which looks broken.
    const timer = setTimeout(() => setSlow(true), 3000)

    try {
      setCars(await listCars())
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    } finally {
      clearTimeout(timer)
      setSlow(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return

    setSaving(true)
    try {
      const created = await createCar({
        name: form.name.trim(),
        series: form.series.trim(),
        color: form.color,
      })
      setCars([created, ...cars])
      setForm(EMPTY_FORM)
    } catch (caught) {
      setError(caught)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const previous = cars
    setCars(cars.filter((car) => car.id !== id)) // optimistic
    try {
      await deleteCar(id)
    } catch (caught) {
      setCars(previous) // put it back on failure
      setError(caught)
    }
  }

  return (
    <div className="min-h-screen">
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

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        <DemoNotice />

        {error && (
          <p
            className="pixel-panel flex items-center justify-between gap-3 bg-red-900/60 px-4 py-3 font-mono text-sm text-white"
            role="alert"
          >
            {error.message}
            <button
              onClick={load}
              className="pixel-btn pixel-text bg-slate-600 px-3 py-1 font-pixel text-xs uppercase text-white"
            >
              Try again
            </button>
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="pixel-panel flex flex-col gap-3 bg-bg-container p-4"
        >
          <h2 className="pixel-text font-pixel text-lg uppercase text-white">Add a car</h2>

          <label htmlFor="name" className="font-mono text-xs uppercase text-text-secondary">
            Name
          </label>
          <input
            id="name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            maxLength={120}
            required
            className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent-blue"
          />

          <label htmlFor="series" className="font-mono text-xs uppercase text-text-secondary">
            Series
          </label>
          <input
            id="series"
            value={form.series}
            onChange={(event) => setForm({ ...form, series: event.target.value })}
            maxLength={120}
            placeholder="Optional"
            className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent-blue"
          />

          <span className="font-mono text-xs uppercase text-text-secondary">Colour</span>
          <div className="flex gap-2">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                aria-label={`Colour ${swatch}`}
                aria-pressed={form.color === swatch}
                onClick={() => setForm({ ...form, color: swatch })}
                className={`h-8 w-8 border-2 ${form.color === swatch ? 'border-white' : 'border-bg-primary'}`}
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="pixel-btn pixel-text mt-2 self-start bg-sky-500 px-4 py-2 font-pixel text-sm uppercase text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add car'}
          </button>
        </form>

        {/* Four states. Empty and error are different things and must not
            look the same: an empty list means "nothing here yet", an error
            means "we could not find out". */}
        {status === 'loading' && (
          <p className="font-mono text-sm text-text-secondary">
            Loading{slow ? '. The server may be waking up, which can take up to a minute.' : '...'}
          </p>
        )}

        {status === 'ready' && cars.length === 0 && (
          <p className="font-mono text-sm text-text-secondary">
            No cars yet. Add your first one above.
          </p>
        )}

        {status === 'ready' && cars.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cars.map((car) => (
              <li key={car.id} className="pixel-panel flex flex-col gap-2 bg-bg-container p-3">
                <div
                  className="pixel-inset h-16 w-full"
                  style={{ backgroundColor: car.color }}
                  aria-hidden="true"
                />
                <div>
                  <p className="pixel-text truncate font-pixel text-sm uppercase text-white">
                    {car.name}
                  </p>
                  <p className="truncate font-mono text-xs text-text-secondary">
                    {car.series || 'Uncategorized'}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="pixel-btn pixel-text self-start bg-red-500 px-2 py-1 font-mono text-[10px] uppercase text-white"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
