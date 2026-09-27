import { useNavigate } from 'react-router-dom'
import { pendingMatchCleared, selectPendingMatch } from '@/entities/match'
import { getCompatibility } from '@/entities/profile'
import { selectUser } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { Avatar, Button, HeartIcon } from '@/shared/ui'
import styles from './MatchModal.module.css'

/** Поздравление со взаимной симпатией */
export const MatchModal = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const match = useAppSelector(selectPendingMatch)
  const user = useAppSelector(selectUser)

  if (!match || !user) return null

  const { profile } = match
  const compatibility = getCompatibility(user.interests, profile.interests, `${user.id}:${profile.id}`)

  const close = () => dispatch(pendingMatchCleared())
  const openChat = () => {
    close()
    navigate(ROUTES.chat(match.id))
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="match-title">
      <div className={styles.content}>
        <h2 id="match-title" className={styles.title}>
          Это мэтч!
        </h2>
        <p className={styles.subtitle}>Вы и {profile.name} понравились друг другу</p>

        <div className={styles.avatars}>
          <Avatar src={user.photo} alt={user.name} size={120} ring className={styles.left} />
          <span className={styles.heart}>
            <HeartIcon size={28} />
          </span>
          <Avatar src={profile.photos[0]} alt={profile.name} size={120} ring className={styles.right} />
        </div>

        <p className={styles.compat}>🧠 Совместимость {compatibility}%</p>

        <div className={styles.actions}>
          <Button size="lg" fullWidth onClick={openChat}>
            Написать сообщение
          </Button>
          <Button variant="ghost" fullWidth onClick={close} className={styles.later}>
            Продолжить свайпать
          </Button>
        </div>
      </div>
    </div>
  )
}
