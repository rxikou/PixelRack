import { useEffect, useState } from 'react'
import { listCars, getPlacements, setPlacement } from '../api'
import Navbar from './Navbar.jsx'
import PageFrame from './PageFrame.jsx'
import DemoNotice from './DemoNotice.jsx'
import CarPickerModal from './CarPickerModal.jsx'

// A scene with a fixed number of car slots. Garage and Konbini both render
// through this one template with different copy and an environmentId; the
// slot count itself comes from src/api/environments.json, not a prop, so the
// mock and the real API stay the single source of truth for it.
export default function ScenePage({ environmentId, title, blurb }) {
  const [slots, setSlots] = useState([])
  const [cars, setCars] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState(null)
  const [pickingSlot, setPickingSlot] = useState(null)

  async function load() {
    setStatus('loading')
    setError(null)
    try {
      const [slotRows, carRows] = await Promise.all([getPlacements(environmentId), listCars()])
      setSlots(slotRows)
      setCars(carRows)
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environmentId])

  async function handlePick(car) {
    const slotIndex = pickingSlot
    setPickingSlot(null)
    const updated = await setPlacement(environmentId, slotIndex, car.id)
    setSlots(updated)
  }

  async function handleClear() {
    const slotIndex = pickingSlot
    setPickingSlot(null)
    const updated = await setPlacement(environmentId, slotIndex, null)
    setSlots(updated)
  }

  const placedCarIds = slots.filter((slot) => slot.car).map((slot) => slot.car.id)
  const pickingHasCar = slots.some((slot) => slot.slotIndex === pickingSlot && slot.car)

  return (
    <div className="min-h-screen">
      <PageFrame />
      <Navbar />

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        <DemoNotice />

        <div className="pixel-panel bg-bg-container p-4">
          <h2 className="pixel-text font-pixel text-lg uppercase text-white">{title}</h2>
          <p className="mb-3 font-mono text-xs text-text-secondary">{blurb}</p>

          {error && (
            <p
              className="pixel-panel mb-3 bg-red-900/60 px-3 py-2 font-mono text-xs text-white"
              role="alert"
            >
              {error.message}
            </p>
          )}

          {status === 'loading' && (
            <p className="py-12 text-center font-mono text-sm text-text-secondary">Loading...</p>
          )}

          {status === 'ready' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {slots.map(({ slotIndex, car }) => (
                <button
                  key={slotIndex}
                  type="button"
                  onClick={() => setPickingSlot(slotIndex)}
                  aria-label={car ? `${car.name}, click to change` : 'Empty slot, click to add a car'}
                  className="pixel-panel flex h-24 flex-col items-center justify-center gap-1 bg-slate-800 p-2 hover:brightness-110"
                >
                  {car ? (
                    <>
                      <div
                        className="pixel-inset h-10 w-16"
                        style={{ backgroundColor: car.color }}
                        aria-hidden="true"
                      />
                      <span className="pixel-text w-full truncate font-pixel text-xs uppercase text-white">
                        {car.name}
                      </span>
                    </>
                  ) : (
                    <span className="pixel-text font-pixel text-2xl text-white/60" aria-hidden="true">
                      +
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {pickingSlot !== null && (
        <CarPickerModal
          cars={cars}
          placedCarIds={placedCarIds}
          canClear={pickingHasCar}
          onPick={handlePick}
          onClear={handleClear}
          onClose={() => setPickingSlot(null)}
        />
      )}
    </div>
  )
}
