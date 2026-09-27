import { matchCreated } from '@/entities/match'
import { candidateSwiped, type Profile } from '@/entities/profile'
import { createAppAsyncThunk } from '@/shared/lib/store'
import type { SwipeDirection } from './types'

/** Шанс мэтча при суперлайке, даже если анкета «не лайкала» нас */
const SUPERLIKE_MATCH_CHANCE = 0.5

/**
 * Сценарий свайпа: оркестрирует несколько сущностей
 * (profile → убрать из ленты, match → создать мэтч).
 */
export const swipeProfile = createAppAsyncThunk(
  'swipe/profile',
  async ({ profile, direction }: { profile: Profile; direction: SwipeDirection }, { dispatch }) => {
    dispatch(candidateSwiped(profile.id))

    if (direction === 'dislike') {
      return { matched: false }
    }

    const matched =
      profile.likesYou || (direction === 'superlike' && Math.random() < SUPERLIKE_MATCH_CHANCE)

    if (matched) {
      dispatch(matchCreated(profile))
    }

    return { matched }
  },
)
