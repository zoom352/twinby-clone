import type { Profile } from '@/entities/profile/@x/match'

/** Взаимная симпатия: снимок анкеты на момент мэтча */
export interface Match {
  id: string
  profile: Profile
  createdAt: number
}
