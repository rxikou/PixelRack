const SORTS = [
  { id: 'shelf', label: 'Newest' },
  { id: 'name', label: 'Name (A-Z)' },
]

const selectClass =
  'cursor-pointer border-2 border-accent-blue/30 bg-bg-primary px-2 py-1 font-mono text-xs uppercase text-accent-blue outline-none hover:border-accent-blue focus:border-accent-blue'

export default function RackHeader({
  carCount,
  sort,
  onSortChange,
  seriesFilter,
  seriesOptions,
  onFilterChange,
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 pb-3">
      <div className="flex flex-col gap-2">
        <h2 className="pixel-text font-pixel text-lg uppercase leading-none tracking-wide text-white">
          The Wooden Shelf
        </h2>
        <span className="pixel-inset w-fit bg-slate-900/80 px-3 py-1.5 font-mono text-xs uppercase text-text-secondary">
          {carCount} {carCount === 1 ? 'car' : 'cars'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wide text-text-secondary">
        <label className="flex items-center gap-1.5">
          Sort
          <select value={sort} onChange={(e) => onSortChange(e.target.value)} className={selectClass}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <span className="text-accent-blue/40">|</span>

        <label className="flex items-center gap-1.5">
          Filter
          <select
            value={seriesFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            {seriesOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
