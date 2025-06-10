
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, Users } from "lucide-react";
import TutorRegistration from './TutorRegistration';
import StudentRegistration from './StudentRegistration';

interface UserRegistrationProps {
  onBack: () => void;
}

const UserRegistration = ({ onBack }: UserRegistrationProps) => {
  const [userType, setUserType] = useState<'tutor' | 'student' | null>(null);

  if (userType === 'tutor') {
    return <TutorRegistration onBack={() => setUserType(null)} />;
  }

  if (userType === 'student') {
    return <StudentRegistration onBack={() => setUserType(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
        </div>
      </header>

      {/* Registration Type Selection */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How would you like to use CollegeBuddy?
            </h2>
            <p className="text-lg text-gray-600">
              Choose your role to get started with the right experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card 
              className="cursor-pointer border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all transform hover:-translate-y-1"
              onClick={() => setUserType('student')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">I'm a Student</CardTitle>
                <CardDescription className="text-base">
                  I need help with academics or college applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• Find expert tutors</li>
                  <li>• Get application guidance</li>
                  <li>• Improve your grades</li>
                  <li>• Practice interviews</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Join as Student
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all transform hover:-translate-y-1"
              onClick={() => setUserType('tutor')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">I'm a Tutor</CardTitle>
                <CardDescription className="text-base">
                  I want to help students and earn money
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• Set your own rates</li>
                  <li>• Choose your subjects</li>
                  <li>• Build your reputation</li>
                  <li>• Help students succeed</li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Join as Tutor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
