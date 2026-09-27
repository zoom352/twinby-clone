import { useState, type FormEvent } from 'react'
import { getDefaultAvatar, loggedIn } from '@/entities/user'
import { INTERESTS, LOOKING_FOR_LABELS, GENDER_LABELS, type Gender, type LookingFor } from '@/shared/config'
import { createId } from '@/shared/lib'
import { useAppDispatch } from '@/shared/lib/store'
import { Button, ChipSelect, Input, SegmentedControl, TextArea } from '@/shared/ui'
import styles from './OnboardingForm.module.css'

const MIN_INTERESTS = 3
const MAX_INTERESTS = 7

const genderOptions = (Object.keys(GENDER_LABELS) as Gender[]).map((value) => ({
  value,
  label: GENDER_LABELS[value],
}))

const lookingForOptions = (Object.keys(LOOKING_FOR_LABELS) as LookingFor[]).map((value) => ({
  value,
  label: LOOKING_FOR_LABELS[value],
}))

interface FormErrors {
  name?: string
  age?: string
  interests?: string
}

export const OnboardingForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const dispatch = useAppDispatch()

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [lookingFor, setLookingFor] = useState<LookingFor>('female')
  const [city, setCity] = useState('Москва')
  const [bio, setBio] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): FormErrors => {
    const result: FormErrors = {}
    const ageNumber = Number(age)
    if (name.trim().length < 2) result.name = 'Введите имя (минимум 2 символа)'
    if (!Number.isInteger(ageNumber) || ageNumber < 18 || ageNumber > 99) result.age = 'Возраст от 18 до 99 лет'
    if (interests.length < MIN_INTERESTS) result.interests = `Выберите хотя бы ${MIN_INTERESTS} интереса`
    return result
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    dispatch(
      loggedIn({
        id: createId(),
        name: name.trim(),
        age: Number(age),
        gender,
        lookingFor,
        city: city.trim() || 'Москва',
        bio: bio.trim(),
        interests,
        photo: getDefaultAvatar(gender),
      }),
    )
    onSuccess()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input label="Как вас зовут?" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="Имя" />

      <div className={styles.row}>
        <Input
          label="Возраст"
          type="number"
          inputMode="numeric"
          min={18}
          max={99}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          error={errors.age}
          placeholder="18+"
        />
        <Input label="Город" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>

      <div className={styles.section}>
        <span className={styles.label}>Я</span>
        <SegmentedControl options={genderOptions} value={gender} onChange={setGender} />
      </div>

      <div className={styles.section}>
        <span className={styles.label}>Ищу</span>
        <SegmentedControl options={lookingForOptions} value={lookingFor} onChange={setLookingFor} />
      </div>

      <div className={styles.section}>
        <span className={styles.label}>
          Интересы — нейросеть подберёт по ним совместимость ({interests.length}/{MAX_INTERESTS})
        </span>
        <ChipSelect options={INTERESTS} value={interests} onChange={setInterests} max={MAX_INTERESTS} />
        {errors.interests && <span className={styles.error}>{errors.interests}</span>}
      </div>

      <TextArea
        label="О себе"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Пара слов о том, что вас вдохновляет"
        maxLength={300}
      />

      <Button type="submit" size="lg" fullWidth>
        Начать знакомиться
      </Button>
    </form>
  )
}
