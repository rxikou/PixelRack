// One button atom instead of the same pixel-btn className repeated on every
// screen. Colour-coded by intent rather than one accent tinting everything,
// which is the reference UI's own convention (see the design system doc).
const VARIANTS = {
  primary: 'bg-sky-500',
  secondary: 'bg-slate-600',
  danger: 'bg-red-500',
}

export default function Button({ variant = 'secondary', className = '', ...props }) {
  return (
    <button
      className={`pixel-btn pixel-text cursor-pointer px-4 py-2 font-pixel text-sm uppercase leading-none tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
