import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCommonInterests,
  getCompatibility,
  selectCandidateById,
} from '@/entities/profile'
import { selectUser } from '@/entities/user'
import { SwipeActions, swipeProfile, type SwipeDirection } from '@/features/swipe-profile'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { Button } from '@/shared/ui'
import { MatchModal } from '@/widgets/match-modal'
import { ProfileDetails } from '@/widgets/profile-details'
import styles from './FeedProfile.module.css'

const NO_INTERESTS: string[] = []

/** Подробная анкета из ленты: тот же вид, что у мэтча, но до свайпа */
export const FeedProfile = ({ profileId }: { profileId: string }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const profile = useAppSelector((state) => selectCandidateById(state, profileId))
  const user = useAppSelector(selectUser)

  const backToFeed = () => navigate(ROUTES.feed)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') backToFeed()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  if (!profile) {
    return (
      <div className={styles.placeholder}>
        <span className={styles.emoji}>🤷</span>
        <h3>Анкета недоступна</h3>
        <p>Вернитесь в ленту и откройте анкету заново</p>
        <Button onClick={backToFeed}>В ленту</Button>
      </div>
    )
  }

  const myInterests = user?.interests ?? NO_INTERESTS
  const compatibility = getCompatibility(myInterests, profile.interests, `${user?.id ?? ''}:${profile.id}`)
  const commonInterests = getCommonInterests(myInterests, profile.interests)

  const handleAction = (direction: SwipeDirection) => {
    dispatch(swipeProfile({ profile, direction }))
    backToFeed()
  }

  return (
    <>
      <ProfileDetails
        profile={profile}
        compatibility={compatibility}
        commonInterests={commonInterests}
        title="Анкета из ленты"
        ariaBackLabel="Назад к анкетам"
        onBack={backToFeed}
        footerSlot={<SwipeActions onAction={handleAction} />}
      />
      <MatchModal />
    </>
  )
}
