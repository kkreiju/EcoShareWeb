"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface MessageData {
  id: string;
  content: string;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  message_type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read";
  reply_to_id?: string;
}

export interface ConversationData {
  id: string;
  user_id: string;
  other_user_id: string;
  created_at: string;
  updated_at: string;
  last_message?: MessageData;
  unread_count: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  is_online: boolean;
  last_seen?: string;
}

export function useMessaging(currentUserId: string) {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: MessageData[] }>({});
  const [users, setUsers] = useState<{ [userId: string]: UserProfile }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages:messages(*)
        `)
        .or(`user_id.eq.${currentUserId},other_user_id.eq.${currentUserId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Process conversations to get the format we need
      const processedConversations = data?.map(conv => ({
        ...conv,
        last_message: conv.messages?.[conv.messages.length - 1],
        unread_count: conv.messages?.filter((msg: MessageData) => 
          msg.sender_id !== currentUserId && msg.status !== 'read'
        ).length || 0,
      })) || [];

      setConversations(processedConversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    }
  }, [currentUserId, supabase]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(prev => ({
        ...prev,
        [conversationId]: data || [],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    }
  }, [supabase]);

  // Fetch user profiles
  const fetchUserProfiles = useCallback(async (userIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, is_online, last_seen')
        .in('id', userIds);

      if (error) throw error;

      const userMap = data?.reduce((acc, user) => ({
        ...acc,
        [user.id]: user,
      }), {}) || {};

      setUsers(prev => ({ ...prev, ...userMap }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profiles');
    }
  }, [supabase]);

  // Send a message
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    messageType: "text" | "image" | "file" = "text",
    replyToId?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content,
          message_type: messageType,
          reply_to_id: replyToId,
          status: 'sent',
        })
        .select()
        .single();

      if (error) throw error;

      // Add message to local state
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), data],
      }));

      // Update conversation's updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [currentUserId, supabase]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (conversationId: string, messageIds: string[]) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'read' })
        .in('id', messageIds)
        .neq('sender_id', currentUserId);

      if (error) throw error;

      // Update local state
      setMessages(prev => ({
        ...prev,
        [conversationId]: prev[conversationId]?.map(msg =>
          messageIds.includes(msg.id) ? { ...msg, status: 'read' } : msg
        ) || [],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark messages as read');
    }
  }, [currentUserId, supabase]);

  // Create or get conversation
  const getOrCreateConversation = useCallback(async (otherUserId: string) => {
    try {
      // First, try to find existing conversation
      const { data: existing, error: findError } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(user_id.eq.${currentUserId},other_user_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},other_user_id.eq.${currentUserId})`)
        .maybeSingle();

      if (findError) throw findError;

      if (existing) {
        return existing;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          user_id: currentUserId,
          other_user_id: otherUserId,
        })
        .select()
        .single();

      if (createError) throw createError;

      return newConv;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
      throw err;
    }
  }, [currentUserId, supabase]);

  // Set up real-time subscriptions
  useEffect(() => {
    const messageChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const message = payload.new as MessageData;
          if (message && message.conversation_id) {
            setMessages(prev => ({
              ...prev,
              [message.conversation_id]: [...(prev[message.conversation_id] || []), message],
            }));
          }
        }
      )
      .subscribe();

    const conversationChannel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(conversationChannel);
    };
  }, [fetchConversations, supabase]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchConversations();
      setLoading(false);
    };

    loadData();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    users,
    loading,
    error,
    fetchMessages,
    fetchUserProfiles,
    sendMessage,
    markMessagesAsRead,
    getOrCreateConversation,
  };
}
