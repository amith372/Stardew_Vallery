const STORAGE_KEY = 'stardew-vallery-user'

export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}
