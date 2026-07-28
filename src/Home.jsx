import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { todayString } from './date'

function Home({ onAddWalk }) {
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
      <button type="button" className="add-walk-button" onClick={onAddWalk}>
        Add walk
      </button>
    </div>
  )
}

export default Home
