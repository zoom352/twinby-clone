import { hashString } from '@/shared/lib'

/**
 * «Нейросетевая» совместимость в духе Twinby.
 * Мок: пересечение интересов + детерминированный шум от пары id,
 * чтобы процент не прыгал между рендерами.
 */
export const getCompatibility = (myInterests: string[], theirInterests: string[], pairKey: string) => {
  const common = theirInterests.filter((interest) => myInterests.includes(interest)).length
  const union = new Set([...myInterests, ...theirInterests]).size || 1
  const base = 58 + Math.round((common / union) * 32)
  const noise = hashString(pairKey) % 10

  return Math.min(99, base + noise)
}

export const getCommonInterests = (myInterests: string[], theirInterests: string[]) =>
  theirInterests.filter((interest) => myInterests.includes(interest))
