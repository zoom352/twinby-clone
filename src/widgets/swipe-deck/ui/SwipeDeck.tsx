import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchCandidates,
  getCommonInterests,
  getCompatibility,
  ProfileCard,
  selectCandidates,
  selectCandidatesError,
  selectCandidatesLoadedFor,
  selectCandidatesStatus,
  swipeHistoryCleared,
} from '@/entities/profile'
import { selectUser } from '@/entities/user'
import {
  SwipeActions,
  SwipeableCard,
  swipeProfile,
  type SwipeableCardHandle,
  type SwipeDirection,
} from '@/features/swipe-profile'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { Button, InfoIcon, Spinner } from '@/shared/ui'
import styles from './SwipeDeck.module.css'

const KEY_TO_DIRECTION: Record<string, SwipeDirection> = {
  ArrowLeft: 'dislike',
  ArrowRight: 'like',
  ArrowUp: 'superlike',
}

const NO_INTERESTS: string[] = []

export const SwipeDeck = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)
  const candidates = useAppSelector(selectCandidates)
  const status = useAppSelector(selectCandidatesStatus)
  const error = useAppSelector(selectCandidatesError)
  const loadedFor = useAppSelector(selectCandidatesLoadedFor)
  const cardRef = useRef<SwipeableCardHandle>(null)

  const lookingFor = user?.lookingFor ?? 'any'
  const myInterests = user?.interests ?? NO_INTERESTS
  const [top, next] = candidates

  useEffect(() => {
    if (status === 'idle' || loadedFor !== lookingFor) {
      dispatch(fetchCandidates({ lookingFor }))
    }
  }, [dispatch, status, loadedFor, lookingFor])

  useEffect(() => {
    if (!top) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return

      if (event.key === 'i' || event.key === 'и') {
        event.preventDefault()
        navigate(ROUTES.feedProfile(top.id))
        return
      }

      const direction = KEY_TO_DIRECTION[event.key]
      if (!direction) return
      event.preventDefault()
      cardRef.current?.swipe(direction)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, top])

  const handleSwiped = useCallback(
    (direction: SwipeDirection) => {
      if (top) dispatch(swipeProfile({ profile: top, direction }))
    },
    [dispatch, top],
  )

  const pairKey = (profileId: string) => `${user?.id ?? ''}:${profileId}`

  const renderStack = () => {
    if (status === 'loading' && !top) {
      return (
        <div className={styles.placeholder}>
          <Spinner />
          <p>Нейросеть подбирает для вас людей…</p>
        </div>
      )
    }

    if (status === 'failed') {
      return (
        <div className={styles.placeholder}>
          <p>{error}</p>
          <Button onClick={() => dispatch(fetchCandidates({ lookingFor }))}>Повторить</Button>
        </div>
      )
    }

    if (!top) {
      return (
        <div className={styles.placeholder}>
          <span className={styles.emoji}>🔍</span>
          <h3>Анкеты закончились</h3>
          <p>Загляните позже или посмотрите всех ещё раз</p>
          <Button onClick={() => dispatch(swipeHistoryCleared())}>Начать заново</Button>
        </div>
      )
    }

    return (
      <>
        {next && (
          <div className={styles.behind} key={next.id}>
            <ProfileCard profile={next} />
          </div>
        )}
        <SwipeableCard key={top.id} ref={cardRef} onSwiped={handleSwiped}>
          <ProfileCard
            profile={top}
            compatibility={getCompatibility(myInterests, top.interests, pairKey(top.id))}
            commonInterests={getCommonInterests(myInterests, top.interests)}
          />
          <button
            type="button"
            className={styles.details}
            aria-label="Подробнее"
            title="Подробнее об анкете (i)"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => navigate(ROUTES.feedProfile(top.id))}
          >
            <InfoIcon size={24} />
          </button>
        </SwipeableCard>
      </>
    )
  }

  return (
    <div className={styles.deck}>
      <div className={styles.stack}>{renderStack()}</div>
      <SwipeActions onAction={(direction) => cardRef.current?.swipe(direction)} disabled={!top} />
    </div>
  )
}
