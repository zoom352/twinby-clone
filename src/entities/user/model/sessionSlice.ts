import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from './types'

interface SessionState {
  user: User | null
}

const initialState: SessionState = {
  user: null,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loggedIn(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    loggedOut() {
      return initialState
    },
    profileUpdated(state, action: PayloadAction<Partial<Omit<User, 'id'>>>) {
      if (state.user) {
        Object.assign(state.user, action.payload)
      }
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuth: (state) => state.user !== null,
  },
})

export const { loggedIn, loggedOut, profileUpdated } = sessionSlice.actions
export const { selectUser, selectIsAuth } = sessionSlice.selectors
