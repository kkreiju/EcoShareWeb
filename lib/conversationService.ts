import type { Message } from "@/components/messages/MessagesView";

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
      return data.map(conv => ({
        ...conv,
        user: {
          id: conv.id, // Using conversation id as user id for now
          name: conv.name,
          avatar: conv.avatar,
        },
        lastTimestamp: conv.timestamp,
        unreadCount: 0, // TODO: Add unread count from API
        messages: [], // TODO: Fetch messages separately when conversation is selected
      }));
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
      return data.map(msg => ({
        id: msg.id,
        senderId: msg.isSent ? userId : 'other', // If isSent is true, it's from current user
        content: msg.text,
        timestamp: msg.timestamp, // API returns formatted timestamp like "2:30 PM"
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
