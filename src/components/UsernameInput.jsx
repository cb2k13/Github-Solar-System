import { useState } from 'react'

export default function UsernameInput({ onSubmit, loading }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-40 pointer-events-none">
      <div className="pointer-events-auto text-center flex flex-col items-center gap-6">
        {/* Title */}
        <div className="flex flex-col gap-3">
          <h1 className="text-6xl font-bold text-white tracking-wide leading-tight">
            GitHub <span className="text-orange-400">Solar System</span>
          </h1>
          <p className="text-white/40 text-base tracking-widest uppercase">
            Enter any GitHub username to explore their repos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex gap-3 justify-center mt-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="github username..."
            disabled={loading}
            autoFocus
            className="
              w-96 px-6 py-4 rounded-xl
              bg-white/10 text-white placeholder-white/30
              border border-white/20 focus:border-orange-400/60
              outline-none text-base tracking-wide
              disabled:opacity-50
            "
          />
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="
              px-8 py-4 rounded-xl font-semibold text-base tracking-wide
              bg-orange-500 hover:bg-orange-400 text-white
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {loading ? '...' : 'Launch'}
          </button>
        </form>

        {/* Legend */}
        <div className="flex gap-8 justify-center text-white/25 text-xs tracking-wider uppercase mt-2">
          <span>Planet size = ★ stars</span>
          <span>Speed = commit freq</span>
          <span>Rings = open issues</span>
          <span>Moons = contributors</span>
        </div>
      </div>
    </div>
  )
}
