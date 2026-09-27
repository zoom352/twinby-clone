import { cn } from '@/shared/lib'
import styles from './Avatar.module.css'

interface AvatarProps {
  src: string
  alt: string
  size?: number
  online?: boolean
  ring?: boolean
  className?: string
}

export const Avatar = ({ src, alt, size = 48, online = false, ring = false, className }: AvatarProps) => (
  <span className={cn(styles.avatar, ring && styles.ring, className)} style={{ width: size, height: size }}>
    <img className={styles.image} src={src} alt={alt} loading="lazy" draggable={false} />
    {online && <span className={styles.online} />}
  </span>
)
