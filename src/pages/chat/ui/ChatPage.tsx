import { Navigate, useParams } from 'react-router-dom'
import { selectMatchById } from '@/entities/match'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
import { ChatWindow } from '@/widgets/chat-window'

export const ChatPage = () => {
  const { matchId = '' } = useParams<{ matchId: string }>()
  const match = useAppSelector((state) => selectMatchById(state, matchId))

  if (!match) {
    return <Navigate to={ROUTES.matches} replace />
  }

  return <ChatWindow matchId={matchId} />
}
