import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Profile } from '@/entities/profile/@x/match'
import { createId } from '@/shared/lib'
import type { Match } from './types'

interface MatchesState {
  items: Match[]
  /** мэтч, для которого нужно показать поздравительную модалку */
  pendingMatchId: string | null
}

const initialState: MatchesState = {
  items: [],
  pendingMatchId: null,
}

export const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    matchCreated: {
      reducer(state, action: PayloadAction<Match>) {
        state.items.unshift(action.payload)
        state.pendingMatchId = action.payload.id
      },
      prepare(profile: Profile) {
        return { payload: { id: createId(), profile, createdAt: Date.now() } }
      },
    },
    pendingMatchCleared(state) {
      state.pendingMatchId = null
    },
    matchRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((match) => match.id !== action.payload)
    },
    matchesReset() {
      return initialState
    },
  },
  selectors: {
    selectMatches: (state) => state.items,
    selectPendingMatch: (state) => state.items.find((match) => match.id === state.pendingMatchId) ?? null,
    selectMatchById: (state, matchId: string) => state.items.find((match) => match.id === matchId) ?? null,
  },
})

export const { matchCreated, pendingMatchCleared, matchRemoved, matchesReset } = matchesSlice.actions
export const { selectMatches, selectPendingMatch, selectMatchById } = matchesSlice.selectors
