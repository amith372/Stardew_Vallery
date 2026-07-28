import { useState } from 'react'
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { supabase } from '../lib/supabaseClient'

export default function WalkRow({ walk, isOwn, onUpdated }) {
  const [note, setNote] = useState(walk.note ?? '')

  async function updateField(field, value) {
    onUpdated(walk.id, field, value)
    await supabase.from('walks').update({ [field]: value }).eq('id', walk.id)
  }

  function handleNoteBlur() {
    const trimmed = note.trim()
    if (trimmed !== (walk.note ?? '')) {
      updateField('note', trimmed || null)
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.leadGroup}>
          <View style={styles.nicknameBadge}>
            <Text style={styles.nicknameBadgeText}>{walk.users.nickname}</Text>
          </View>
          <Text style={styles.time}>{walk.walk_time.slice(0, 5)}</Text>
        </View>
        {isOwn ? (
          <View style={styles.switchGroup}>
            <View style={styles.switchItem}>
              <Switch value={walk.peed} onValueChange={(v) => updateField('peed', v)} />
              <Text style={styles.switchLabel}>💦 פיפי</Text>
            </View>
            <View style={styles.switchItem}>
              <Switch value={walk.pooped} onValueChange={(v) => updateField('pooped', v)} />
              <Text style={styles.switchLabel}>💩 קקי</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.flags}>
            {walk.pooped ? '💩' : '—'} {walk.peed ? '💧' : '—'}
          </Text>
        )}
      </View>

      {isOwn ? (
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          onBlur={handleNoteBlur}
          placeholder="📝 הוסיפו הערה…"
          placeholderTextColor="#aaa"
          textAlign="right"
        />
      ) : walk.note ? (
        <Text style={styles.noteText}>📝 {walk.note}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#3a2a5c',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leadGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  nicknameBadge: {
    backgroundColor: '#f0ecf9',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  nicknameBadgeText: {
    color: '#5a3d8a',
    fontWeight: '700',
    fontSize: 13,
    writingDirection: 'rtl',
  },
  time: {
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
    color: '#2d1b4e',
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
  noteInput: {
    marginTop: 10,
    fontSize: 14,
    writingDirection: 'rtl',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  noteText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    writingDirection: 'rtl',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
})
