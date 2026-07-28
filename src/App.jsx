import { useState } from 'react'
import './App.css'
import NicknameEntry from './NicknameEntry'
import Home from './Home'
import AddWalk from './AddWalk'
import { getStoredUser, setStoredUser } from './storage'

function App() {
  const [user, setUser] = useState(() => getStoredUser())
  const [view, setView] = useState('home')
  const [refreshKey, setRefreshKey] = useState(0)

  function handleSaved(newUser) {
    setStoredUser(newUser)
    setUser(newUser)
  }

  function handleWalkSaved() {
    setRefreshKey((k) => k + 1)
    setView('home')
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
      {view === 'home' ? (
        <Home key={refreshKey} onAddWalk={() => setView('add')} />
      ) : (
        <AddWalk
          user={user}
          onSaved={handleWalkSaved}
          onCancel={() => setView('home')}
        />
      )}
    </main>
  )
}

export default App
