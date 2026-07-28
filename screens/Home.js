import { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabaseClient'
import { todayString, toDateTime, formatHebrewDate } from '../lib/date'
import WalkRow from '../components/WalkRow'

const STATUS_CHECK_INTERVAL = 60 * 1000

function getStatus(lastWalkAt, now) {
  if (!lastWalkAt) {
    return { emoji: '🚨', text: 'היא צריכה טיול', tone: 'urgent' }
  }
  const hoursSince = (now - lastWalkAt) / (1000 * 60 * 60)
  if (hoursSince < 5) {
    return { emoji: '😌', text: 'היא בסדר', tone: 'ok' }
  }
  if (hoursSince < 6) {
    return { emoji: '🥱', text: 'היא תשמח לטיול', tone: 'soon' }
  }
  return { emoji: '🚨', text: 'היא צריכה טיול', tone: 'urgent' }
}

export default function Home({ user, onAddWalk, onHistory }) {
  const insets = useSafeAreaInsets()
  const [walks, setWalks] = useState([])
  const [lastWalkAt, setLastWalkAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), STATUS_CHECK_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadWalks() {
      setLoading(true)
      setError('')

      const [todayRes, lastWalkRes] = await Promise.all([
        supabase
          .from('walks')
          .select('id, walk_time, pooped, peed, note, user_id, users(nickname)')
          .eq('walk_date', todayString())
          .order('walk_time'),
        supabase
          .from('walks')
          .select('walk_date, walk_time')
          .order('walk_date', { ascending: false })
          .order('walk_time', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

      if (cancelled) return

      if (todayRes.error) {
        setError('לא ניתן היה לטעון את הטיולים של היום.')
      } else {
        setWalks(todayRes.data)
      }

      if (lastWalkRes.data) {
        setLastWalkAt(toDateTime(lastWalkRes.data.walk_date, lastWalkRes.data.walk_time))
      }

      setLoading(false)
    }

    loadWalks()
    return () => {
      cancelled = true
    }
  }, [])

  const status = getStatus(lastWalkAt, now)

  function handleRowUpdated(id, field, value) {
    setWalks((prev) => prev.map((w) => (w.id === id ? { ...w, [field]: value } : w)))
  }

  function handleRowDeleted(id) {
    setWalks((prev) => prev.filter((w) => w.id !== id))
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.title}>הטיולים של היום</Text>
          <Text style={styles.dateSubtitle}>{formatHebrewDate(now)}</Text>
        </View>
        <View style={styles.pawBadge}>
          <Text style={styles.pawEmoji}>🐾</Text>
        </View>
      </View>

      <View style={[styles.statusCard, styles[`statusCard_${status.tone}`]]}>
        <Text style={styles.statusEmoji}>{status.emoji}</Text>
        <Text style={[styles.statusText, styles[`statusText_${status.tone}`]]}>
          {status.text}
        </Text>
      </View>

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
            <WalkRow
              walk={item}
              isOwn={item.user_id === user.id}
              onUpdated={handleRowUpdated}
              onDeleted={handleRowDeleted}
            />
          )}
        />
      )}

      <View style={styles.buttonRow}>
        <Pressable style={styles.historyButton} onPress={onHistory}>
          <Text style={styles.historyButtonText}>📜 היסטוריה</Text>
        </Pressable>
        <Pressable style={styles.addButton} onPress={onAddWalk}>
          <Text style={styles.addButtonText}>➕ הוספת טיול</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fbf9ff',
  },
  headerCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#dce7f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  headerTextGroup: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    color: '#1f2f4d',
  },
  dateSubtitle: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    color: '#5a6b8c',
    marginTop: 2,
  },
  pawBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 12,
  },
  pawEmoji: {
    fontSize: 20,
  },
  statusCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  statusCard_ok: {
    backgroundColor: '#e3f6e8',
  },
  statusCard_soon: {
    backgroundColor: '#fff2d9',
  },
  statusCard_urgent: {
    backgroundColor: '#fde3e3',
  },
  statusEmoji: {
    fontSize: 26,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  statusText_ok: {
    color: '#1e6b3a',
  },
  statusText_soon: {
    color: '#8a5a00',
  },
  statusText_urgent: {
    color: '#a3231f',
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
  buttonRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#aa3bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#aa3bff',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyButton: {
    backgroundColor: '#f0ecf9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  historyButtonText: {
    color: '#5a3d8a',
    fontSize: 16,
    fontWeight: '600',
  },
})
