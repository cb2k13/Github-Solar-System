import { useState, useCallback } from 'react'

const BASE = 'https://api.github.com'
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN

function ghHeaders() {
  const headers = { Accept: 'application/vnd.github.v3+json' }
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`
  return headers
}

async function ghFetch(url) {
  const res = await fetch(url, { headers: ghHeaders() })
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      const reset = res.headers.get('X-RateLimit-Reset')
      const resetTime = reset ? new Date(Number(reset) * 1000).toLocaleTimeString() : null
      throw new Error(
        `GitHub rate limit exceeded.${resetTime ? ` Resets at ${resetTime}.` : ''} Add a VITE_GITHUB_TOKEN to increase the limit to 5,000 req/hour.`
      )
    }
    throw new Error(`GitHub API error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export function useGitHub() {
  const [profile, setProfile] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUser = useCallback(async (username) => {
    setLoading(true)
    setError(null)
    setProfile(null)
    setRepos([])

    try {
      const [user, repoList] = await Promise.all([
        ghFetch(`${BASE}/users/${username}`),
        ghFetch(`${BASE}/users/${username}/repos?per_page=100&sort=updated`),
      ])

      const topRepos = repoList
        .filter((r) => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 30)

      // Fetch contributors only for the top 10 repos to stay within rate limits
      const reposForContributors = topRepos.slice(0, 10)

      const contributorsResults = await Promise.allSettled(
        reposForContributors.map((r) =>
          ghFetch(`${BASE}/repos/${username}/${r.name}/contributors?per_page=5&anon=false`)
        )
      )

      const enriched = topRepos.map((repo, i) => ({
        ...repo,
        contributors:
          i < reposForContributors.length && contributorsResults[i].status === 'fulfilled'
            ? contributorsResults[i].value.slice(0, 5).filter((c) => c.login !== username)
            : [],
      }))

      setProfile(user)
      setRepos(enriched)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { profile, repos, loading, error, fetchUser }
}
