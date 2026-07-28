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
      <Text style={styles.emoji}>🐶</Text>
      <Text style={styles.title}>ברוכים הבאים 👋</Text>
      <Text style={styles.subtitle}>מה הכינוי שלכם?</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="כינוי"
        placeholderTextColor="#aaa"
        textAlign="right"
        autoFocus
      />
      <Pressable
        style={[styles.button, (saving || !nickname.trim()) && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving || !nickname.trim()}
      >
        <Text style={styles.buttonText}>{saving ? 'שומר…' : '✅ שמירה'}</Text>
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
    backgroundColor: '#fbf9ff',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    color: '#2d1b4e',
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
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    writingDirection: 'rtl',
  },
  button: {
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
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#d33',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
})
