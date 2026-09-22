import Button from './Button.jsx'

export default function ShelfCarSlot({ car, onDelete }) {
  return (
    <li className="pixel-panel flex flex-col gap-2 bg-bg-container p-3">
      <div
        className="pixel-inset h-16 w-full"
        style={{ backgroundColor: car.color }}
        aria-hidden="true"
      />
      <div>
        <p className="pixel-text truncate font-pixel text-sm uppercase text-white">{car.name}</p>
        <p className="truncate font-mono text-xs text-text-secondary">
          {car.series || 'Uncategorized'}
        </p>
      </div>
      <Button
        variant="danger"
        onClick={() => onDelete(car.id)}
        aria-label={`Delete ${car.name}`}
        className="self-start !px-2 !py-1 text-[10px]"
      >
        Delete
      </Button>
    </li>
  )
}
