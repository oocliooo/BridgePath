
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatMessage {
  id: number;
  sender: 'me' | 'them';
  content: string;
  timestamp: Date;
  type?: 'text' | 'proposal' | 'contact';
}

interface ChatConversation {
  id: string;
  targetUser: {
    name: string;
    role: 'student' | 'tutor';
    details: any;
  };
  currentUser: {
    name: string;
    role: 'student' | 'tutor';
    details: any;
  };
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

interface ChatContextType {
  conversations: ChatConversation[];
  addConversation: (conversation: Omit<ChatConversation, 'id' | 'messages' | 'unreadCount'>) => string;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  markAsRead: (conversationId: string) => void;
  getConversation: (conversationId: string) => ChatConversation | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  const addConversation = (conversation: Omit<ChatConversation, 'id' | 'messages' | 'unreadCount'>) => {
    const id = `chat-${Date.now()}`;
    const newConversation: ChatConversation = {
      ...conversation,
      id,
      messages: [],
      unreadCount: 0,
    };
    
    setConversations(prev => [...prev, newConversation]);
    return id;
  };

  const addMessage = (conversationId: string, message: ChatMessage) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message,
        };
        
        if (message.sender === 'them') {
          updatedConv.unreadCount = conv.unreadCount + 1;
        }
        
        return updatedConv;
      }
      return conv;
    }));
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const getConversation = (conversationId: string) => {
    return conversations.find(conv => conv.id === conversationId);
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      addConversation,
      addMessage,
      markAsRead,
      getConversation,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
