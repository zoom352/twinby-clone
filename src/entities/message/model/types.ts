export type MessageAuthor = 'me' | 'them'

export interface Message {
  id: string
  matchId: string
  author: MessageAuthor
  text: string
  createdAt: number
}
