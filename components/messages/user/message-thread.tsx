"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Send, ArrowLeft } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  isRead: boolean
}

interface MessageThreadProps {
  conversationId: string
  participantName: string
  participantAvatar?: string
  messages: Message[]
  currentUserId: string
  onSendMessage: (content: string) => void
  onBack?: () => void
  loading?: boolean
}

export function MessageThread({
  conversationId,
  participantName,
  participantAvatar,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  loading = false,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (newMessage.trim() && !loading) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const messageDate = new Date(date)
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today"
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }
    
    return messageDate.toLocaleDateString()
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, Message[]>)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Card className="p-4 rounded-b-none border-b">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1 h-auto"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <img
              src={participantAvatar || "/images/img_avatar1.png"}
              alt={participantName}
              className="h-full w-full object-cover"
            />
          </Avatar>
          <div>
            <h3 className="font-medium">{participantName}</h3>
            <p className="text-sm text-muted-foreground">
              {messages.length > 0 ? "Active" : "No messages yet"}
            </p>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Send a message to start the conversation</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 border-t border-muted"></div>
                <span className="text-xs text-muted-foreground bg-background px-2">
                  {date}
                </span>
                <div className="flex-1 border-t border-muted"></div>
              </div>

              {/* Messages for this date */}
              {dayMessages.map((message, index) => {
                const isOwnMessage = message.senderId === currentUserId
                const showAvatar = !isOwnMessage && (
                  index === 0 || 
                  dayMessages[index - 1].senderId !== message.senderId
                )

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 mb-2",
                      isOwnMessage ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isOwnMessage && (
                      <Avatar className={cn("h-8 w-8", !showAvatar && "invisible")}>
                        <img
                          src={message.senderAvatar || "/images/img_avatar1.png"}
                          alt={message.senderName}
                          className="h-full w-full object-cover"
                        />
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2",
                        isOwnMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          isOwnMessage
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <Card className="p-4 rounded-t-none border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || loading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
