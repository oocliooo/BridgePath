import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserRegistration from '../components/UserRegistration';

const Index = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setShowRegistration(true);
  };

  if (showRegistration) {
    return <UserRegistration onBack={() => setShowRegistration(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">BridgePath</h1>
            </div>
            <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Connect with Academic Mentors
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a student seeking guidance or an experienced tutor ready to help, 
            BridgePath connects you with the perfect academic match.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
          >
            Join BridgePath Today
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How BridgePath Works
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span>For Students</span>
                </CardTitle>
                <CardDescription>Find the perfect tutor for your academic needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Get help with college applications</li>
                  <li>• Find course-specific tutoring</li>
                  <li>• Receive CV/Personal Statement guidance</li>
                  <li>• Practice interviews with experts</li>
                  <li>• Connect with mentors in your field</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  <span>For Mentors</span>
                </CardTitle>
                <CardDescription>Share your knowledge and earn money</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Set your own hourly rates</li>
                  <li>• Choose your specialties</li>
                  <li>• Build your tutoring profile</li>
                  <li>• Connect with motivated students</li>
                  <li>• Flexible scheduling options</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>College Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get expert guidance on college applications, essays, and admission strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Course Tutoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  One-on-one tutoring for specific courses and academic subjects.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Interview Prep</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Practice interviews and get feedback from experienced mentors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold">BridgePath</span>
          </div>
          <p className="text-gray-400">
            Connecting students and mentors for academic success
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
