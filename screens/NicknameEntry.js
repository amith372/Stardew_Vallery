import { useState } from 'react'
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native'
import { supabase } from '../lib/supabaseClient'

export default function NicknameEntry({ onSaved }) {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    const trimmed = nickname.trim()
    if (!trimmed) return

    setSaving(true)
    setError('')

    const { data, error } = await supabase
      .from('users')
      .upsert({ nickname: trimmed }, { onConflict: 'nickname' })
      .select()
      .single()

    setSaving(false)

    if (error) {
      setError('לא ניתן היה לשמור את הכינוי. נסו שוב.')
      return
    }

    onSaved({ id: data.id, nickname: data.nickname })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ברוכים הבאים</Text>
      <Text style={styles.subtitle}>מה הכינוי שלכם?</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="כינוי"
        textAlign="right"
        autoFocus
      />
      <Pressable
        style={[styles.button, (saving || !nickname.trim()) && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving || !nickname.trim()}
      >
        <Text style={styles.buttonText}>{saving ? 'שומר…' : 'שמירה'}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  input: {
    width: '100%',
    maxWidth: 260,
    fontSize: 16,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    writingDirection: 'rtl',
  },
  button: {
    backgroundColor: '#aa3bff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    color: '#d33',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
})
