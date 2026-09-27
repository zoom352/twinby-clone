import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { matchesSlice } from '@/entities/match'
import { messagesSlice } from '@/entities/message'
import { candidatesSlice } from '@/entities/profile'
import { sessionSlice } from '@/entities/user'
import { throttle } from '@/shared/lib'
import { loadState, saveState } from './persist'

const rootReducer = combineSlices(sessionSlice, candidatesSlice, matchesSlice, messagesSlice)

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
})

store.subscribe(throttle(() => saveState(store.getState()), 500))

export type AppDispatch = typeof store.dispatch
