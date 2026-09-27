import { matchRemoved } from '@/entities/match'
import { conversationRemoved } from '@/entities/message'
import { useAppDispatch } from '@/shared/lib/store'
import { Button } from '@/shared/ui'

interface UnmatchButtonProps {
  matchId: string
  name: string
  onDone: () => void
}

export const UnmatchButton = ({ matchId, name, onDone }: UnmatchButtonProps) => {
  const dispatch = useAppDispatch()

  const handleClick = () => {
    if (!window.confirm(`Удалить мэтч с ${name}? Переписка будет удалена.`)) return
    onDone()
    dispatch(matchRemoved(matchId))
    dispatch(conversationRemoved(matchId))
  }

  return (
    <Button variant="ghost" onClick={handleClick}>
      Удалить мэтч
    </Button>
  )
}
