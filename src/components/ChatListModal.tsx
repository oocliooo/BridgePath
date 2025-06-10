
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, User, MessageCircle } from "lucide-react";
import { useChat } from '@/contexts/ChatContext';

interface ChatListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (conversationId: string) => void;
}

const ChatListModal = ({ isOpen, onClose, onSelectChat }: ChatListModalProps) => {
  const { conversations } = useChat();

  if (!isOpen) return null;

  const formatLastMessageTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="h-12 w-12 mb-4 text-gray-400" />
              <p>No conversations yet</p>
              <p className="text-sm">Start chatting with tutors or students!</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conversation) => (
                <Card 
                  key={conversation.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    onSelectChat(conversation.id);
                    onClose();
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">
                            {conversation.targetUser.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatLastMessageTime(conversation.lastMessage.timestamp)}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          {conversation.targetUser.role === 'student' ? 'Student' : 'Tutor'}
                        </p>
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {conversation.lastMessage.sender === 'me' ? 'You: ' : ''}
                            {conversation.lastMessage.content.length > 30 
                              ? conversation.lastMessage.content.substring(0, 30) + '...'
                              : conversation.lastMessage.content
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListModal;
