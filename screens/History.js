import { useEffect, useState } from 'react'
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabaseClient'
import { todayString, formatDateForDisplay } from '../lib/date'
import WalkRow from '../components/WalkRow'

function groupByDate(rows) {
  const sections = []
  for (const row of rows) {
    const last = sections[sections.length - 1]
    if (!last || last.date !== row.walk_date) {
      sections.push({ date: row.walk_date, title: formatDateForDisplay(row.walk_date), data: [row] })
    } else {
      last.data.push(row)
    }
  }
  return sections
}

export default function History({ user, onBack }) {
  const insets = useSafeAreaInsets()
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadWalks() {
      setLoading(true)
      setError('')
      const { data, error } = await supabase
        .from('walks')
        .select('id, walk_date, walk_time, pooped, peed, note, user_id, users(nickname)')
        .lt('walk_date', todayString())
        .order('walk_date', { ascending: false })
        .order('walk_time', { ascending: true })

      if (cancelled) return
      if (error) {
        setError('לא ניתן היה לטעון את ההיסטוריה.')
      } else {
        setSections(groupByDate(data))
      }
      setLoading(false)
    }

    loadWalks()
    return () => {
      cancelled = true
    }
  }, [])

  function handleRowUpdated(id, field, value) {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        data: section.data.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
      }))
    )
  }

  function handleRowDeleted(id) {
    setSections((prev) =>
      prev
        .map((section) => ({
          ...section,
          data: section.data.filter((w) => w.id !== id),
        }))
        .filter((section) => section.data.length > 0)
    )
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>📜 היסטוריה</Text>
        <Pressable onPress={onBack}>
          <Text style={styles.backLink}>‹ חזרה</Text>
        </Pressable>
      </View>

      {loading ? (
        <Text style={styles.message}>טוען…</Text>
      ) : error ? (
        <Text style={[styles.message, styles.error]}>{error}</Text>
      ) : sections.length === 0 ? (
        <Text style={styles.message}>אין עדיין היסטוריה.</Text>
      ) : (
        <SectionList
          style={styles.list}
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>📅 {section.title}</Text>
          )}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fbf9ff',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    color: '#2d1b4e',
  },
  backLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#aa3bff',
    writingDirection: 'rtl',
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 14,
    marginBottom: 8,
    color: '#5a3d8a',
  },
})
