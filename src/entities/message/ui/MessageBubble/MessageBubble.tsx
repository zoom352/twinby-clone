import { cn, formatTime } from '@/shared/lib'
import type { Message } from '../../model/types'
import styles from './MessageBubble.module.css'

export const MessageBubble = ({ message }: { message: Message }) => (
  <div className={cn(styles.bubble, message.author === 'me' ? styles.mine : styles.theirs)}>
    <p className={styles.text}>{message.text}</p>
    <time className={styles.time}>{formatTime(message.createdAt)}</time>
  </div>
)

export const TypingBubble = () => (
  <div className={cn(styles.bubble, styles.theirs, styles.typing)} aria-label="Собеседник печатает">
    <span />
    <span />
    <span />
  </div>
)
