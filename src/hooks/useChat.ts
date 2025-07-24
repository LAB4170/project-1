import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Conversation = Database['public']['Tables']['chat_conversations']['Row'];
type Message = Database['public']['Tables']['chat_messages']['Row'];

interface ConversationWithMessages extends Conversation {
  messages: Message[];
  unreadCount: number;
}

export const useChat = () => {
  const [conversations, setConversations] = useState<ConversationWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Fetch conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Fetch messages for each conversation
      const conversationsWithMessages = await Promise.all(
        (conversationsData || []).map(async (conversation) => {
          const { data: messagesData, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: true });

          if (messagesError) throw messagesError;

          const unreadCount = messagesData?.filter(m => 
            m.sender_type === 'customer' && !m.is_read
          ).length || 0;

          return {
            ...conversation,
            messages: messagesData || [],
            unreadCount
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Mock data for demo
      const mockConversations: ConversationWithMessages[] = [
        {
          id: '1',
          customer_name: 'Sarah Wilson',
          customer_email: 'sarah@example.com',
          customer_phone: '+254711234567',
          subject: 'Toyota Land Cruiser Inquiry',
          status: 'active',
          priority: 'high',
          assigned_admin: 'Admin',
          last_message_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: '1',
              conversation_id: '1',
              sender_type: 'customer',
              sender_name: 'Sarah Wilson',
              message_text: 'Hi, I\'m interested in the Toyota Land Cruiser. Can you provide more details about the import process?',
              message_type: 'text',
              is_read: false,
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            }
          ],
          unreadCount: 1
        }
      ];
      setConversations(mockConversations);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (conversationData: Database['public']['Tables']['chat_conversations']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([conversationData])
        .select()
        .single();

      if (error) throw error;
      
      const newConversation: ConversationWithMessages = {
        ...data,
        messages: [],
        unreadCount: 0
      };
      
      setConversations(prev => [newConversation, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create conversation');
    }
  };

  const sendMessage = async (messageData: Database['public']['Tables']['chat_messages']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setConversations(prev => prev.map(conv => {
        if (conv.id === messageData.conversation_id) {
          return {
            ...conv,
            messages: [...conv.messages, data],
            last_message_at: data.created_at,
            unreadCount: messageData.sender_type === 'customer' ? conv.unreadCount + 1 : conv.unreadCount
          };
        }
        return conv;
      }));
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to send message');
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'customer');

      if (error) throw error;
      
      // Update local state
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map(msg => ({ ...msg, is_read: true })),
            unreadCount: 0
          };
        }
        return conv;
      }));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to mark messages as read');
    }
  };

  const updateConversationStatus = async (id: string, status: 'active' | 'closed' | 'pending') => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setConversations(prev => prev.map(conv => 
        conv.id === id ? { ...conv, status: data.status } : conv
      ));
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update conversation');
    }
  };

  useEffect(() => {
    fetchConversations();

    // Set up real-time subscriptions
    const conversationsSubscription = supabase
      .channel('conversations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'chat_conversations' },
        () => {
          fetchConversations(); // Refetch to get updated data
        }
      )
      .subscribe();

    const messagesSubscription = supabase
      .channel('messages_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          setConversations(prev => prev.map(conv => {
            if (conv.id === newMessage.conversation_id) {
              return {
                ...conv,
                messages: [...conv.messages, newMessage],
                last_message_at: newMessage.created_at,
                unreadCount: newMessage.sender_type === 'customer' ? conv.unreadCount + 1 : conv.unreadCount
              };
            }
            return conv;
          }));
        }
      )
      .subscribe();

    return () => {
      conversationsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, []);

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  return {
    conversations,
    loading,
    error,
    totalUnreadCount,
    fetchConversations,
    createConversation,
    sendMessage,
    markMessagesAsRead,
    updateConversationStatus,
  };
};