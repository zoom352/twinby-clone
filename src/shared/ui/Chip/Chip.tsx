import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import styles from './Chip.module.css'

interface ChipProps {
  children: ReactNode
  active?: boolean
  variant?: 'default' | 'glass'
  onClick?: () => void
}

export const Chip = ({ children, active = false, variant = 'default', onClick }: ChipProps) => {
  const className = cn(styles.chip, styles[variant], active && styles.active, onClick && styles.clickable)

  return onClick ? (
    <button type="button" className={className} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  ) : (
    <span className={className}>{children}</span>
  )
}
