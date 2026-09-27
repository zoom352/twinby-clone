import type { Gender, LookingFor } from '@/shared/config'

/** Текущий (авторизованный) пользователь */
export interface User {
  id: string
  name: string
  age: number
  gender: Gender
  lookingFor: LookingFor
  city: string
  bio: string
  interests: string[]
  photo: string
}
