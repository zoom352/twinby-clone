import { useNavigate } from 'react-router-dom'
import { selectMatchById } from '@/entities/match'
import { getCommonInterests, getCompatibility } from '@/entities/profile'
import { selectUser } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
import { ProfileDetails } from '@/widgets/profile-details'
import styles from './MatchProfile.module.css'

const NO_INTERESTS: string[] = []
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })

/** Анкета участника мэтча: фото, описание, интересы, совместимость */
export const MatchProfile = ({ matchId }: { matchId: string }) => {
  const navigate = useNavigate()
  const match = useAppSelector((state) => selectMatchById(state, matchId))
  const user = useAppSelector(selectUser)

  if (!match) return null

  const { profile } = match
  const myInterests = user?.interests ?? NO_INTERESTS
  const compatibility = getCompatibility(myInterests, profile.interests, `${user?.id ?? ''}:${profile.id}`)
  const commonInterests = getCommonInterests(myInterests, profile.interests)

  return (
    <ProfileDetails
      profile={profile}
      compatibility={compatibility}
      commonInterests={commonInterests}
      ariaBackLabel="Назад к переписке"
      onBack={() => navigate(ROUTES.chat(match.id))}
      captionSlot={<p className={styles.since}>Мэтч создан {dateFormatter.format(match.createdAt)}</p>}
    />
  )
}
