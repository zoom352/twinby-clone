import { Navigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/shared/config'
import { FeedProfile } from '@/widgets/feed-profile'

export const FeedProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>()

  if (!profileId) return <Navigate to={ROUTES.feed} replace />

  return <FeedProfile profileId={profileId} />
}
