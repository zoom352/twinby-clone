import { useEffect, useState, type ReactNode } from 'react'
import type { Profile } from '@/entities/profile'
import { GENDER_LABELS } from '@/shared/config'
import { cn } from '@/shared/lib'
import { ArrowLeftIcon, Chip, VerifiedIcon } from '@/shared/ui'
import styles from './ProfileDetails.module.css'

const PHOTO_KEYS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 }
const NO_INTERESTS: string[] = []

interface ProfileDetailsProps {
  profile: Profile
  compatibility: number
  commonInterests?: string[]
  /** Заголовок в topbar */
  title?: string
  ariaBackLabel?: string
  onBack: () => void
  /** Подпись под блоком интересов (например, дата мэтча) */
  captionSlot?: ReactNode
  /** Действия внизу экрана */
  footerSlot?: ReactNode
}

/** Подробная анкета: фото с прогресс-барами, описание, интересы, совместимость */
export const ProfileDetails = ({
  profile,
  compatibility,
  commonInterests = NO_INTERESTS,
  title = 'Анкета',
  ariaBackLabel = 'Назад',
  onBack,
  captionSlot,
  footerSlot,
}: ProfileDetailsProps) => {
  const [photoIndex, setPhotoIndex] = useState(0)
  const photoCount = profile.photos.length
  const lastPhoto = photoCount - 1

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

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <button type="button" className={styles.back} onClick={onBack} aria-label={ariaBackLabel}>
          <ArrowLeftIcon />
        </button>
        <span className={styles.topbarTitle}>{title}</span>
        <span className={styles.topbarSpacer} />
      </header>

      <div className={styles.photos}>
        <img
          className={styles.photo}
          src={profile.photos[photoIndex]}
          alt={`${profile.name}, фото ${photoIndex + 1}`}
          draggable={false}
        />

        {photoCount > 1 && (
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

        {captionSlot}
      </section>

      {footerSlot && <div className={styles.footer}>{footerSlot}</div>}
    </div>
  )
}
