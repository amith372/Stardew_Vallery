import { useState } from 'react'
import './App.css'
import NicknameEntry from './NicknameEntry'
import { getStoredUser, setStoredUser } from './storage'

function App() {
  const [user, setUser] = useState(() => getStoredUser())

  function handleSaved(newUser) {
    setStoredUser(newUser)
    setUser(newUser)
  }

  if (!user) {
    return (
      <main>
        <NicknameEntry onSaved={handleSaved} />
      </main>
    )
  }

  return (
    <main>
      <h1>Dog Walk Log</h1>
      <p>Signed in as {user.nickname}. Home screen coming next.</p>
    </main>
  )
}

export default App
