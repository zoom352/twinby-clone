export type { Profile } from './model/types'
export {
  candidatesSlice,
  fetchCandidates,
  candidateSwiped,
  swipeHistoryCleared,
  candidatesReset,
  selectCandidates,
  selectTopCandidate,
  selectCandidateById,
  selectCandidatesStatus,
  selectCandidatesError,
  selectCandidatesLoadedFor,
} from './model/candidatesSlice'
export { getCompatibility, getCommonInterests } from './lib/compatibility'
export { ProfileCard } from './ui/ProfileCard/ProfileCard'
