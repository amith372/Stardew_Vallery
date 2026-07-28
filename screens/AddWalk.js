import { useState } from 'react'
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { supabase } from '../lib/supabaseClient'
import { todayString } from '../lib/date'

function timeToString(date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export default function AddWalk({ user, onSaved, onCancel }) {
  const [time, setTime] = useState(new Date())
  const [pooped, setPooped] = useState(false)
  const [peed, setPeed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')

    const { error } = await supabase.from('walks').insert({
      user_id: user.id,
      walk_date: todayString(),
      walk_time: timeToString(time),
      pooped,
      peed,
    })

    setSaving(false)

    if (error) {
      setError('לא ניתן היה לשמור את הטיול. נסו שוב.')
      return
    }

    onSaved()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>הוספת טיול</Text>

      <Text style={styles.label}>שעה</Text>
      <DateTimePicker
        value={time}
        mode="time"
        display="default"
        onChange={(_, selected) => selected && setTime(selected)}
      />

      <View style={styles.toggleRow}>
        <Switch value={pooped} onValueChange={setPooped} />
        <Text style={styles.toggleLabel}>עשתה קקי</Text>
      </View>

      <View style={styles.toggleRow}>
        <Switch value={peed} onValueChange={setPeed} />
        <Text style={styles.toggleLabel}>עשתה פיפי</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>ביטול</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'שומר…' : 'שמירה'}</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'stretch',
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  toggleLabel: {
    fontSize: 16,
    writingDirection: 'rtl',
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 24,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: '#aa3bff',
  },
  cancelButton: {
    backgroundColor: '#f4f3ec',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    marginTop: 12,
    color: '#d33',
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'stretch',
  },
})
