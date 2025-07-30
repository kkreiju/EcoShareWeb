"use client"

import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  isRead: boolean
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  lastMessage: Message
  unreadCount: number
}

interface MessageListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onConversationSelect: (conversationId: string) => void
}

export function MessageList({
  conversations,
  selectedConversationId,
  onConversationSelect,
}: MessageListProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold mb-4">Messages</h2>
      {conversations.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No conversations yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start a conversation by messaging other users
          </p>
        </Card>
      ) : (
        conversations.map((conversation) => (
          <Card
            key={conversation.id}
            className={cn(
              "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              selectedConversationId === conversation.id && "bg-muted/80"
            )}
            onClick={() => onConversationSelect(conversation.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <img
                  src={conversation.participantAvatar || "/images/img_avatar1.png"}
                  alt={conversation.participantName}
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium truncate">
                    {conversation.participantName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                        {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                <p
                  className={cn(
                    "text-sm truncate",
                    conversation.lastMessage.isRead
                      ? "text-muted-foreground"
                      : "text-foreground font-medium"
                  )}
                >
                  {conversation.lastMessage.content}
                </p>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
