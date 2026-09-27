import { useState, type FormEvent } from 'react'
import { profileUpdated, type User } from '@/entities/user'
import { INTERESTS, LOOKING_FOR_LABELS, type LookingFor } from '@/shared/config'
import { useAppDispatch } from '@/shared/lib/store'
import { Button, ChipSelect, Input, SegmentedControl, TextArea } from '@/shared/ui'
import styles from './EditProfileForm.module.css'

const MAX_INTERESTS = 7

const lookingForOptions = (Object.keys(LOOKING_FOR_LABELS) as LookingFor[]).map((value) => ({
  value,
  label: LOOKING_FOR_LABELS[value],
}))

interface EditProfileFormProps {
  user: User
  onDone: () => void
}

export const EditProfileForm = ({ user, onDone }: EditProfileFormProps) => {
  const dispatch = useAppDispatch()

  const [name, setName] = useState(user.name)
  const [city, setCity] = useState(user.city)
  const [bio, setBio] = useState(user.bio)
  const [lookingFor, setLookingFor] = useState(user.lookingFor)
  const [interests, setInterests] = useState(user.interests)

  const isValid = name.trim().length >= 2 && interests.length >= 3

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValid) return

    dispatch(profileUpdated({ name: name.trim(), city: city.trim(), bio: bio.trim(), lookingFor, interests }))
    onDone()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input label="Имя" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Город" value={city} onChange={(e) => setCity(e.target.value)} />
      <TextArea label="О себе" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} />

      <div className={styles.section}>
        <span className={styles.label}>Показывать мне</span>
        <SegmentedControl options={lookingForOptions} value={lookingFor} onChange={setLookingFor} />
      </div>

      <div className={styles.section}>
        <span className={styles.label}>
          Интересы ({interests.length}/{MAX_INTERESTS}, минимум 3)
        </span>
        <ChipSelect options={INTERESTS} value={interests} onChange={setInterests} max={MAX_INTERESTS} />
      </div>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onDone}>
          Отмена
        </Button>
        <Button type="submit" disabled={!isValid}>
          Сохранить
        </Button>
      </div>
    </form>
  )
}
