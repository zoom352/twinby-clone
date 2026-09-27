import { mockRequest } from '@/shared/api'
import type { LookingFor } from '@/shared/config'
import { MOCK_PROFILES } from './mockProfiles'

export const profileApi = {
  getCandidates: (lookingFor: LookingFor) =>
    mockRequest(
      MOCK_PROFILES.filter((profile) => lookingFor === 'any' || profile.gender === lookingFor),
      700,
    ),
}
