import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import NicknameEntry from './screens/NicknameEntry'
import Home from './screens/Home'
import AddWalk from './screens/AddWalk'
import History from './screens/History'
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

  function handleWalkSaved() {
    setRefreshKey((k) => k + 1)
    setView('home')
  }

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.container} />
      </SafeAreaProvider>
    )
  }

  if (!user) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <NicknameEntry onSaved={handleSaved} />
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {view === 'home' ? (
          <Home
            key={refreshKey}
            user={user}
            onAddWalk={() => setView('add')}
            onHistory={() => setView('history')}
          />
        ) : view === 'add' ? (
          <AddWalk
            user={user}
            onSaved={handleWalkSaved}
            onCancel={() => setView('home')}
          />
        ) : (
          <History user={user} onBack={() => setView('home')} />
        )}
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9ff',
  },
})
