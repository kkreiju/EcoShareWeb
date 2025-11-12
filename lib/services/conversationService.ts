import type { Message } from "@/components/features/messages/hooks/use-messages";

// Helper function to parse relative timestamps from API
function parseRelativeTimestamp(timestamp: string): string {
  if (!timestamp) return new Date().toISOString();

  const lowerTimestamp = timestamp.toLowerCase().trim();
  const now = new Date();

  // Handle "now" as current time
  if (lowerTimestamp === 'now') {
    return now.toISOString();
  }

  // Try direct date parsing first (MM/DD/YYYY format, etc.)
  const directDate = new Date(timestamp);
  if (!isNaN(directDate.getTime())) {
    return directDate.toISOString();
  }

  // Handle "X m ago" (minutes ago)
  const minutesMatch = lowerTimestamp.match(/^(\d+)\s*m(?:in(?:ute)?s?)?\s+ago$/);
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1]);
    return new Date(now.getTime() - minutes * 60 * 1000).toISOString();
  }

  // Handle "X h ago" (hours ago)
  const hoursMatch = lowerTimestamp.match(/^(\d+)\s*h(?:ours?)?\s+ago$/);
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1]);
    return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
  }

  // Handle "X d ago" (days ago)
  const daysMatch = lowerTimestamp.match(/^(\d+)\s*d(?:ays?)?\s+ago$/);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  }

  // If nothing matches, return current time
  return now.toISOString();
}

export interface ConversationResponse {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
}

export interface MessageResponse {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  senderName: string;
}

export interface SendMessageRequest {
  conv_id: string;
  user_id: string;
  text: string;
}

export interface SendMessageResponse {
  id: string;
  conv_id: string;
  mess_senderId: string;
  mess_content: string;
  mess_sentAt: string;
}

export interface Conversation extends ConversationResponse {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastTimestamp: string;
  unreadCount?: number;
  messages: {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    status?: "sent" | "delivered" | "read";
  }[];
}

export class ConversationService {
  static async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const response = await fetch(`/api/conversation/get-conversation?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.statusText}`);
      }

      const data: ConversationResponse[] = await response.json();

      // Transform the API response to match our Conversation interface
      const transformedConversations = data.map(conv => ({
        ...conv,
        user: {
          id: conv.id, // Using conversation id as user id for now
          name: conv.name,
          avatar: conv.avatar,
        },
        lastTimestamp: parseRelativeTimestamp(conv.timestamp),
        unreadCount: 0, // Unread count will be added when API supports it
        messages: [], // Messages are fetched separately when conversation is selected
      }));

      // Sort by most recent message (newest first)
      return transformedConversations.sort((a, b) => {
        const timeA = new Date(a.lastTimestamp).getTime();
        const timeB = new Date(b.lastTimestamp).getTime();
        return timeB - timeA;
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  static async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    try {
      const response = await fetch(`/api/conversation/view-message?conv_id=${encodeURIComponent(conversationId)}&user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data: MessageResponse[] = await response.json();

      // Transform the API response to match our Message interface
      // Note: API returns formatted timestamp like "2:30 PM", not ISO format
      // For now, use today's date with the time from API for proper sorting
      return data.map(msg => ({
        id: msg.id,
        senderId: msg.isSent ? userId : 'other', // If isSent is true, it's from current user
        content: msg.text,
        timestamp: msg.timestamp, // Keep the formatted time from API (e.g., "2:30 PM")
        status: msg.isSent ? "sent" : "read", // Assume sent messages are sent, received are read
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  static async sendMessage(conversationId: string, content: string, senderId: string): Promise<SendMessageResponse> {
    try {
      const requestBody: SendMessageRequest = {
        conv_id: conversationId,
        user_id: senderId,
        text: content,
      };

      const response = await fetch('/api/conversation/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data: SendMessageResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

