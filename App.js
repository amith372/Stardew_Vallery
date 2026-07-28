import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { supabase } from './lib/supabaseClient'

export default function App() {
  console.log('supabase client ready:', Boolean(supabase))

  return (
    <View style={styles.container}>
      <Text style={styles.title}>יומן טיולי הכלב</Text>
      <Text style={styles.subtitle}>המסכים בדרך</Text>
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
