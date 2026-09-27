/** Детерминированный хэш строки (djb2) */
export const hashString = (value: string) => {
  let hash = 5381
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i)
  }
  return Math.abs(hash)
}
