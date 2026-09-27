import { Chip } from '../Chip'
import styles from './ChipSelect.module.css'

interface ChipSelectProps {
  options: readonly string[]
  value: string[]
  onChange: (value: string[]) => void
  max?: number
}

export const ChipSelect = ({ options, value, onChange, max = Infinity }: ChipSelectProps) => {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option))
    } else if (value.length < max) {
      onChange([...value, option])
    }
  }

  return (
    <div className={styles.list}>
      {options.map((option) => (
        <Chip key={option} active={value.includes(option)} onClick={() => toggle(option)}>
          {option}
        </Chip>
      ))}
    </div>
  )
}
