import { cn } from '@/shared/lib'
import { Avatar } from '@/shared/ui'
import type { Match } from '../../model/types'
import styles from './MatchRow.module.css'

interface MatchRowProps {
  match: Match
  subtitle: string
  time?: string
  highlighted?: boolean
  onClick: () => void
}

/** Строка диалога в списке мэтчей */
export const MatchRow = ({ match, subtitle, time, highlighted = false, onClick }: MatchRowProps) => (
  <button type="button" className={styles.row} onClick={onClick}>
    <Avatar src={match.profile.photos[0]} alt={match.profile.name} size={56} online={match.profile.online} />
    <span className={styles.body}>
      <span className={styles.top}>
        <span className={styles.name}>{match.profile.name}</span>
        {time && <span className={styles.time}>{time}</span>}
      </span>
      <span className={cn(styles.subtitle, highlighted && styles.highlighted)}>{subtitle}</span>
    </span>
  </button>
)
