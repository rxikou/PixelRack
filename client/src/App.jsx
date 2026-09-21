import { useEffect, useMemo, useState } from 'react'
import { listCars, createCar, deleteCar } from './api'
import DemoNotice from './components/DemoNotice.jsx'
import Navbar from './components/Navbar.jsx'
import PageFrame from './components/PageFrame.jsx'
import UploadPanel from './components/UploadPanel.jsx'
import RackHeader from './components/RackHeader.jsx'
import Rack from './components/Rack.jsx'
import Button from './components/Button.jsx'

// The Week 1-2 interface pass, now split into the real component tree
// (Navbar, UploadPanel, RackHeader, Rack, ShelfCarSlot) instead of one file.
// Still entirely in demo mode: src/api/mockApi.js is the only "backend".
//
// What is worth keeping from the template is the SHAPE: four states rather
// than two, a loading message that admits a free-tier server can be slow to
// wake, and errors that say something rather than rendering an empty list.

export default function App() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [cars, setCars] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)
  const [sort, setSort] = useState('shelf') // shelf = newest first, as stored
  const [seriesFilter, setSeriesFilter] = useState('all')

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

  async function handleAdd(input) {
    const created = await createCar(input)
    setCars((prev) => [created, ...prev])
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

  const seriesOptions = useMemo(
    () => [...new Set(cars.map((car) => car.series || 'Uncategorized'))],
    [cars],
  )

  const visibleCars = useMemo(() => {
    let result = cars
    if (seriesFilter !== 'all') {
      result = result.filter((car) => (car.series || 'Uncategorized') === seriesFilter)
    }
    if (sort === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
  }, [cars, seriesFilter, sort])

  return (
    <div className="min-h-screen">
      <PageFrame />
      <Navbar />

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        <DemoNotice />

        {error && (
          <p
            className="pixel-panel flex items-center justify-between gap-3 bg-red-900/60 px-4 py-3 font-mono text-sm text-white"
            role="alert"
          >
            {error.message}
            <Button variant="secondary" onClick={load} className="!px-3 !py-1 text-xs">
              Try again
            </Button>
          </p>
        )}

        <UploadPanel onAdd={handleAdd} />

        <div className="border-2 border-accent-blue/25 bg-bg-container/40 p-4">
          <RackHeader
            carCount={visibleCars.length}
            sort={sort}
            onSortChange={setSort}
            seriesFilter={seriesFilter}
            seriesOptions={seriesOptions}
            onFilterChange={setSeriesFilter}
          />

          {/* Four states. Empty and error are different things and must not
              look the same: an empty list means "nothing here yet", an error
              means "we could not find out". */}
          {status === 'loading' && (
            <p className="py-12 text-center font-mono text-sm text-text-secondary">
              Loading
              {slow ? '. The server may be waking up, which can take up to a minute.' : '...'}
            </p>
          )}

          {status === 'ready' && <Rack cars={visibleCars} onDelete={handleDelete} />}
        </div>
      </main>
    </div>
  )
}
