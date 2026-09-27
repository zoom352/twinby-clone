import { useState } from 'react'
import { selectMatches } from '@/entities/match'
import { selectUser } from '@/entities/user'
import { EditProfileForm } from '@/features/edit-profile'
import { LogoutButton } from '@/features/logout'
import { GENDER_LABELS, LOOKING_FOR_LABELS } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
import { Avatar, Button, Chip } from '@/shared/ui'
import styles from './ProfilePage.module.css'

export const ProfilePage = () => {
  const user = useAppSelector(selectUser)
  const matchesCount = useAppSelector(selectMatches).length
  const [isEditing, setIsEditing] = useState(false)

  if (!user) return null

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <Avatar src={user.photo} alt={user.name} size={112} ring />
        <h1 className={styles.name}>
          {user.name}, {user.age}
        </h1>
        <p className={styles.meta}>
          {GENDER_LABELS[user.gender]} · {user.city} · ищу {LOOKING_FOR_LABELS[user.lookingFor].toLowerCase()}
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>{matchesCount}</strong>
            <span>мэтчей</span>
          </div>
          <div className={styles.stat}>
            <strong>{user.interests.length}</strong>
            <span>интересов</span>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        {isEditing ? (
          <EditProfileForm user={user} onDone={() => setIsEditing(false)} />
        ) : (
          <>
            <h2 className={styles.cardTitle}>О себе</h2>
            <p className={styles.bio}>{user.bio || 'Расскажите о себе — так больше шансов на мэтч'}</p>

            <h2 className={styles.cardTitle}>Интересы</h2>
            <div className={styles.interests}>
              {user.interests.map((interest) => (
                <Chip key={interest}>{interest}</Chip>
              ))}
            </div>

            <Button variant="secondary" fullWidth onClick={() => setIsEditing(true)}>
              Редактировать профиль
            </Button>
          </>
        )}
      </section>

      <LogoutButton />
    </div>
  )
}
