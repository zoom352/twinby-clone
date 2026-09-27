import {
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react'
import type { SwipeDirection } from '../../model/types'
import styles from './SwipeableCard.module.css'

const SWIPE_THRESHOLD = 110
const DRAG_START_DISTANCE = 6
const FLY_DURATION = 320

export interface SwipeableCardHandle {
  swipe: (direction: SwipeDirection) => void
}

interface SwipeableCardProps {
  children: ReactNode
  onSwiped: (direction: SwipeDirection) => void
  ref?: Ref<SwipeableCardHandle>
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const getDirection = (x: number, y: number): SwipeDirection | null => {
  if (y < -SWIPE_THRESHOLD && Math.abs(y) > Math.abs(x)) return 'superlike'
  if (x > SWIPE_THRESHOLD) return 'like'
  if (x < -SWIPE_THRESHOLD) return 'dislike'
  return null
}

/** Обёртка, делающая карточку перетаскиваемой (мышь/тач) и «улетающей» по свайпу */
export const SwipeableCard = ({ children, onSwiped, ref }: SwipeableCardProps) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [leaving, setLeaving] = useState<SwipeDirection | null>(null)

  const start = useRef<{ x: number; y: number } | null>(null)
  const moved = useRef(false)
  const leavingRef = useRef(false)

  const fly = (direction: SwipeDirection) => {
    if (leavingRef.current) return
    leavingRef.current = true
    setLeaving(direction)
    setDragging(false)

    const width = window.innerWidth
    const height = window.innerHeight
    setOffset((prev) => {
      switch (direction) {
        case 'like':
          return { x: width, y: prev.y }
        case 'dislike':
          return { x: -width, y: prev.y }
        case 'superlike':
          return { x: prev.x, y: -height }
      }
    })

    setTimeout(() => onSwiped(direction), FLY_DURATION)
  }

  useImperativeHandle(ref, () => ({ swipe: fly }))

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (leavingRef.current || event.button !== 0) return
    start.current = { x: event.clientX, y: event.clientY }
    moved.current = false
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return
    const x = event.clientX - start.current.x
    const y = event.clientY - start.current.y

    if (!moved.current) {
      if (Math.hypot(x, y) < DRAG_START_DISTANCE) return
      // Захватываем указатель только после начала перетаскивания,
      // чтобы обычные клики (листание фото, «подробнее») работали.
      moved.current = true
      setDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    setOffset({ x, y })
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return
    const x = event.clientX - start.current.x
    const y = event.clientY - start.current.y
    start.current = null

    if (!moved.current) return
    setDragging(false)

    const direction = getDirection(x, y)
    if (direction) {
      fly(direction)
    } else {
      setOffset({ x: 0, y: 0 })
    }
  }

  const handlePointerCancel = () => {
    start.current = null
    setDragging(false)
    setOffset({ x: 0, y: 0 })
  }

  const handleClickCapture = (event: MouseEvent) => {
    if (moved.current) {
      event.stopPropagation()
      event.preventDefault()
      moved.current = false
    }
  }

  const isVertical = Math.abs(offset.y) > Math.abs(offset.x)
  const likeOpacity = leaving === 'like' ? 1 : clamp01(offset.x / SWIPE_THRESHOLD)
  const nopeOpacity = leaving === 'dislike' ? 1 : clamp01(-offset.x / SWIPE_THRESHOLD)
  const superOpacity = leaving === 'superlike' ? 1 : isVertical ? clamp01(-offset.y / SWIPE_THRESHOLD) : 0

  return (
    <div
      className={styles.card}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x * 0.06}deg)`,
        transition: dragging ? 'none' : `transform ${FLY_DURATION}ms ease-out`,
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
    >
      {children}
      <span className={`${styles.stamp} ${styles.like}`} style={{ opacity: likeOpacity }}>
        LIKE
      </span>
      <span className={`${styles.stamp} ${styles.nope}`} style={{ opacity: nopeOpacity }}>
        NOPE
      </span>
      <span className={`${styles.stamp} ${styles.super}`} style={{ opacity: superOpacity }}>
        SUPER
      </span>
    </div>
  )
}
