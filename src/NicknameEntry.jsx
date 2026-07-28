import { useState } from 'react'
import { supabase } from './supabaseClient'

function NicknameEntry({ onSaved }) {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = nickname.trim()
    if (!trimmed) return

    setSaving(true)
    setError('')

    const { data, error } = await supabase
      .from('users')
      .upsert({ nickname: trimmed }, { onConflict: 'nickname' })
      .select()
      .single()

    setSaving(false)

    if (error) {
      setError('Could not save nickname. Try again.')
      return
    }

    onSaved({ id: data.id, nickname: data.nickname })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Welcome</h1>
      <p>What's your nickname?</p>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
        autoFocus
      />
      <button type="submit" disabled={saving || !nickname.trim()}>
        {saving ? 'Saving…' : 'Save'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

export default NicknameEntry
