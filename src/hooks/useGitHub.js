import { useState, useCallback } from 'react'

const BASE = 'https://api.github.com'

async function ghFetch(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${res.statusText}`)
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

      // Fetch contributor counts for each repo in parallel (cap at 30 repos)
      const topRepos = repoList
        .filter((r) => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 30)

      const contributorsResults = await Promise.allSettled(
        topRepos.map((r) =>
          ghFetch(`${BASE}/repos/${username}/${r.name}/contributors?per_page=5&anon=false`)
        )
      )

      const enriched = topRepos.map((repo, i) => ({
        ...repo,
        contributors:
          contributorsResults[i].status === 'fulfilled'
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
