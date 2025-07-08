import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudentDashboard from './StudentDashboard';

interface StudentRegistrationProps {
  onBack: () => void;
}

const StudentRegistration = ({ onBack }: StudentRegistrationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '',
    currentSchool: '',
    targetCountry: '',
    targetSchool: '',
    estimatedYear: '',
    mbti: '',
    intendedMajor: '',
    purposes: [] as string[],
  });
  const { toast } = useToast();

  const purposes = [
    { id: 'cv-ps-sop', label: 'CV/Personal Statement/SoP Help' },
    { id: 'interview-prep', label: 'Interview Preparation' },
    { id: 'major-consulting', label: 'Major/Career Consulting' },
    { id: 'application-process', label: 'Application Process Q&A' },
    { id: 'campus-life', label: 'Campus Life Consulting' },
    { id: 'culture-adaptation', label: 'Cultural Adaptation & Life Advice' },
  ];

  const handlePurposeToggle = (purposeId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        purposes: [...prev.purposes, purposeId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        purposes: prev.purposes.filter(p => p !== purposeId)
      }));
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.location || !formData.currentSchool || !formData.targetCountry || !formData.targetSchool || !formData.estimatedYear) {
        toast({
          title: "Please complete all fields",
          description: "All fields in this step are required.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.mbti || !formData.intendedMajor || formData.purposes.length === 0) {
        toast({
          title: "Please complete all fields",
          description: "All fields in this step are required.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(3);
    }
  };

  if (currentStep === 3) {
    return <StudentDashboard studentData={formData} onBack={() => setCurrentStep(formData.purposes.includes('college-application') ? 2 : 1)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={currentStep === 1 ? onBack : () => setCurrentStep(currentStep - 1)}
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
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of 2
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: formData.purposes.includes('college-application') 
                    ? `${(currentStep / 2) * 100}%` 
                    : '100%' 
                }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "College Application Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="mb-2">
                    <span className="text-gray-500 text-sm">You can freely edit them anytime.</span>
                  </div>
                  <div>
                    <Label htmlFor="location">Your Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="current-school">Your Current School</Label>
                    <Input
                      id="current-school"
                      value={formData.currentSchool}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentSchool: e.target.value }))}
                      placeholder="e.g., Beijing No.4 High School, Fudan University"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-country">Target Country/Region for Study Abroad</Label>
                    <Input
                      id="target-country"
                      value={formData.targetCountry}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetCountry: e.target.value }))}
                      placeholder="e.g., United States, United Kingdom, Australia"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-school">Your Target School</Label>
                    <Input
                      id="target-school"
                      value={formData.targetSchool}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetSchool: e.target.value }))}
                      placeholder="e.g., Harvard, MIT, Stanford"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimated-year">Estimated Year for Application</Label>
                    <Input
                      id="estimated-year"
                      value={formData.estimatedYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedYear: e.target.value }))}
                      placeholder="e.g., 2025, 2026"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <Label htmlFor="mbti">Your MBTI</Label>
                    <Input
                      id="mbti"
                      value={formData.mbti}
                      onChange={(e) => setFormData(prev => ({ ...prev, mbti: e.target.value }))}
                      placeholder="e.g., INFP, ESTJ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="intended-major">Intended Major/Field of Study</Label>
                    <Input
                      id="intended-major"
                      value={formData.intendedMajor}
                      onChange={(e) => setFormData(prev => ({ ...prev, intendedMajor: e.target.value }))}
                      placeholder="e.g., Computer Science, Economics"
                    />
                  </div>
                  <div>
                    <Label className="text-base font-medium">What do you need help with?</Label>
                    <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
                    <div className="space-y-3">
                      {purposes.map((purpose) => (
                        <div key={purpose.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={purpose.id}
                            checked={formData.purposes.includes(purpose.id)}
                            onCheckedChange={(checked) => handlePurposeToggle(purpose.id, checked as boolean)}
                          />
                          <Label htmlFor={purpose.id} className="font-medium">
                            {purpose.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  {currentStep === 2 ? 'Complete Registration' : 'Next Step'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
