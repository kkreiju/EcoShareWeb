"use client"

import { useState, useEffect } from "react"
import { MessagesContainer } from "./messages-container"

// Mock data types (you would replace these with your actual API types)
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

interface MessagesProviderProps {
  currentUserId: string
  children?: React.ReactNode
}

// Mock data - replace with actual API calls
const mockConversations: Conversation[] = [
  {
    id: "1",
    participantId: "user2",
    participantName: "Sarah Johnson",
    participantAvatar: "/images/img_avatar2.png",
    lastMessage: {
      id: "msg1",
      senderId: "user2",
      senderName: "Sarah Johnson",
      content: "Hi! Is the organic tomato listing still available?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: "2",
    participantId: "user3",
    participantName: "Mike Chen",
    participantAvatar: "/images/img_avatar3.png",
    lastMessage: {
      id: "msg2",
      senderId: "current",
      senderName: "You",
      content: "Thanks for the fresh vegetables!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: true,
    },
    unreadCount: 0,
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "msg1-1",
      senderId: "user2",
      senderName: "Sarah Johnson",
      senderAvatar: "/images/img_avatar2.png",
      content: "Hi! Is the organic tomato listing still available?",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
    },
    {
      id: "msg1-2",
      senderId: "user2",
      senderName: "Sarah Johnson",
      senderAvatar: "/images/img_avatar2.png",
      content: "I'm interested in buying 2kg if possible.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
    },
  ],
  "2": [
    {
      id: "msg2-1",
      senderId: "user3",
      senderName: "Mike Chen",
      senderAvatar: "/images/img_avatar3.png",
      content: "The vegetables look great! When can I pick them up?",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "msg2-2",
      senderId: "current",
      senderName: "You",
      content: "You can pick them up tomorrow after 2 PM. I'll be home.",
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "msg2-3",
      senderId: "current",
      senderName: "You",
      content: "Thanks for the fresh vegetables!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
    },
  ],
}

export function MessagesProvider({ currentUserId }: MessagesProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)
  const [loading, setLoading] = useState(false)

  // Simulate loading conversations (replace with actual API call)
  useEffect(() => {
    // fetchConversations()
  }, [])

  const handleSendMessage = async (conversationId: string, content: string) => {
    setLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUserId,
        senderName: "You",
        content,
        timestamp: new Date(),
        isRead: true,
      }

      // Add message to the conversation
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage],
      }))

      // Update conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, lastMessage: newMessage }
            : conv
        )
      )

      // Here you would typically make an API call to send the message
      // await api.sendMessage(conversationId, content)
      
    } catch (error) {
      console.error("Failed to send message:", error)
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MessagesContainer
      conversations={conversations}
      messages={messages}
      currentUserId={currentUserId}
      onSendMessage={handleSendMessage}
      loading={loading}
    />
  )
}

// Simple wrapper component for easy page integration
export function Messages({ currentUserId = "current" }: { currentUserId?: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
      <div className="bg-muted/50 min-h-[80vh] flex-1 rounded-xl p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="flex-1 min-h-0">
          <MessagesProvider currentUserId={currentUserId} />
        </div>
      </div>
    </div>
  )
}
