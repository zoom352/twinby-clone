import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import styles from './Input.module.css'

interface FieldProps {
  label?: string
  error?: string
}

type InputProps = FieldProps & InputHTMLAttributes<HTMLInputElement>
type TextAreaProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export const Input = ({ label, error, className, id, ...props }: InputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label className={cn(styles.field, className)} htmlFor={inputId}>
      {label && <span className={styles.label}>{label}</span>}
      <input id={inputId} className={cn(styles.control, error && styles.invalid)} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  )
}

export const TextArea = ({ label, error, className, id, ...props }: TextAreaProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label className={cn(styles.field, className)} htmlFor={inputId}>
      {label && <span className={styles.label}>{label}</span>}
      <textarea
        id={inputId}
        className={cn(styles.control, styles.textarea, error && styles.invalid)}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  )
}
