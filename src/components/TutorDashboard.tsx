
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, User, DollarSign, MessageCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TutorDashboardProps {
  tutorData: any;
  onBack: () => void;
}

const TutorDashboard = ({ tutorData, onBack }: TutorDashboardProps) => {
  const { toast } = useToast();

  // Mock student requests
  const studentRequests = [
    {
      id: 1,
      studentInitial: 'J',
      year: 'Junior',
      request: 'Need help with college application essays for Ivy League schools',
      services: ['college-application', 'cv-ps-sop'],
      urgency: 'High',
      budget: '$50-60/hr'
    },
    {
      id: 2,
      studentInitial: 'M',
      year: 'Senior',
      request: 'Looking for computer science course tutoring',
      services: ['course-tutoring'],
      urgency: 'Medium',
      budget: '$40-50/hr'
    },
    {
      id: 3,
      studentInitial: 'S',
      year: 'Sophomore',
      request: 'Interview preparation for graduate school',
      services: ['interview-prep'],
      urgency: 'Low',
      budget: '$45-55/hr'
    }
  ];

  const handleSendProposal = (studentId: number) => {
    toast({
      title: "Proposal sent!",
      description: "Your proposal has been sent to the student. They will review it and get back to you.",
    });
  };

  const getServiceLabel = (serviceId: string) => {
    const serviceMap: Record<string, string> = {
      'college-app': 'College Applications',
      'course-tutoring': 'Course Tutoring',
      'cv-ps': 'CV/Personal Statement',
      'interview-prep': 'Interview Prep',
      'academic-consulting': 'Academic Consulting',
      'college-application': 'College Applications',
      'cv-ps-sop': 'CV/PS/SoP'
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
                <h1 className="text-2xl font-bold text-gray-900">CollegeBuddy</h1>
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
          {/* Tutor Profile Summary */}
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
                  <p className="text-sm text-gray-600">Nickname: {tutorData.nickname}</p>
                  <p className="text-sm text-gray-600">Age: {tutorData.age}</p>
                  <p className="text-sm text-gray-600">University: {tutorData.university}</p>
                  <p className="text-sm text-gray-600">Major: {tutorData.department} - {tutorData.major}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Services Offered</h3>
                  <div className="space-y-1">
                    {tutorData.services.map((service: string) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {getServiceLabel(service)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Pricing</h3>
                  <div className="space-y-1">
                    {Object.entries(tutorData.pricing).map(([service, price]) => (
                      <div key={service} className="flex justify-between text-sm">
                        <span className="text-gray-600">{getServiceLabel(service)}:</span>
                        <span className="font-medium">${price}/hr</span>
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
                        <span>Student {request.studentInitial} ({request.year})</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency} Priority
                        </Badge>
                        <Badge variant="outline">{request.budget}</Badge>
                      </div>
                    </div>
                    <CardDescription>{request.request}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Services needed:</span>
                        {request.services.map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {getServiceLabel(service)}
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
    </div>
  );
};

export default TutorDashboard;
