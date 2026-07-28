import { useState } from 'react'
import { supabase } from './supabaseClient'
import { todayString } from './date'

function nowTimeString() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function AddWalk({ user, onSaved, onCancel }) {
  const [time, setTime] = useState(nowTimeString())
  const [pooped, setPooped] = useState(false)
  const [peed, setPeed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase.from('walks').insert({
      user_id: user.id,
      walk_date: todayString(),
      walk_time: time,
      pooped,
      peed,
    })

    setSaving(false)

    if (error) {
      setError('Could not save walk. Try again.')
      return
    }

    onSaved()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Walk</h1>
      <label>
        Time
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </label>
      <label className="toggle">
        <input
          type="checkbox"
          checked={pooped}
          onChange={(e) => setPooped(e.target.checked)}
        />
        Pooped
      </label>
      <label className="toggle">
        <input
          type="checkbox"
          checked={peed}
          onChange={(e) => setPeed(e.target.checked)}
        />
        Peed
      </label>
      <div className="button-row">
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

export default AddWalk
