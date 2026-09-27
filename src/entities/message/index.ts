export type { Message, MessageAuthor } from './model/types'
export {
  messagesSlice,
  messageAdded,
  typingChanged,
  conversationRemoved,
  messagesReset,
  selectMessagesByMatch,
  selectLastMessage,
  selectIsTyping,
  selectAllConversations,
} from './model/messagesSlice'
export { MessageBubble, TypingBubble } from './ui/MessageBubble/MessageBubble'
