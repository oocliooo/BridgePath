import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Send, User, GraduationCap, DollarSign, MessageCircle, Phone, FolderUp, Video, Monitor, MicOff, VideoOff, MessageCircleMore, Folder, JapaneseYen, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChat } from '@/contexts/ChatContext';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  conversationId?: string;
}

const ChatModal = ({ isOpen, onClose, targetUser, currentUser, conversationId }: ChatModalProps) => {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { addConversation, addMessage, getConversation, markAsRead } = useChat();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showVideoChat, setShowVideoChat] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoCallChat, setVideoCallChat] = useState<string[]>([]);
  const [videoCallChatInput, setVideoCallChatInput] = useState('');
  const [showSharedDocs, setShowSharedDocs] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Get conversation from context
  const conversation = currentConversationId ? getConversation(currentConversationId) : null;
  const messages = conversation?.messages || [];

  useEffect(() => {
    if (isOpen && !currentConversationId) {
      // Create new conversation if it doesn't exist
      const newConversationId = addConversation({
        targetUser,
        currentUser,
      });
      setCurrentConversationId(newConversationId);
    }
  }, [isOpen, currentConversationId, addConversation, targetUser, currentUser]);

  useEffect(() => {
    if (currentConversationId && isOpen) {
      markAsRead(currentConversationId);
    }
  }, [currentConversationId, isOpen, markAsRead]);

  // 获取本地摄像头流
  useEffect(() => {
    if (showVideoCall && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {});
    }
    // 关闭时停止摄像头
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [showVideoCall]);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!message.trim() || !currentConversationId) return;

    // Check if message contains "whatsapp" (case insensitive)
    if (message.toLowerCase().includes('whatsapp')) {
      setShowWarningModal(true);
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: 'me' as const,
      content: message,
      timestamp: new Date(),
      type: 'text' as const
    };

    addMessage(currentConversationId, newMessage);
    setMessage('');

    // 自动回复逻辑：只要学生发消息给mentor就自动回复报价
    if (currentUser.role === 'student' && targetUser.role !== 'student') {
      setTimeout(() => {
        let quote = '';
        let quoteNumber = '';
        if (targetUser.details && targetUser.details.pricing) {
          const prices = Object.values(targetUser.details.pricing);
          if (prices.length > 0) {
            quote = `¥${prices[0]}/hr`;
            quoteNumber = `¥${prices[0]}`;
          }
        }
        const reply = {
          id: Date.now() + 1,
          sender: 'them' as const,
          content: `Yes, of course! I'm happy to help! My quote is: ${quote}. For your case, I think we can have a one-hour chat~ I'll send you a service purchase link later.`,
          timestamp: new Date(),
          type: 'text' as const
        };
        addMessage(currentConversationId, reply);
        // 再自动回复一个订单链接卡片
        setTimeout(() => {
          const orderCard = {
            id: Date.now() + 2,
            sender: 'them' as const,
            content: `I've created an order for you. Please proceed to payment: ${quoteNumber}\n\n[Pay Now]`,
            timestamp: new Date(),
            type: 'proposal' as const
          };
          addMessage(currentConversationId, orderCard);
        }, 800);
      }, 1000);
    }
  };

  const sendBusinessCard = () => {
    if (!currentConversationId) return;

    let cardContent = '';
    
    if (currentUser.role === 'tutor') {
      const services = currentUser.details.services?.map((service: string) => {
        const serviceMap: Record<string, string> = {
          'cv-ps-sop': 'CV/Personal Statement/SoP Help',
          'interview-prep': 'Interview Preparation',
          'major-consulting': 'Major/Career Consulting',
          'application-process': 'Application Process Q&A',
          'campus-life': 'Campus Life Consulting',
          'culture-adaptation': 'Cultural Adaptation & Life Advice',
        };
        return serviceMap[service] || service;
      }).join(', ') || '';

      cardContent = `Hello! I'm ${currentUser.details.nickname}, a ${currentUser.details.major} student at ${currentUser.details.university}. \n\nI can help you with: ${services}\n\nMy rates vary by service. I'd love to discuss how I can help with your specific needs!`;
    } else {
      cardContent = `Hi! I'm looking for mentoring help. Here are my details:\n\nCurrent School: ${currentUser.details.currentSchool}\nTarget Country/Region: ${currentUser.details.targetCountry}\nTarget School: ${currentUser.details.targetSchool}\nEstimated Year for Application: ${currentUser.details.estimatedYear}\nMBTI: ${currentUser.details.mbti}\nIntended Major/Field: ${currentUser.details.intendedMajor}\nNeeds: ${(currentUser.details.purposes || []).map((id: string) => getServiceLabel(id)).join(', ') || 'Academic support'}\n\nI'd love to learn more about your mentoring services!`;
    }

    const businessCard = {
      id: Date.now(),
      sender: 'me' as const,
      content: cardContent,
      timestamp: new Date(),
      type: 'proposal' as const
    };

    addMessage(currentConversationId, businessCard);
    
    toast({
      title: "Business card sent!",
      description: "Your information has been shared successfully.",
    });
  };

  const getServiceLabel = (serviceId: string) => {
    const serviceMap: Record<string, string> = {
      'cv-ps-sop': 'CV/Personal Statement/SoP Help',
      'interview-prep': 'Interview Preparation',
      'major-consulting': 'Major/Career Consulting',
      'application-process': 'Application Process Q&A',
      'campus-life': 'Campus Life Consulting',
      'culture-adaptation': 'Cultural Adaptation & Life Advice',
    };
    return serviceMap[serviceId] || serviceId;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{targetUser.name}</h3>
              <p className="text-sm text-gray-600">
                {targetUser.role === 'student' ? 'Student' : 'Mentor'}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* User Info Sidebar */}
          <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {targetUser.role === 'student' ? 'Student Info' : 'Mentor Profile'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {targetUser.role === 'student' ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm">Request</h4>
                      <p className="text-sm text-gray-600">{targetUser.details.request}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Year</h4>
                      <p className="text-sm text-gray-600">{targetUser.details.year}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Services Needed</h4>
                      <div className="flex flex-wrap gap-1">
                        {targetUser.details.services?.map((service: string) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {getServiceLabel(service)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Budget</h4>
                      <p className="text-sm text-gray-600">{targetUser.details.budget}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Priority</h4>
                      <Badge variant="secondary">{targetUser.details.urgency}</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm">University</h4>
                      <p className="text-sm text-gray-600">{targetUser.details.university}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Major</h4>
                      <p className="text-sm text-gray-600">{targetUser.details.major}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Services</h4>
                      <div className="space-y-1">
                        {targetUser.details.specialties?.map((service: string) => (
                          <Badge key={service} variant="outline" className="text-xs mr-1">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Rating</h4>
                      <p className="text-sm text-gray-600">⭐ {targetUser.details.rating} ({targetUser.details.reviews} reviews)</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button 
              onClick={sendBusinessCard}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 justify-start"
            >
              <User className="h-4 w-4 mr-2" />
              Send My Info
            </Button>
            <Button 
              className="w-full mt-2 bg-green-600 hover:bg-green-700 justify-start"
              onClick={() => setShowVideoCall(true)}
            >
              <Phone className="h-4 w-4 mr-2" />
              Video Call
            </Button>
            <Button 
              className="w-full mt-2 bg-gray-600 hover:bg-gray-700 justify-start"
              onClick={() => setShowSharedDocs(true)}
            >
              <Folder className="h-4 w-4 mr-2" />
              Shared Documents
            </Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Start a conversation!</p>
                  <p className="text-sm">Send a message or share your business card.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'me'
                          ? msg.type === 'proposal'
                            ? 'bg-green-600 text-white border-2 border-green-700'
                            : 'bg-blue-600 text-white'
                          : msg.type === 'proposal'
                            ? 'bg-white border-2 border-blue-400 text-blue-900 shadow'
                            : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">
                        {msg.content.split(/\[Pay Now\]/).map((part, idx, arr) => (
                          <span key={idx}>
                            {part}
                            {idx < arr.length - 1 && (
                              <Button size="sm" className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white ml-2">
                                Pay Now
                              </Button>
                            )}
                          </span>
                        ))}
                      </p>
                      <p className="text-xs mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showVideoCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[90vh] flex flex-col relative overflow-hidden">
            {/* 顶部按钮区 */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <span className="font-semibold text-lg">BridgePath Meeting</span>
              <div className="flex items-center gap-3">
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center gap-2" size="sm"><MicOff className="h-4 w-4" />Mute</Button>
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center gap-2" size="sm"><VideoOff className="h-4 w-4" />Camera Off</Button>
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center gap-2" size="sm"><Monitor className="h-4 w-4" /> Share Screen</Button>
                <Button onClick={() => setShowVideoChat(v => !v)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center gap-2" size="sm"><MessageCircleMore className="h-4 w-4" />Chat</Button>
                <Button onClick={() => setShowVideoCall(false)} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-6 py-2 rounded-md shadow" size="sm"><Video className="h-4 w-4 mr-1" /> Hang Up</Button>
              </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              {/* 视频区 */}
              <div className="flex-1 flex items-center justify-center gap-8 bg-gray-50 transition-all duration-300 ${showVideoChat ? 'pr-0' : 'pr-0'}">
                {/* 学生本地视频 */}
                <div className="relative flex-1 flex flex-col items-center justify-center min-w-0">
                  <div className="w-full max-w-[90%] h-[80%] max-h-[70vh] bg-black rounded-lg overflow-hidden flex items-center justify-center relative aspect-video">
                    <User className="h-32 w-32 text-blue-400 z-10" />
                    <span className="absolute bottom-2 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full">You</span>
                  </div>
                </div>
                {/* Mentor 静态头像 */}
                <div className="relative flex-1 flex flex-col items-center justify-center min-w-0">
                  <div className="w-full max-w-[90%] h-[80%] max-h-[70vh] bg-gray-200 rounded-lg flex items-center justify-center relative aspect-video">
                    <User className="h-32 w-32 text-blue-400" />
                    <span className="absolute bottom-2 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full">{targetUser.role !== 'student' ? targetUser.name : 'Mentor'}</span>
                  </div>
                </div>
              </div>
              {/* 聊天区（可展开/收起） */}
              {showVideoChat && (
                <div className="w-80 h-full border-l bg-white flex flex-col transition-all duration-300">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <span className="font-semibold">Chat</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {videoCallChat.length === 0 ? (
                      <div className="text-gray-400 text-sm text-center mt-8">No messages yet</div>
                    ) : (
                      videoCallChat.map((msg, idx) => (
                        <div key={idx} className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800 w-fit max-w-[90%]">
                          {msg}
                        </div>
                      ))
                    )}
                  </div>
                  <form className="p-3 border-t flex gap-2" onSubmit={e => {e.preventDefault(); if(videoCallChatInput.trim()){ setVideoCallChat(c => [...c, videoCallChatInput]); setVideoCallChatInput('');}}}>
                    <Input
                      value={videoCallChatInput}
                      onChange={e => setVideoCallChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-3"><Send className="h-4 w-4" /></Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSharedDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[90vh] flex flex-col relative overflow-hidden">
            {/* 右上角关闭按钮 */}
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-600" onClick={() => setShowSharedDocs(false)}>
              <X className="h-6 w-6" />
            </button>
            <div className="flex flex-col flex-1 p-8">
              <h2 className="text-2xl font-bold mb-6">Shared Documents</h2>
              <div className="flex-1 overflow-y-auto">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
                    <Folder className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">CV.docx</span>
                  </li>
                  <li className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
                    <Folder className="h-5 w-5 text-green-500" />
                    <span className="font-medium">SoP_essay.docx</span>
                  </li>
                  <li className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
                    <Folder className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Transcript.pdf</span>
                  </li>
                  <li className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
                    <Folder className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Award_Certificate_Letter.pdf</span>
                  </li>
                </ul>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100 transition">
                  <span className="text-lg font-medium mb-2">Select documents or drop documents here</span>
                  <span className="text-sm">(Drag & drop files, or click to select)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal for Off-Platform Transactions */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center gap-3 p-6 border-b">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Warning</h3>
                <p className="text-sm text-gray-600">Off-platform transactions are prohibited</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Directing users to external platforms like WhatsApp for transactions is not allowed. 
                Please keep all communications and transactions within BridgePath to ensure security and compliance.
              </p>
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowWarningModal(false)}
                >
                  I Understand
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModal;
