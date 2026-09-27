import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  fullWidth?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(styles.button, styles[variant], styles[size], fullWidth && styles.full, className)}
    {...props}
  />
)
