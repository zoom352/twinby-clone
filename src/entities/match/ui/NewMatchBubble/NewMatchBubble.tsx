import { Avatar } from '@/shared/ui'
import type { Match } from '../../model/types'
import styles from './NewMatchBubble.module.css'

interface NewMatchBubbleProps {
  match: Match
  onClick: () => void
}

/** Аватар нового мэтча (ещё без переписки) в горизонтальной ленте */
export const NewMatchBubble = ({ match, onClick }: NewMatchBubbleProps) => (
  <button type="button" className={styles.bubble} onClick={onClick}>
    <Avatar src={match.profile.photos[0]} alt={match.profile.name} size={72} ring />
    <span className={styles.name}>{match.profile.name}</span>
  </button>
)
