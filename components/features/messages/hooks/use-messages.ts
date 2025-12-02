"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ConversationService, Conversation } from "@/lib/services/conversationService";
import { createClient } from "@/lib/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string; // ISO
  status?: "sent" | "delivered" | "read" | "sending";
}

interface UseMessagesReturn {
  conversations: Conversation[];
  activeId: string | null;
  activeConversation: Conversation | null;
  filtered: Conversation[];
  loading: boolean;
  error: string | null;
  messagesLoading: boolean;
  messagesError: string | null;
  sendingMessage: boolean;
  sendError: string | null;
  query: string;
  currentUserId: string;
  setActiveId: (id: string | null) => void;
  setQuery: (query: string) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string, showLoading?: boolean) => Promise<void>;
  handleSend: (text: string) => Promise<void>;
}

/**
 * Custom hook for managing messages and conversations
 */
export function useMessages(userId: string, isAuthenticated: boolean): UseMessagesReturn {
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Stabilize current user id so it never flips to empty during visibility/auth rechecks
  const [stableUserId, setStableUserId] = useState<string>("");
  useEffect(() => {
    if (userId && !stableUserId) {
      setStableUserId(userId);
    }
  }, [userId, stableUserId]);

  // Use the first known user id for alignment and API calls
  const currentUserId = stableUserId || userId || "";

  // Fetch conversations when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      fetchConversations();
    }
  }, [isAuthenticated, currentUserId]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeId && currentUserId) {
      fetchMessages(activeId);
    }
  }, [activeId, currentUserId]);

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await ConversationService.getConversations(currentUserId);
      setConversations(data);
      if (data.length > 0 && !activeId) {
        setActiveId(data[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations"
      );
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, activeId]);

  const fetchMessages = useCallback(async (conversationId: string, showLoading = true) => {
    if (!currentUserId) return;

    if (showLoading) {
      setMessagesLoading(true);
    }
    setMessagesError(null);
    try {
      const messages = await ConversationService.getMessages(
        conversationId,
        currentUserId
      );

      // Update the conversation with the fetched messages
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return { ...c, messages };
          }
          return c;
        })
      );
    } catch (err) {
      setMessagesError(
        err instanceof Error ? err.message : "Failed to load messages"
      );
      console.error("Error fetching messages:", err);
    } finally {
      if (showLoading) {
        setMessagesLoading(false);
      }
    }
  }, [currentUserId]);

  // Use a ref to access the latest fetchConversations without triggering re-renders
  const fetchConversationsRef = useRef(fetchConversations);
  useEffect(() => {
    fetchConversationsRef.current = fetchConversations;
  }, [fetchConversations]);

  // Real-time subscription
  useEffect(() => {
    if (!currentUserId) return;

    const supabase = createClient();
    const channelName = `messages-${currentUserId}`; // Removed Date.now() to keep channel stable
    console.log("Setting up real-time subscription:", channelName);

    // Subscribe to new messages
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log("Real-time event received:", payload);
          const newMessage = payload.new as any;

          // Only process if it belongs to one of our conversations
          setConversations((prev) => {
            // Find which conversation this message belongs to
            const conversationIndex = prev.findIndex(c => c.id === newMessage.conv_id);

            if (conversationIndex === -1) {
              console.log("Conversation not found, fetching conversations...");
              fetchConversationsRef.current(); // Use ref here
              return prev;
            }

            const updatedConversations = [...prev];
            const conversation = updatedConversations[conversationIndex];

            // Check if message already exists (deduplication)
            if (conversation.messages.some(m => m.id === newMessage.id)) {
              console.log("Message already exists, skipping:", newMessage.id);
              return prev;
            }

            // Format timestamp to match API format (e.g., "2:30 PM")
            const formatTime = (isoString: string) => {
              const date = new Date(isoString);
              return date.toLocaleTimeString('en-US', {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
            };

            // Transform raw DB message to our Message interface
            const formattedMessage: Message = {
              id: newMessage.id,
              senderId: newMessage.mess_senderId,
              content: newMessage.mess_content,
              timestamp: formatTime(newMessage.mess_sentAt || new Date().toISOString()),
              status: newMessage.mess_senderId === currentUserId ? 'sent' : 'read'
            };

            console.log("Adding new message to conversation:", formattedMessage);

            // Add message to conversation
            const updatedConversation = {
              ...conversation,
              messages: [...conversation.messages, formattedMessage],
              lastMessage: formattedMessage.content,
              lastTimestamp: formattedMessage.timestamp,
            };

            updatedConversations[conversationIndex] = updatedConversation;

            // Move updated conversation to top
            updatedConversations.sort((a, b) => {
              const timeA = new Date(a.lastTimestamp).getTime();
              const timeB = new Date(b.lastTimestamp).getTime();
              return timeB - timeA;
            });

            return updatedConversations;
          });
        }
      )
      .subscribe((status: string) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up subscription:", channelName);
      supabase.removeChannel(channel);
    };
  }, [currentUserId]); // Removed fetchConversations from dependencies

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.user.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, query]);

  const handleSend = useCallback(async (text: string) => {
    if (!activeConversation || !currentUserId || sendingMessage) return;

    setSendingMessage(true);
    setSendError(null);

    // Optimistically add message to UI with truly unique temporary ID
    const tempId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`;

    // Format timestamp to match API format (e.g., "2:30 PM")
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const optimisticMsg: Message = {
      id: tempId,
      senderId: currentUserId,
      content: text,
      timestamp: formattedTime,
      status: "sending",
    };

    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== activeConversation.id) return c;
        const updatedConv = { ...c };
        updatedConv.messages = [...c.messages, optimisticMsg];
        updatedConv.lastMessage = text;
        updatedConv.lastTimestamp = new Date().toISOString();
        return updatedConv;
      });

      // Sort conversations by most recent (move current conversation to top)
      return updated.sort((a, b) => {
        const timeA = new Date(a.lastTimestamp).getTime();
        const timeB = new Date(b.lastTimestamp).getTime();
        return timeB - timeA;
      });
    });

    try {
      await ConversationService.sendMessage(
        activeConversation.id,
        text,
        currentUserId
      );

      // Remove temporary message - the real one will come from the next fetch
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== activeConversation.id) return c;
          const updatedConv = { ...c };
          updatedConv.messages = c.messages.filter((msg) => msg.id !== tempId);
          return updatedConv;
        });

        // Sort conversations by most recent (move current conversation to top)
        return updated.sort((a, b) => {
          const timeA = new Date(a.lastTimestamp).getTime();
          const timeB = new Date(b.lastTimestamp).getTime();
          return timeB - timeA;
        });
      });

      // Fetch messages to get the real message from the server (without showing skeleton)
      await fetchMessages(activeConversation.id, false);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Failed to send message"
      );
      console.error("Error sending message:", err);

      // Remove optimistic message on failure
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversation.id) return c;
          const updated = { ...c };
          updated.messages = c.messages.filter((msg) => msg.id !== tempId);
          return updated;
        })
      );
    } finally {
      setSendingMessage(false);
    }
  }, [activeConversation, currentUserId, sendingMessage, fetchMessages]);

  return {
    conversations,
    activeId,
    activeConversation,
    filtered,
    loading,
    error,
    messagesLoading,
    messagesError,
    sendingMessage,
    sendError,
    query,
    currentUserId,
    setActiveId,
    setQuery,
    fetchConversations,
    fetchMessages,
    handleSend,
  };
}
