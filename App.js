import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import NicknameEntry from './screens/NicknameEntry'
import { getStoredUser, setStoredUser } from './lib/storage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

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
      <Text style={styles.title}>יומן טיולי הכלב</Text>
      <Text style={styles.subtitle}>מסך הבית בדרך</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
})
