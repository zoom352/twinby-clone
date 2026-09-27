import { messageAdded, typingChanged } from '@/entities/message'
import { delay } from '@/shared/lib'
import { createAppAsyncThunk } from '@/shared/lib/store'
import { getAutoReply } from '../lib/replies'

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

/** Отправка сообщения + эмуляция ответа собеседника */
export const sendMessage = createAppAsyncThunk(
  'chat/sendMessage',
  async ({ matchId, text }: { matchId: string; text: string }, { dispatch, getState }) => {
    dispatch(messageAdded({ matchId, author: 'me', text }))

    await delay(randomBetween(600, 1200))
    const isMatchAlive = () => getState().matches.items.some((match) => match.id === matchId)
    if (!isMatchAlive()) return

    dispatch(typingChanged({ matchId, typing: true }))
    await delay(randomBetween(1200, 2400))
    dispatch(typingChanged({ matchId, typing: false }))

    if (isMatchAlive()) {
      dispatch(messageAdded({ matchId, author: 'them', text: getAutoReply(text) }))
    }
  },
)
