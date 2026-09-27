import type { Gender } from '@/shared/config'

/** Анкета другого пользователя в ленте знакомств */
export interface Profile {
  id: string
  name: string
  age: number
  gender: Gender
  city: string
  distanceKm: number
  job?: string
  bio: string
  interests: string[]
  photos: string[]
  verified: boolean
  online: boolean
  /** Мок-флаг: лайкнул ли этот человек текущего пользователя (для мэтча) */
  likesYou: boolean
}
