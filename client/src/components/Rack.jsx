import ShelfCarSlot from './ShelfCarSlot.jsx'

export default function Rack({ cars, onDelete }) {
  if (cars.length === 0) {
    return (
      <p className="py-12 text-center font-mono text-sm text-text-secondary">
        No cars yet. Add your first one above.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {cars.map((car) => (
        <ShelfCarSlot key={car.id} car={car} onDelete={onDelete} />
      ))}
    </ul>
  )
}
