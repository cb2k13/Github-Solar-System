import { useState } from 'react'
import { useGitHub } from './hooks/useGitHub'
import SolarSystem from './components/SolarSystem'
import UsernameInput from './components/UsernameInput'
import RepoCard from './components/RepoCard'

export default function App() {
  const { profile, repos, loading, error, fetchUser } = useGitHub()
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [showInput, setShowInput] = useState(true)

  function handleSubmit(username) {
    setSelectedRepo(null)
    setShowInput(false)
    fetchUser(username)
  }

  function handlePlanetClick(repo) {
    setSelectedRepo((prev) => (prev?.id === repo.id ? null : repo))
  }

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden">
      {/* Always-visible 3D canvas */}
      <div className="absolute inset-0">
        {profile && repos.length > 0 ? (
          <SolarSystem
            profile={profile}
            repos={repos}
            selectedRepo={selectedRepo}
            onPlanetClick={handlePlanetClick}
          />
        ) : (
          // Static star background before any search
          <div
            className="w-full h-full"
            style={{
              background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000005 100%)',
            }}
          />
        )}
      </div>

      {/* Username input overlay */}
      {showInput && (
        <UsernameInput onSubmit={handleSubmit} loading={loading} />
      )}

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center">
            <div className="text-orange-400 text-4xl mb-4 animate-spin">☀</div>
            <p className="text-white/60 text-sm">Building your solar system...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => setShowInput(true)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Profile badge (shown after load) */}
      {profile && !loading && (
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-orange-400/60 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-white font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{profile.name || profile.login}</p>
            <p className="text-white/40 text-xs hidden sm:block">@{profile.login} · {repos.length} repos</p>
            <p className="text-white/40 text-xs sm:hidden">{repos.length} repos</p>
          </div>
          <button
            onClick={() => setShowInput(true)}
            className="ml-1 px-2 sm:px-3 py-1 rounded-lg text-xs bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors border border-white/10 flex-shrink-0"
          >
            Change
          </button>
        </div>
      )}

      {/* Legend (shown after load, hidden on mobile when a repo is selected to avoid clash with bottom sheet) */}
      {profile && !loading && !selectedRepo && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-3 sm:gap-5 text-white/25 text-xs pointer-events-none whitespace-nowrap">
          <span className="hidden sm:inline">Scroll to zoom</span>
          <span className="hidden sm:inline">Drag to rotate</span>
          <span>Tap planet for details</span>
        </div>
      )}

      {/* Repo detail panel */}
      <RepoCard repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </div>
  )
}
