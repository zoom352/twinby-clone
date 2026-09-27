import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createId } from '@/shared/lib'
import type { Message, MessageAuthor } from './types'

interface MessagesState {
  byMatchId: Record<string, Message[]>
  /** собеседник «печатает…» */
  typing: Record<string, boolean>
}

const initialState: MessagesState = {
  byMatchId: {},
  typing: {},
}

const EMPTY: Message[] = []

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messageAdded: {
      reducer(state, action: PayloadAction<Message>) {
        const { matchId } = action.payload
        ;(state.byMatchId[matchId] ??= []).push(action.payload)
      },
      prepare({ matchId, author, text }: { matchId: string; author: MessageAuthor; text: string }) {
        return { payload: { id: createId(), matchId, author, text, createdAt: Date.now() } }
      },
    },
    typingChanged(state, action: PayloadAction<{ matchId: string; typing: boolean }>) {
      state.typing[action.payload.matchId] = action.payload.typing
    },
    conversationRemoved(state, action: PayloadAction<string>) {
      delete state.byMatchId[action.payload]
      delete state.typing[action.payload]
    },
    messagesReset() {
      return initialState
    },
  },
  selectors: {
    selectMessagesByMatch: (state, matchId: string) => state.byMatchId[matchId] ?? EMPTY,
    selectLastMessage: (state, matchId: string) => state.byMatchId[matchId]?.at(-1) ?? null,
    selectIsTyping: (state, matchId: string) => state.typing[matchId] ?? false,
    selectAllConversations: (state) => state.byMatchId,
  },
})

export const { messageAdded, typingChanged, conversationRemoved, messagesReset } = messagesSlice.actions
export const { selectMessagesByMatch, selectLastMessage, selectIsTyping, selectAllConversations } =
  messagesSlice.selectors
