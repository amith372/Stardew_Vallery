import { useState } from 'react'
import './App.css'
import NicknameEntry from './NicknameEntry'
import Home from './Home'
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
      <Home />
    </main>
  )
}

export default App
