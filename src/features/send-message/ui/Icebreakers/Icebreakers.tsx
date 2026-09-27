import { useAppDispatch } from '@/shared/lib/store'
import { ICEBREAKERS } from '../../lib/replies'
import { sendMessage } from '../../model/sendMessage'
import styles from './Icebreakers.module.css'

/** Подсказки для первого сообщения */
export const Icebreakers = ({ matchId }: { matchId: string }) => {
  const dispatch = useAppDispatch()

  return (
    <div className={styles.list}>
      {ICEBREAKERS.map((text) => (
        <button key={text} type="button" className={styles.item} onClick={() => dispatch(sendMessage({ matchId, text }))}>
          {text}
        </button>
      ))}
    </div>
  )
}
