import { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { supabase } from '../lib/supabaseClient'
import { todayString } from '../lib/date'

export default function Home({ onAddWalk, onHistory }) {
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
        setError('לא ניתן היה לטעון את הטיולים של היום.')
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>הטיולים של היום</Text>

      {loading ? (
        <Text style={styles.message}>טוען…</Text>
      ) : error ? (
        <Text style={[styles.message, styles.error]}>{error}</Text>
      ) : walks.length === 0 ? (
        <Text style={styles.message}>עדיין לא נרשמו טיולים היום.</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={walks}
          keyExtractor={(walk) => walk.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.time}>{item.walk_time.slice(0, 5)}</Text>
              <Text style={styles.nickname}>{item.users.nickname}</Text>
              <Text style={styles.flags}>
                {item.pooped ? '💩' : '—'} {item.peed ? '💧' : '—'}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.buttonRow}>
        <Pressable style={styles.historyButton} onPress={onHistory}>
          <Text style={styles.historyButtonText}>היסטוריה</Text>
        </Pressable>
        <Pressable style={styles.addButton} onPress={onAddWalk}>
          <Text style={styles.addButtonText}>הוספת טיול</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 16,
  },
  message: {
    textAlign: 'right',
    writingDirection: 'rtl',
    color: '#666',
  },
  error: {
    color: '#d33',
  },
  list: {
    width: '100%',
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e4e7',
    borderRadius: 8,
    marginBottom: 8,
  },
  time: {
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
  },
  nickname: {
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  flags: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#aa3bff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  historyButton: {
    backgroundColor: '#f4f3ec',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  historyButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
})
