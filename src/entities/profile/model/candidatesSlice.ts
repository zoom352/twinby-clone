import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LookingFor } from '@/shared/config'
import { createAppAsyncThunk } from '@/shared/lib/store'
import { profileApi } from '../api/profileApi'
import type { Profile } from './types'

interface CandidatesState {
  items: Profile[]
  /** id анкет, которые пользователь уже просмотрел (лайк/дизлайк) */
  swipedIds: string[]
  /** для какого фильтра загружена текущая лента */
  loadedFor: LookingFor | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CandidatesState = {
  items: [],
  swipedIds: [],
  loadedFor: null,
  status: 'idle',
  error: null,
}

export const fetchCandidates = createAppAsyncThunk(
  'candidates/fetch',
  async ({ lookingFor }: { lookingFor: LookingFor }, { rejectWithValue }) => {
    try {
      return await profileApi.getCandidates(lookingFor)
    } catch {
      return rejectWithValue('Не удалось загрузить анкеты')
    }
  },
  {
    condition: (_, { getState }) => getState().candidates.status !== 'loading',
  },
)

export const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    candidateSwiped(state, action: PayloadAction<string>) {
      state.items = state.items.filter((profile) => profile.id !== action.payload)
      if (!state.swipedIds.includes(action.payload)) {
        state.swipedIds.push(action.payload)
      }
    },
    /** Начать ленту заново — вернуть просмотренные анкеты */
    swipeHistoryCleared(state) {
      state.swipedIds = []
      state.status = 'idle'
    },
    candidatesReset() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        state.loadedFor = action.meta.arg.lookingFor
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        const swiped = new Set(state.swipedIds)
        state.status = 'succeeded'
        state.items = action.payload.filter((profile) => !swiped.has(profile.id))
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Неизвестная ошибка'
      })
  },
  selectors: {
    selectCandidates: (state) => state.items,
    selectTopCandidate: (state) => state.items[0],
    selectCandidateById: (state, profileId: string) =>
      state.items.find((profile) => profile.id === profileId),
    selectCandidatesStatus: (state) => state.status,
    selectCandidatesError: (state) => state.error,
    selectCandidatesLoadedFor: (state) => state.loadedFor,
  },
})

export const { candidateSwiped, swipeHistoryCleared, candidatesReset } = candidatesSlice.actions
export const {
  selectCandidates,
  selectTopCandidate,
  selectCandidateById,
  selectCandidatesStatus,
  selectCandidatesError,
  selectCandidatesLoadedFor,
} = candidatesSlice.selectors
