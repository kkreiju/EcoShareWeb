"use client"

import { useState } from "react"
import { MessageList } from "./message-list"
import { MessageThread } from "./message-thread"
import { Card } from "@/components/ui/card"

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

interface MessagesContainerProps {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  currentUserId: string
  onSendMessage: (conversationId: string, content: string) => Promise<void>
  loading?: boolean
}

export function MessagesContainer({
  conversations,
  messages,
  currentUserId,
  onSendMessage,
  loading = false,
}: MessagesContainerProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string>()

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  )

  const handleSendMessage = async (content: string) => {
    if (selectedConversationId) {
      await onSendMessage(selectedConversationId, content)
    }
  }

  return (
    <div className="flex flex-1 gap-4 h-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex gap-4 w-full h-full">
        {/* Conversations List */}
        <Card className="w-80 p-4 flex-shrink-0">
          <MessageList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onConversationSelect={setSelectedConversationId}
          />
        </Card>

        {/* Message Thread */}
        <Card className="flex-1 p-0">
          {selectedConversation ? (
            <MessageThread
              conversationId={selectedConversation.id}
              participantName={selectedConversation.participantName}
              participantAvatar={selectedConversation.participantAvatar}
              messages={messages[selectedConversation.id] || []}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full h-full">
        <Card className="h-full p-0">
          {selectedConversation ? (
            <MessageThread
              conversationId={selectedConversation.id}
              participantName={selectedConversation.participantName}
              participantAvatar={selectedConversation.participantAvatar}
              messages={messages[selectedConversation.id] || []}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              onBack={() => setSelectedConversationId(undefined)}
              loading={loading}
            />
          ) : (
            <div className="p-4 h-full">
              <MessageList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onConversationSelect={setSelectedConversationId}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
