import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import NicknameEntry from './screens/NicknameEntry'
import Home from './screens/Home'
import { getStoredUser, setStoredUser } from './lib/storage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [view, setView] = useState('home')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    getStoredUser().then((stored) => {
      setUser(stored)
      setLoading(false)
    })
  }, [])

  async function handleSaved(newUser) {
    await setStoredUser(newUser)
    setUser(newUser)
  }

  if (loading) {
    return <View style={styles.container} />
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <NicknameEntry onSaved={handleSaved} />
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {view === 'home' ? (
        <Home key={refreshKey} onAddWalk={() => setView('add')} />
      ) : null}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
