import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'stardew-vallery-user'

export async function getStoredUser() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function setStoredUser(user) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}
