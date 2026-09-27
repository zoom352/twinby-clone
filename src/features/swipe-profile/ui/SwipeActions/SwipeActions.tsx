import { cn } from '@/shared/lib'
import { CloseIcon, HeartIcon, StarIcon } from '@/shared/ui'
import type { SwipeDirection } from '../../model/types'
import styles from './SwipeActions.module.css'

interface SwipeActionsProps {
  onAction: (direction: SwipeDirection) => void
  disabled?: boolean
}

export const SwipeActions = ({ onAction, disabled = false }: SwipeActionsProps) => (
  <div className={styles.actions}>
    <button
      type="button"
      className={cn(styles.action, styles.dislike)}
      onClick={() => onAction('dislike')}
      disabled={disabled}
      aria-label="Не нравится"
      title="Не нравится (←)"
    >
      <CloseIcon size={30} />
    </button>
    <button
      type="button"
      className={cn(styles.action, styles.superlike)}
      onClick={() => onAction('superlike')}
      disabled={disabled}
      aria-label="Суперлайк"
      title="Суперлайк (↑)"
    >
      <StarIcon size={24} />
    </button>
    <button
      type="button"
      className={cn(styles.action, styles.like)}
      onClick={() => onAction('like')}
      disabled={disabled}
      aria-label="Нравится"
      title="Нравится (→)"
    >
      <HeartIcon size={32} />
    </button>
  </div>
)
