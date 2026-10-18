import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectMatchById } from '@/entities/match'
import { getCommonInterests, getCompatibility } from '@/entities/profile'
import { selectUser } from '@/entities/user'
import { GENDER_LABELS, ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib'
import { useAppSelector } from '@/shared/lib/store'
import { ArrowLeftIcon, Chip, VerifiedIcon } from '@/shared/ui'
import styles from './MatchProfile.module.css'

const NO_INTERESTS: string[] = []
const PHOTO_KEYS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 }
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })

/** Анкета участника мэтча: фото, описание, интересы, совместимость */
export const MatchProfile = ({ matchId }: { matchId: string }) => {
  const navigate = useNavigate()
  const match = useAppSelector((state) => selectMatchById(state, matchId))
  const user = useAppSelector(selectUser)
  const [photoIndex, setPhotoIndex] = useState(0)

  const myInterests = user?.interests ?? NO_INTERESTS
  const profileId = match?.profile.id ?? ''
  const photoCount = match?.profile.photos.length ?? 0

  useEffect(() => {
    if (photoCount < 2) return
    const handleKeyDown = (event: KeyboardEvent) => {
      const step = PHOTO_KEYS[event.key]
      if (!step) return
      event.preventDefault()
      setPhotoIndex((index) => Math.min(photoCount - 1, Math.max(0, index + step)))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [photoCount])

  if (!match) return null

  const { profile } = match
  const lastPhoto = profile.photos.length - 1
  const compatibility = getCompatibility(myInterests, profile.interests, `${user?.id ?? ''}:${profileId}`)
  const commonInterests = getCommonInterests(myInterests, profile.interests)

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate(ROUTES.chat(match.id))}
          aria-label="Назад к переписке"
        >
          <ArrowLeftIcon />
        </button>
        <span className={styles.topbarTitle}>Анкета</span>
        <span className={styles.topbarSpacer} />
      </header>

      <div className={styles.photos}>
        <img
          className={styles.photo}
          src={profile.photos[photoIndex]}
          alt={`${profile.name}, фото ${photoIndex + 1}`}
          draggable={false}
        />

        {profile.photos.length > 1 && (
          <div className={styles.progress}>
            {profile.photos.map((photo, index) => (
              <span key={photo} className={cn(styles.bar, index === photoIndex && styles.barActive)} />
            ))}
          </div>
        )}

        <button
          type="button"
          className={cn(styles.zone, styles.zoneLeft)}
          aria-label="Предыдущее фото"
          onClick={() => setPhotoIndex((index) => Math.max(0, index - 1))}
        />
        <button
          type="button"
          className={cn(styles.zone, styles.zoneRight)}
          aria-label="Следующее фото"
          onClick={() => setPhotoIndex((index) => Math.min(lastPhoto, index + 1))}
        />
      </div>

      <section className={styles.info}>
        <div className={styles.title}>
          <h1 className={styles.name}>
            {profile.name}, <span className={styles.age}>{profile.age}</span>
            {profile.verified && <VerifiedIcon size={22} />}
          </h1>
          <span className={styles.compatibility} title="Совместимость по версии нейросети">
            🧠 {compatibility}%
          </span>
        </div>

        <p className={styles.meta}>
          {profile.online && <span className={styles.online} />}
          {GENDER_LABELS[profile.gender]} · {profile.city}
          {profile.job ? ` · ${profile.job}` : ''} · {profile.distanceKm} км от вас
        </p>

        <p className={styles.bio}>{profile.bio || 'Пользователь пока не рассказал о себе'}</p>

        <div className={styles.interests}>
          {profile.interests.map((interest) => (
            <Chip key={interest} active={commonInterests.includes(interest)}>
              {interest}
            </Chip>
          ))}
        </div>

        {commonInterests.length > 0 && (
          <p className={styles.common}>Общие интересы: {commonInterests.join(', ')}</p>
        )}

        <p className={styles.since}>Мэтч создан {dateFormatter.format(match.createdAt)}</p>
      </section>
    </div>
  )
}
