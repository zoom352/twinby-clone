import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MatchRow, NewMatchBubble, selectMatches } from '@/entities/match'
import { selectAllConversations } from '@/entities/message'
import { ROUTES } from '@/shared/config'
import { formatTime } from '@/shared/lib'
import { useAppSelector } from '@/shared/lib/store'
import { Button } from '@/shared/ui'
import styles from './MatchesList.module.css'

export const MatchesList = () => {
  const navigate = useNavigate()
  const matches = useAppSelector(selectMatches)
  const conversations = useAppSelector(selectAllConversations)

  const { newMatches, dialogs } = useMemo(() => {
    const withLast = matches.map((match) => ({ match, last: conversations[match.id]?.at(-1) }))
    return {
      newMatches: withLast.filter(({ last }) => !last).map(({ match }) => match),
      dialogs: withLast
        .filter((item): item is typeof item & { last: NonNullable<typeof item.last> } => Boolean(item.last))
        .sort((a, b) => b.last.createdAt - a.last.createdAt),
    }
  }, [matches, conversations])

  if (matches.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emoji}>💞</span>
        <h3>Пока нет мэтчей</h3>
        <p>Лайкайте анкеты — когда симпатия окажется взаимной, человек появится здесь</p>
        <Link to={ROUTES.feed}>
          <Button>К анкетам</Button>
        </Link>
      </div>
    )
  }

  const openChat = (matchId: string) => navigate(ROUTES.chat(matchId))

  return (
    <div className={styles.list}>
      {newMatches.length > 0 && (
        <section>
          <h3 className={styles.heading}>
            Новые мэтчи <span className={styles.count}>{newMatches.length}</span>
          </h3>
          <div className={styles.carousel}>
            {newMatches.map((match) => (
              <NewMatchBubble key={match.id} match={match} onClick={() => openChat(match.id)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className={styles.heading}>Сообщения</h3>
        {dialogs.length === 0 ? (
          <p className={styles.hint}>Напишите кому-нибудь из новых мэтчей — первое сообщение решает многое 😉</p>
        ) : (
          dialogs.map(({ match, last }) => (
            <MatchRow
              key={match.id}
              match={match}
              subtitle={last.author === 'me' ? `Вы: ${last.text}` : last.text}
              highlighted={last.author === 'them'}
              time={formatTime(last.createdAt)}
              onClick={() => openChat(match.id)}
            />
          ))
        )}
      </section>
    </div>
  )
}
