import { useEffect, useState } from 'react'
import { Pressable, SectionList, StyleSheet, Switch, Text, View } from 'react-native'
import { supabase } from '../lib/supabaseClient'
import { todayString, formatDateForDisplay } from '../lib/date'

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
        .select('id, walk_date, walk_time, pooped, peed, user_id, users(nickname)')
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

  async function toggleFlag(walk, field, value) {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        data: section.data.map((w) => (w.id === walk.id ? { ...w, [field]: value } : w)),
      }))
    )
    await supabase.from('walks').update({ [field]: value }).eq('id', walk.id)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>היסטוריה</Text>
        <Pressable onPress={onBack}>
          <Text style={styles.backLink}>חזרה</Text>
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
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {item.user_id === user.id ? (
                <View style={styles.switchGroup}>
                  <View style={styles.switchItem}>
                    <Switch
                      value={item.peed}
                      onValueChange={(v) => toggleFlag(item, 'peed', v)}
                    />
                    <Text style={styles.switchLabel}>פיפי</Text>
                  </View>
                  <View style={styles.switchItem}>
                    <Switch
                      value={item.pooped}
                      onValueChange={(v) => toggleFlag(item, 'pooped', v)}
                    />
                    <Text style={styles.switchLabel}>קקי</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.flags}>
                  {item.pooped ? '💩' : '—'} {item.peed ? '💧' : '—'}
                </Text>
              )}
              <Text style={styles.nickname}>{item.users.nickname}</Text>
              <Text style={styles.time}>{item.walk_time.slice(0, 5)}</Text>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  backLink: {
    fontSize: 16,
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
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
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
  switchGroup: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  switchItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  switchLabel: {
    fontSize: 13,
    writingDirection: 'rtl',
  },
})
