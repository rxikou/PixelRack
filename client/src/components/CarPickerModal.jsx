import Button from './Button.jsx'

export default function CarPickerModal({ cars, placedCarIds, canClear, onPick, onClear, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="pixel-panel flex max-h-[80vh] w-full max-w-2xl flex-col bg-bg-container">
        <header className="flex items-center justify-between border-b-[3px] border-[#05070d] bg-sky-700 px-4 py-2">
          <h2 className="pixel-text font-pixel text-xl uppercase leading-none text-white">
            Choose a car
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="pixel-text cursor-pointer font-pixel text-xl leading-none text-white hover:text-amber-300"
          >
            &times;
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {cars.length === 0 ? (
            <p className="py-10 text-center font-mono text-sm text-text-secondary">
              No cars in your collection yet. Add one from My Rack first.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cars.map((car) => {
                const alreadyPlaced = placedCarIds.includes(car.id)
                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => onPick(car)}
                    className={`pixel-panel cursor-pointer bg-slate-800 p-2 text-left hover:brightness-110 ${
                      alreadyPlaced ? 'opacity-50' : ''
                    }`}
                  >
                    <div
                      className="pixel-inset h-12 w-full"
                      style={{ backgroundColor: car.color }}
                      aria-hidden="true"
                    />
                    <p className="pixel-text mt-1 truncate font-pixel text-sm uppercase text-white">
                      {car.name}
                    </p>
                    <p className="truncate font-mono text-[10px] text-text-secondary">
                      {alreadyPlaced ? 'Already in this scene' : car.series || 'Uncategorized'}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {canClear && (
          <footer className="border-t-[3px] border-[#05070d] p-3">
            <Button variant="danger" onClick={onClear} className="w-full">
              Remove from slot
            </Button>
          </footer>
        )}
      </div>
    </div>
  )
}
