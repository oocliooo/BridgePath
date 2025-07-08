import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, User, Star, MessageCircle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChat } from '@/contexts/ChatContext';
import ChatModal from './ChatModal';

interface StudentDashboardProps {
  studentData: any;
  onBack: () => void;
}

const StudentDashboard = ({ studentData, onBack }: StudentDashboardProps) => {
  const { toast } = useToast();
  const { addConversation } = useChat();
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

  // Mock tutor recommendations
  const recommendedMentors = [
    {
      id: 1,
      name: 'Chloe Y.',
      title: 'HKUST Undergraduate Student',
      major: 'Biotechnology and Business',
      university: 'The Hong Kong University of Science and Technology',
      rating: 4.9,
      reviews: 24,
      specialties: [
        'CV/Personal Statement/SoP Help',
        'Interview Preparation',
        'Major/Career Consulting',
      ],
      pricing: {
        'cv-ps-sop': 500,
        'interview-prep': 600,
        'major-consulting': 400,
      },
      description: 'Experienced in helping students with all aspects of the study abroad process.',
      matchScore: 95
    },
    {
      id: 2,
      name: 'Clio L.',
      title: 'HKUST Undergraduate Student',
      major: 'Computer Science',
      university: 'The Hong Kong University of Science and Technology',
      rating: 4.8,
      reviews: 18,
      specialties: [
        'CV/Personal Statement/SoP Help',
        'Campus Life Consulting',
        'Cultural Adaptation & Life Advice',
      ],
      pricing: {
        'cv-ps-sop': 550,
        'campus-life': 300,
        'culture-adaptation': 200,
      },
      description: 'PhD student with a passion for mentoring international students.',
      matchScore: 88
    },
    {
      id: 3,
      name: 'Sunny',
      title: 'Stanford Graduate',
      major: 'Business',
      university: 'Stanford University',
      rating: 4.7,
      reviews: 31,
      specialties: [
        'Application Process Q&A',
        'CV/Personal Statement/SoP Help',
      ],
      pricing: {
        'application-process': 400,
        'cv-ps-sop': 350,
      },
      description: 'Former admissions committee member. Expertise in all-around study abroad support.',
      matchScore: 82
    }
  ];

  const handleContact = (tutorId: number) => {
    const tutor = recommendedMentors.find(t => t.id === tutorId);
    setSelectedTutor(tutor);
    setShowChat(true);
  };

  const getPurposeLabel = (purposeId: string) => {
    const purposeMap: Record<string, string> = {
      'cv-ps-sop': 'CV/Personal Statement/SoP Help',
      'interview-prep': 'Interview Preparation',
      'major-consulting': 'Major/Career Consulting',
      'application-process': 'Application Process Q&A',
      'campus-life': 'Campus Life Consulting',
      'culture-adaptation': 'Cultural Adaptation & Life Advice',
    };
    return purposeMap[purposeId] || purposeId;
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
              <div className="flex flex-col items-start space-y-1">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">BridgePath</h1>
                </div>
                <span className="text-sm text-gray-600">Welcome, Student</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Student Profile Summary */}
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
                  <h3 className="font-medium text-gray-900 mb-2">Basic Info</h3>
                  <p className="text-sm text-gray-600">Location: {studentData.location}</p>
                  <p className="text-sm text-gray-600">Current School: {studentData.currentSchool}</p>
                  <p className="text-sm text-gray-600">Target Country/Region: {studentData.targetCountry}</p>
                  <p className="text-sm text-gray-600">Target School: {studentData.targetSchool}</p>
                  <p className="text-sm text-gray-600">Estimated Year for Application: {studentData.estimatedYear}</p>
                  <p className="text-sm text-gray-600">MBTI: {studentData.mbti}</p>
                  <p className="text-sm text-gray-600">Intended Major/Field: {studentData.intendedMajor}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Needs Help With</h3>
                  <div className="space-y-1">
                    {studentData.purposes && studentData.purposes.length > 0 ? (
                      studentData.purposes.map((purpose: string) => (
                        <Badge key={purpose} variant="secondary" className="text-xs mr-1">
                          {purpose}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No selection</span>
                    )}
                  </div>
                </div>
                {studentData.targetUniversity && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Application Goals</h3>
                    <p className="text-sm text-gray-600">Target: {studentData.targetUniversity}</p>
                    <p className="text-sm text-gray-600">Level: {studentData.applicationLevel}</p>
                    <p className="text-sm text-gray-600">Entry: {studentData.targetEntry}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Tutors */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Mentors for You</h2>
            <div className="grid gap-6">
              {recommendedMentors.map((tutor) => (
                <Card key={tutor.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{
                              (() => {
                                const names = tutor.name.split(' ');
                                if (names.length === 1) return names[0][0]?.toUpperCase() || '';
                                return (names[0][0] + (names[1][0] || '')).toUpperCase();
                              })()
                            }</span>
                          </div>
                          <div>
                            <span>{tutor.name}</span>
                            <p className="text-sm text-gray-600 font-normal">{tutor.title}</p>
                          </div>
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{tutor.rating}</span>
                            <span className="text-sm text-gray-600">({tutor.reviews} reviews)</span>
                          </div>
                          <Badge className={getMatchColor(tutor.matchScore)}>
                            {tutor.matchScore}% match
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-3">{tutor.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">University</h4>
                        <p className="text-sm text-gray-600">{tutor.university}</p>
                        <p className="text-sm text-gray-600">{tutor.major}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {tutor.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Pricing</h4>
                        <div className="space-y-1">
                          {Object.entries(tutor.pricing).map(([service, price]) => (
                            <div key={service} className="flex justify-between text-sm">
                              <span className="text-gray-600">{getPurposeLabel(service)}:</span>
                              <span className="font-medium">¥{price as number}/hr</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleContact(tutor.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Mentor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 responses received</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mentors Matched</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Based on your preferences</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$52</div>
                <p className="text-xs text-muted-foreground">Per hour in your area</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showChat && selectedTutor && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          targetUser={{
            name: selectedTutor.name,
            role: 'tutor',
            details: selectedTutor
          }}
          currentUser={{
            name: 'Student',
            role: 'student',
            details: studentData
          }}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
