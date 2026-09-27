import { useState } from 'react'
import { cn } from '@/shared/lib'
import { Chip, InfoIcon, VerifiedIcon } from '@/shared/ui'
import type { Profile } from '../../model/types'
import styles from './ProfileCard.module.css'

interface ProfileCardProps {
  profile: Profile
  compatibility?: number
  commonInterests?: string[]
}

export const ProfileCard = ({ profile, compatibility, commonInterests = [] }: ProfileCardProps) => {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const lastPhoto = profile.photos.length - 1

  const visibleInterests = expanded ? profile.interests : profile.interests.slice(0, 3)

  return (
    <article className={styles.card}>
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

      {compatibility !== undefined && (
        <div className={styles.compatibility} title="Совместимость по версии нейросети">
          🧠 {compatibility}%
        </div>
      )}

      <div className={cn(styles.info, expanded && styles.infoExpanded)}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.name}>
              {profile.name}, <span className={styles.age}>{profile.age}</span>
              {profile.verified && <VerifiedIcon size={22} />}
            </h2>
            <p className={styles.meta}>
              {profile.online && <span className={styles.online} />}
              {profile.job ? `${profile.job} · ` : ''}
              {profile.distanceKm} км от вас
            </p>
          </div>
          <button
            type="button"
            className={styles.infoButton}
            aria-label={expanded ? 'Свернуть анкету' : 'Подробнее'}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            <InfoIcon size={26} />
          </button>
        </div>

        {expanded && <p className={styles.bio}>{profile.bio}</p>}

        <div className={styles.interests}>
          {visibleInterests.map((interest) => (
            <Chip key={interest} variant="glass" active={commonInterests.includes(interest)}>
              {interest}
            </Chip>
          ))}
        </div>
      </div>
    </article>
  )
}
