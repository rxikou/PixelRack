import { useState } from 'react'
import Button from './Button.jsx'

const SWATCHES = [
  { hex: '#f87171', name: 'Red' },
  { hex: '#38bdf8', name: 'Blue' },
  { hex: '#fbbf24', name: 'Amber' },
  { hex: '#4ade80', name: 'Green' },
  { hex: '#f472b6', name: 'Pink' },
  { hex: '#a78bfa', name: 'Purple' },
]

const EMPTY_FORM = { name: '', series: '', color: SWATCHES[0].hex }

// A photo-upload step and the pixel-art redraw belong to a later week, once
// there is a real API to send the file to. For now a car is a name, a
// series, and a colour swatch, which matches the placeholder sprite the real
// app falls back to before a photo has been processed.
export default function UploadPanel({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return

    setSaving(true)
    try {
      await onAdd({
        name: form.name.trim(),
        series: form.series.trim(),
        color: form.color,
      })
      setForm(EMPTY_FORM)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pixel-panel flex flex-col gap-3 bg-bg-container p-4">
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

      <span id="colour-label" className="font-mono text-xs uppercase text-text-secondary">
        Colour
      </span>
      <div role="group" aria-labelledby="colour-label" className="flex gap-2">
        {SWATCHES.map((swatch) => (
          <button
            key={swatch.hex}
            type="button"
            aria-label={swatch.name}
            aria-pressed={form.color === swatch.hex}
            onClick={() => setForm({ ...form, color: swatch.hex })}
            className={`h-8 w-8 border-2 ${form.color === swatch.hex ? 'border-white' : 'border-bg-primary'}`}
            style={{ backgroundColor: swatch.hex }}
          />
        ))}
      </div>

      <Button type="submit" variant="primary" disabled={saving} className="mt-2 self-start">
        {saving ? 'Saving...' : 'Add car'}
      </Button>
    </form>
  )
}
