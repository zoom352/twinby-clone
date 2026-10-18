import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { selectMatchById } from '@/entities/match'
import { MessageBubble, selectIsTyping, selectMessagesByMatch, TypingBubble } from '@/entities/message'
import { Icebreakers, SendMessageForm } from '@/features/send-message'
import { UnmatchButton } from '@/features/unmatch'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
import { ArrowLeftIcon, Avatar } from '@/shared/ui'
import styles from './ChatWindow.module.css'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })

export const ChatWindow = ({ matchId }: { matchId: string }) => {
  const navigate = useNavigate()
  const match = useAppSelector((state) => selectMatchById(state, matchId))
  const messages = useAppSelector((state) => selectMessagesByMatch(state, matchId))
  const isTyping = useAppSelector((state) => selectIsTyping(state, matchId))
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTyping])

  if (!match) return null

  const { profile } = match
  const backToMatches = () => navigate(ROUTES.matches)

  return (
    <div className={styles.window}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={backToMatches} aria-label="Назад">
          <ArrowLeftIcon />
        </button>
        <Link
          to={ROUTES.matchProfile(match.id)}
          className={styles.person}
          aria-label={`Открыть анкету ${profile.name}`}
        >
          <Avatar src={profile.photos[0]} alt={profile.name} size={42} online={profile.online} />
          <div className={styles.personInfo}>
            <span className={styles.name}>
              {profile.name}, {profile.age}
            </span>
            <span className={styles.status}>
              {isTyping ? 'печатает…' : profile.online ? 'онлайн' : 'был(а) недавно'}
            </span>
          </div>
        </Link>
        <UnmatchButton matchId={match.id} name={profile.name} onDone={backToMatches} />
      </header>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.intro}>
            <Avatar src={profile.photos[0]} alt={profile.name} size={96} ring />
            <p className={styles.introText}>
              Мэтч с {profile.name} — {dateFormatter.format(match.createdAt)}.
              <br />
              Не стесняйтесь написать первым!
            </p>
            <Icebreakers matchId={match.id} />
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        {isTyping && <TypingBubble />}
        <div ref={endRef} />
      </div>

      <SendMessageForm matchId={match.id} />
    </div>
  )
}
