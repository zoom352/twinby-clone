import { cn } from '@/shared/lib'
import styles from './SegmentedControl.module.css'

interface SegmentedControlProps<T extends string> {
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
}

export const SegmentedControl = <T extends string>({ options, value, onChange }: SegmentedControlProps<T>) => (
  <div className={styles.control} role="radiogroup">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="radio"
        aria-checked={option.value === value}
        className={cn(styles.option, option.value === value && styles.active)}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
)
