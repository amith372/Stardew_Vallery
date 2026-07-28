import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function todayString() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function Home() {
  const [walks, setWalks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadWalks() {
      setLoading(true)
      setError('')
      const { data, error } = await supabase
        .from('walks')
        .select('id, walk_time, pooped, peed, users(nickname)')
        .eq('walk_date', todayString())
        .order('walk_time')

      if (cancelled) return
      if (error) {
        setError("Could not load today's walks.")
      } else {
        setWalks(data)
      }
      setLoading(false)
    }

    loadWalks()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <p>Loading…</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div>
      <h1>Today's Walks</h1>
      {walks.length === 0 ? (
        <p>No walks logged yet today.</p>
      ) : (
        <ul className="walk-list">
          {walks.map((walk) => (
            <li key={walk.id}>
              <span className="walk-time">{walk.walk_time.slice(0, 5)}</span>
              <span className="walk-user">{walk.users.nickname}</span>
              <span className="walk-flags">
                {walk.pooped ? '💩' : '—'} {walk.peed ? '💧' : '—'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home
