// Export all messaging components for easy importing
export { MessageList } from "./message-list"
export { MessageThread } from "./message-thread"
export { MessagesContainer } from "./messages-container"
export { MessagesProvider, Messages } from "./messages-provider"

// Types for external use
export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  isRead: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  lastMessage: Message
  unreadCount: number
}
