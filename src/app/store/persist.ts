import { matchesSlice } from '@/entities/match'
import { messagesSlice } from '@/entities/message'
import { candidatesSlice } from '@/entities/profile'
import type { RootState } from './store'

const STORAGE_KEY = 'twinby-clone:v1'

/** Что сохраняем между перезагрузками (без транзиентных полей вроде статусов загрузки) */
interface PersistedState {
  session: RootState['session']
  matches: RootState['matches']['items']
  conversations: RootState['messages']['byMatchId']
  swipedIds: RootState['candidates']['swipedIds']
}

export const loadState = (): Partial<RootState> | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const data = JSON.parse(raw) as PersistedState

    return {
      session: data.session,
      matches: { ...matchesSlice.getInitialState(), items: data.matches },
      messages: { ...messagesSlice.getInitialState(), byMatchId: data.conversations },
      candidates: { ...candidatesSlice.getInitialState(), swipedIds: data.swipedIds },
    }
  } catch {
    return undefined
  }
}

export const saveState = (state: RootState) => {
  const data: PersistedState = {
    session: state.session,
    matches: state.matches.items,
    conversations: state.messages.byMatchId,
    swipedIds: state.candidates.swipedIds,
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // квота переполнена или приватный режим — просто не сохраняем
  }
}
