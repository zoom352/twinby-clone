import { matchesReset } from '@/entities/match'
import { messagesReset } from '@/entities/message'
import { candidatesReset } from '@/entities/profile'
import { loggedOut } from '@/entities/user'
import { useAppDispatch } from '@/shared/lib/store'
import { Button } from '@/shared/ui'

/** Выход: очищает сессию и все пользовательские данные */
export const LogoutButton = () => {
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    if (!window.confirm('Выйти из аккаунта? Мэтчи и переписки будут удалены.')) return
    dispatch(matchesReset())
    dispatch(messagesReset())
    dispatch(candidatesReset())
    dispatch(loggedOut())
  }

  return (
    <Button variant="ghost" fullWidth onClick={handleLogout}>
      Выйти из аккаунта
    </Button>
  )
}
