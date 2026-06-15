import { getLangColor } from '../utils/colorMap'

function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default function RepoCard({ repo, onClose }) {
  if (!repo) return null

  const langColor = getLangColor(repo.language)

  return (
    <div className="fixed bottom-0 left-0 right-0 max-h-[70vh] sm:bottom-auto sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-80 bg-black/90 backdrop-blur-md border-t border-white/10 sm:border-t-0 sm:border-l rounded-t-2xl sm:rounded-none p-6 flex flex-col gap-4 z-50 animate-slide-up sm:animate-slide-in overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-xs mb-1">repository</p>
          <h2 className="text-white font-bold text-lg leading-tight break-words">{repo.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors text-xl mt-1 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-white/60 text-sm leading-relaxed">{repo.description}</p>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Stars', value: fmt(repo.stargazers_count), icon: '★' },
          { label: 'Forks', value: fmt(repo.forks_count), icon: '⑂' },
          { label: 'Issues', value: fmt(repo.open_issues_count), icon: '●' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-white/40 text-xs mb-1">{icon} {label}</div>
            <div className="text-white font-bold text-lg">{value}</div>
          </div>
        ))}
      </div>

      {/* Language */}
      {repo.language && (
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: langColor }}
          />
          <span className="text-white/70 text-sm">{repo.language}</span>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-2 text-sm text-white/50">
        <div className="flex justify-between">
          <span>Last commit</span>
          <span className="text-white/70">{timeAgo(repo.pushed_at)}</span>
        </div>
        <div className="flex justify-between">
          <span>Created</span>
          <span className="text-white/70">{timeAgo(repo.created_at)}</span>
        </div>
        {repo.license && (
          <div className="flex justify-between">
            <span>License</span>
            <span className="text-white/70">{repo.license.spdx_id}</span>
          </div>
        )}
        {repo.homepage && (
          <div className="flex justify-between items-center">
            <span>Website</span>
            <a
              href={repo.homepage}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 truncate ml-2 max-w-[160px]"
            >
              {repo.homepage.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      {/* Topics */}
      {repo.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.slice(0, 8).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-xs border border-blue-400/30 text-blue-300/70"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Contributors */}
      {repo.contributors?.length > 0 && (
        <div>
          <p className="text-white/40 text-xs mb-2">Top Contributors (moons)</p>
          <div className="flex gap-2 flex-wrap">
            {repo.contributors.map((c) => (
              <a
                key={c.login}
                href={c.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-white/5 rounded-full px-2 py-1 hover:bg-white/10 transition-colors"
              >
                <img src={c.avatar_url} alt={c.login} className="w-5 h-5 rounded-full" />
                <span className="text-white/70 text-xs">{c.login}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* GitHub link */}
      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        className="mt-auto block text-center py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10"
      >
        View on GitHub →
      </a>
    </div>
  )
}
