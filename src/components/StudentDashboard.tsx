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
  const recommendedTutors = [
    {
      id: 1,
      name: 'Senior L.',
      title: 'Harvard Graduate Student',
      major: 'Computer Science',
      university: 'Harvard University',
      rating: 4.9,
      reviews: 24,
      specialties: ['College Applications', 'CV/PS Help', 'Interview Prep'],
      pricing: {
        'college-application': 55,
        'cv-ps-sop': 50,
        'interview-prep': 60
      },
      description: 'Experienced in helping students get into top-tier universities. Specialized in CS applications.',
      matchScore: 95
    },
    {
      id: 2,
      name: 'Senior M.',
      title: 'MIT PhD Candidate',
      major: 'Engineering',
      university: 'MIT',
      rating: 4.8,
      reviews: 18,
      specialties: ['Course Tutoring', 'Academic Consulting'],
      pricing: {
        'course-tutoring': 45,
        'academic-consulting': 50
      },
      description: 'PhD student with 3 years of tutoring experience. Strong background in STEM subjects.',
      matchScore: 88
    },
    {
      id: 3,
      name: 'Senior K.',
      title: 'Stanford Graduate',
      major: 'Business',
      university: 'Stanford University',
      rating: 4.7,
      reviews: 31,
      specialties: ['College Applications', 'Interview Prep', 'Major Consulting'],
      pricing: {
        'college-application': 50,
        'interview-prep': 55,
        'major-consulting': 45
      },
      description: 'Former admissions committee member. Expertise in business school applications.',
      matchScore: 82
    }
  ];

  const handleContact = (tutorId: number) => {
    const tutor = recommendedTutors.find(t => t.id === tutorId);
    setSelectedTutor(tutor);
    setShowChat(true);
  };

  const getPurposeLabel = (purposeId: string) => {
    const purposeMap: Record<string, string> = {
      'college-application': 'College Applications',
      'cv-ps-sop': 'CV/PS/SoP Help',
      'interview-prep': 'Interview Preparation',
      'course-tutoring': 'Course Tutoring',
      'major-consulting': 'Major/Career Consulting'
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
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">CollegeBuddy</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome,</span>
              <span className="font-medium">Student</span>
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
                  <p className="text-sm text-gray-600">Age: {studentData.age}</p>
                  {studentData.currentUniversity && (
                    <p className="text-sm text-gray-600">Current: {studentData.currentUniversity}</p>
                  )}
                  {studentData.currentYear && (
                    <p className="text-sm text-gray-600">Year: {studentData.currentYear}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Needs Help With</h3>
                  <div className="space-y-1">
                    {studentData.purposes.map((purpose: string) => (
                      <Badge key={purpose} variant="secondary" className="text-xs mr-1">
                        {getPurposeLabel(purpose)}
                      </Badge>
                    ))}
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
            </CardContent>
          </Card>

          {/* Recommended Tutors */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Tutors for You</h2>
            <div className="grid gap-6">
              {recommendedTutors.map((tutor) => (
                <Card key={tutor.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{tutor.name.split(' ')[0]}</span>
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
                              <span className="font-medium">${price as number}/hr</span>
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
                        Contact Tutor
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
                <CardTitle className="text-sm font-medium">Tutors Matched</CardTitle>
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
