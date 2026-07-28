import { useState } from 'react'
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
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
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openTimePicker() {
    DateTimePickerAndroid.open({
      value: time,
      mode: 'time',
      is24Hour: true,
      onChange: (_, selected) => {
        if (selected) setTime(selected)
      },
    })
  }

  async function handleSave() {
    setSaving(true)
    setError('')

    const { error } = await supabase.from('walks').insert({
      user_id: user.id,
      walk_date: todayString(),
      walk_time: timeToString(time),
      pooped,
      peed,
      note: note.trim() || null,
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
      <Text style={styles.title}>🐕 הוספת טיול</Text>

      <Text style={styles.label}>🕐 שעה</Text>
      <Pressable style={styles.timeButton} onPress={openTimePicker}>
        <Text style={styles.timeButtonText}>{timeToString(time)}</Text>
      </Pressable>

      <View style={styles.toggleCard}>
        <View style={styles.toggleRow}>
          <Switch value={pooped} onValueChange={setPooped} />
          <Text style={styles.toggleLabel}>💩 עשתה קקי</Text>
        </View>

        <View style={styles.toggleRow}>
          <Switch value={peed} onValueChange={setPeed} />
          <Text style={styles.toggleLabel}>💦 עשתה פיפי</Text>
        </View>
      </View>

      <Text style={styles.label}>📝 הערה (אופציונלי)</Text>
      <TextInput
        style={styles.noteInput}
        value={note}
        onChangeText={setNote}
        placeholder="הוסיפו הערה…"
        placeholderTextColor="#aaa"
        textAlign="right"
        multiline
      />

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
          <Text style={styles.saveButtonText}>{saving ? 'שומר…' : '✅ שמירה'}</Text>
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
    backgroundColor: '#fbf9ff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 20,
    alignSelf: 'stretch',
    color: '#2d1b4e',
  },
  label: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'stretch',
    marginTop: 20,
    marginBottom: 4,
  },
  noteInput: {
    alignSelf: 'stretch',
    minHeight: 60,
    fontSize: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    writingDirection: 'rtl',
    textAlignVertical: 'top',
  },
  timeButton: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  timeButtonText: {
    fontSize: 18,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
  toggleCard: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    gap: 16,
    shadowColor: '#3a2a5c',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  toggleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  saveButton: {
    backgroundColor: '#aa3bff',
    shadowColor: '#aa3bff',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#f0ecf9',
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#5a3d8a',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    marginTop: 12,
    color: '#d33',
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'stretch',
  },
})
