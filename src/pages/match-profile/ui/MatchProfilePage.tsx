import { Navigate, useParams } from 'react-router-dom'
import { MatchProfile } from '@/widgets/match-profile'
import { ROUTES } from '@/shared/config'

export const MatchProfilePage = () => {
  const { matchId } = useParams<{ matchId: string }>()

  if (!matchId) return <Navigate to={ROUTES.matches} replace />

  return <MatchProfile matchId={matchId} />
}
