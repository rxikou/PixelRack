// The simulated backend.
//
// Same function names, same return types, and the same shape of failure as
// httpApi.js, so your components cannot tell the difference. Data lives in the
// visitor's own browser and goes no further.
//
// This exists so the deployed client works on day one and so the interface
// can be built before the real API exists. It is NOT a finished project.
// Photo upload and the pixel-art redraw step are backend work for a later
// week; for now a car is just a name, a series, and a colour swatch, which
// matches the placeholder sprite the real app falls back to before a photo
// has been processed.

import seed from './seed.json'

const KEY = 'pixelrack:cars'

// A real network is not instant. Keeping this delay is what forces a loading
// state to be built now, while it is cheap, instead of discovering it is
// needed the day the real API is switched on.
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function read() {
  const stored = localStorage.getItem(KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Corrupted storage. Start again rather than crashing the app.
      localStorage.removeItem(KEY)
    }
  }
  localStorage.setItem(KEY, JSON.stringify(seed))
  return seed
}

function write(rows) {
  localStorage.setItem(KEY, JSON.stringify(rows))
  return rows
}

export async function listCars() {
  await delay()
  return read()
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getCar(id) {
  await delay()
  const found = read().find((row) => String(row.id) === String(id))
  if (!found) throw new Error('Not found')
  return found
}

export async function createCar(input) {
  await delay()
  const created = {
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  write([...read(), created])
  return created
}

export async function updateCar(id, input) {
  await delay()
  const rows = read()
  const index = rows.findIndex((row) => String(row.id) === String(id))
  if (index === -1) throw new Error('Not found')
  rows[index] = { ...rows[index], ...input }
  write(rows)
  return rows[index]
}

export async function deleteCar(id) {
  await delay()
  write(read().filter((row) => String(row.id) !== String(id)))
}
