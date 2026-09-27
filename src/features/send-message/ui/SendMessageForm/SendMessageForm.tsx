import { useState, type FormEvent } from 'react'
import { useAppDispatch } from '@/shared/lib/store'
import { SendIcon } from '@/shared/ui'
import { sendMessage } from '../../model/sendMessage'
import styles from './SendMessageForm.module.css'

export const SendMessageForm = ({ matchId }: { matchId: string }) => {
  const dispatch = useAppDispatch()
  const [text, setText] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    dispatch(sendMessage({ matchId, text: trimmed }))
    setText('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Напишите сообщение…"
        maxLength={1000}
        autoFocus
      />
      <button type="submit" className={styles.send} disabled={!text.trim()} aria-label="Отправить">
        <SendIcon size={22} />
      </button>
    </form>
  )
}
