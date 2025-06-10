import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Send, User, GraduationCap, DollarSign, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

const ChatModal = ({ isOpen, onClose, targetUser, currentUser }: ChatModalProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: number;
    sender: 'me' | 'them';
    content: string;
    timestamp: Date;
    type?: 'text' | 'proposal' | 'contact';
  }>>([]);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me' as const,
      content: message,
      timestamp: new Date(),
      type: 'text' as const
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // 模拟回复
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'them' as const,
        content: targetUser.role === 'student' 
          ? "Thank you for reaching out! I'm interested in learning more about your tutoring services. When would be a good time to discuss the details?"
          : "Hi! Thanks for your interest. I'd love to hear more about how you can help me with my application. What's your availability like?",
        timestamp: new Date(),
        type: 'text' as const
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const sendBusinessCard = () => {
    let cardContent = '';
    
    if (currentUser.role === 'tutor') {
      const services = currentUser.details.services?.map((service: string) => {
        const serviceMap: Record<string, string> = {
          'college-application': 'College Applications',
          'cv-ps-sop': 'CV/PS/SoP Help',
          'interview-prep': 'Interview Prep',
          'course-tutoring': 'Course Tutoring',
          'academic-consulting': 'Academic Consulting'
        };
        return serviceMap[service] || service;
      }).join(', ') || '';

      cardContent = `Hello! I'm ${currentUser.details.nickname}, a ${currentUser.details.major} student at ${currentUser.details.university}. 

I can help you with: ${services}

My rates vary by service. I'd love to discuss how I can help with your specific needs!`;
    } else {
      cardContent = `Hi! I'm looking for tutoring help. Here are my details:

Age: ${currentUser.details.age}
Current Status: ${currentUser.details.currentYear} at ${currentUser.details.currentUniversity || 'High School'}
Goals: ${currentUser.details.purposes?.join(', ') || 'Academic support'}

I'd love to learn more about your tutoring services!`;
    }

    const businessCard = {
      id: Date.now(),
      sender: 'me' as const,
      content: cardContent,
      timestamp: new Date(),
      type: 'proposal' as const
    };

    setMessages(prev => [...prev, businessCard]);
    
    toast({
      title: "Business card sent!",
      description: "Your information has been shared successfully.",
    });
  };

  const getServiceLabel = (serviceId: string) => {
    const serviceMap: Record<string, string> = {
      'college-application': 'College Applications',
      'cv-ps-sop': 'CV/PS/SoP Help',
      'interview-prep': 'Interview Prep',
      'course-tutoring': 'Course Tutoring',
      'academic-consulting': 'Academic Consulting'
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
                {targetUser.role === 'student' ? 'Student' : 'Tutor'}
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
                  {targetUser.role === 'student' ? 'Student Info' : 'Tutor Profile'}
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
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              <User className="h-4 w-4 mr-2" />
              Send My Info
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
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
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
    </div>
  );
};

export default ChatModal;
