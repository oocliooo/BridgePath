import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, User, DollarSign, MessageCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChat } from '@/contexts/ChatContext';
import ChatModal from './ChatModal';

interface TutorDashboardProps {
  tutorData: any;
  onBack: () => void;
}

const TutorDashboard = ({ tutorData, onBack }: TutorDashboardProps) => {
  const { toast } = useToast();
  const { addConversation } = useChat();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

  // Mock student requests
  const studentRequests = [
    {
      id: 1,
      studentInitial: 'J',
      year: 'Junior',
      request: 'Need help with college application essays for Ivy League schools',
      services: ['college-application', 'cv-ps-sop'],
      urgency: 'High',
      budget: '$50-60/hr',
      location: 'Beijing',
      currentSchool: 'Beijing No. 4 High School',
      targetCountry: 'USA',
      targetSchool: 'Harvard University',
      estimatedYear: '2024',
      mbti: 'ENFP',
      intendedMajor: 'Computer Science',
      purposes: ['cv-ps-sop']
    },
    {
      id: 2,
      studentInitial: 'M',
      year: 'Senior',
      request: 'Looking for computer science course tutoring',
      services: ['course-tutoring'],
      urgency: 'Medium',
      budget: '$40-50/hr',
      location: 'Shanghai',
      currentSchool: 'Shanghai No. 5 High School',
      targetCountry: 'Canada',
      targetSchool: 'University of Toronto',
      estimatedYear: '2023',
      mbti: 'ISTJ',
      intendedMajor: 'Computer Science',
      purposes: ['major-consulting']
    },
    {
      id: 3,
      studentInitial: 'S',
      year: 'Sophomore',
      request: 'Interview preparation for graduate school',
      services: ['interview-prep'],
      urgency: 'Low',
      budget: '$45-55/hr',
      location: 'Guangzhou',
      currentSchool: 'Guangzhou No. 7 High School',
      targetCountry: 'UK',
      targetSchool: 'University of Oxford',
      estimatedYear: '2025',
      mbti: 'ESFP',
      intendedMajor: 'Economics',
      purposes: ['interview-prep']
    }
  ];

  const handleSendProposal = (studentId: number) => {
    const student = studentRequests.find(s => s.id === studentId);
    setSelectedStudent(student);
    setShowChat(true);
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">BridgePath</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome back,</span>
              <span className="font-medium">{tutorData.nickname}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Mentor Profile Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Your Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Personal Info</h3>
                  <p className="text-sm text-gray-600">Name: {tutorData.nickname}</p>
                  <p className="text-sm text-gray-600">Province of Gaokao: {tutorData.provinceOfGaokao}</p>
                  <p className="text-sm text-gray-600">High School Graduated From: {tutorData.highSchoolGraduatedFrom}</p>
                  <p className="text-sm text-gray-600">University: {tutorData.university}</p>
                  <p className="text-sm text-gray-600">Education Level: {tutorData.educationLevel}</p>
                  <p className="text-sm text-gray-600">Year of Study: {tutorData.yearOfStudy}</p>
                  <p className="text-sm text-gray-600">Department: {tutorData.department}</p>
                  <p className="text-sm text-gray-600">Major: {tutorData.major}</p>
                  <p className="text-sm text-gray-600">MBTI: {tutorData.mbti}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Services Offered</h3>
                  <div className="space-y-1">
                    {['cv-ps-sop','interview-prep','major-consulting','application-process','campus-life','culture-adaptation'].filter(serviceId => tutorData.services.includes(serviceId)).map((serviceId) => (
                      <Badge key={serviceId} variant="secondary" className="text-xs">
                        {({
                          'cv-ps-sop': 'CV/Personal Statement/SoP Help',
                          'interview-prep': 'Interview Preparation',
                          'major-consulting': 'Major/Career Consulting',
                          'application-process': 'Application Process Q&A',
                          'campus-life': 'Campus Life Consulting',
                          'culture-adaptation': 'Cultural Adaptation & Life Advice',
                        } as Record<string, string>)[serviceId]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Pricing</h3>
                  <div className="space-y-1">
                    {['cv-ps-sop','interview-prep','major-consulting','application-process','campus-life','culture-adaptation'].filter(serviceId => tutorData.services.includes(serviceId)).map((serviceId) => (
                      <div key={serviceId} className="flex justify-between text-sm">
                        <span className="text-gray-600">{({
                          'cv-ps-sop': 'CV/Personal Statement/SoP Help',
                          'interview-prep': 'Interview Preparation',
                          'major-consulting': 'Major/Career Consulting',
                          'application-process': 'Application Process Q&A',
                          'campus-life': 'Campus Life Consulting',
                          'culture-adaptation': 'Cultural Adaptation & Life Advice',
                        } as Record<string, string>)[serviceId]}:</span>
                        <span className="font-medium">¥{tutorData.pricing[serviceId]}/hr</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Requests */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Student Requests</h2>
            <div className="grid gap-6">
              {studentRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{request.studentInitial}</span>
                        </div>
                        <span>Student {request.studentInitial}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency} Priority
                        </Badge>
                        <Badge variant="outline">{request.budget}</Badge>
                      </div>
                    </div>
                    <CardDescription>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p className="text-sm text-gray-600">Location: {request.location}</p>
                        <p className="text-sm text-gray-600">Current School: {request.currentSchool}</p>
                        <p className="text-sm text-gray-600">Target Country: {request.targetCountry}</p>
                        <p className="text-sm text-gray-600">Target School: {request.targetSchool}</p>
                        <p className="text-sm text-gray-600">Estimated Year: {request.estimatedYear}</p>
                        <p className="text-sm text-gray-600">MBTI: {request.mbti}</p>
                        <p className="text-sm text-gray-600">Intended Major: {request.intendedMajor}</p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Needs Help With:</span>
                        {(request.purposes || []).map((purpose: string) => (
                          <Badge key={purpose} variant="outline" className="text-xs">
                            {getServiceLabel(purpose)}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        onClick={() => handleSendProposal(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Proposal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proposals Sent</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">2 pending responses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">Based on 12 reviews</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showChat && selectedStudent && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          targetUser={{
            name: `Student ${selectedStudent.studentInitial}`,
            role: 'student',
            details: selectedStudent
          }}
          currentUser={{
            name: tutorData.nickname,
            role: 'tutor',
            details: tutorData
          }}
        />
      )}
    </div>
  );
};

export default TutorDashboard;
