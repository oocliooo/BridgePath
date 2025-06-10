
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { useChat } from '@/contexts/ChatContext';
import ChatListModal from './ChatListModal';
import ChatModal from './ChatModal';

const FloatingChatButton = () => {
  const { conversations, markAsRead, getConversation } = useChat();
  const [showChatList, setShowChatList] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  const activeConversation = activeChatId ? getConversation(activeChatId) : null;

  const handleSelectChat = (conversationId: string) => {
    setActiveChatId(conversationId);
    markAsRead(conversationId);
  };

  const handleCloseChatModal = () => {
    setActiveChatId(null);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setShowChatList(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
          {totalUnreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat List Modal */}
      <ChatListModal
        isOpen={showChatList}
        onClose={() => setShowChatList(false)}
        onSelectChat={handleSelectChat}
      />

      {/* Active Chat Modal */}
      {activeConversation && (
        <ChatModal
          isOpen={true}
          onClose={handleCloseChatModal}
          targetUser={activeConversation.targetUser}
          currentUser={activeConversation.currentUser}
          conversationId={activeChatId!}
        />
      )}
    </>
  );
};

export default FloatingChatButton;
