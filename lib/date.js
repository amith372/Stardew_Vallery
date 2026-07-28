export function todayString() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDateForDisplay(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function toDateTime(walkDate, walkTime) {
  return new Date(`${walkDate}T${walkTime}`)
}

const WEEKDAYS_HE = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'יום שבת']
const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']

export function formatHebrewDate(date) {
  const weekday = WEEKDAYS_HE[date.getDay()]
  const month = MONTHS_HE[date.getMonth()]
  return `${weekday}, ${date.getDate()} ב${month} ${date.getFullYear()}`
}
