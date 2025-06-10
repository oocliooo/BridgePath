
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
    age: '',
    purposes: [] as string[],
    currentUniversity: '',
    currentYear: '',
    applicationLevel: '',
    targetUniversity: '',
    targetEntry: ''
  });
  const { toast } = useToast();

  const purposes = [
    { id: 'college-application', label: 'College Application Guidance' },
    { id: 'cv-ps-sop', label: 'CV/Personal Statement/SoP Help' },
    { id: 'interview-prep', label: 'Interview Preparation' },
    { id: 'course-tutoring', label: 'Course Tutoring' },
    { id: 'major-consulting', label: 'Major/Career Consulting' }
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
      if (!formData.age || formData.purposes.length === 0) {
        toast({
          title: "Please complete all fields",
          description: "Age and at least one purpose are required.",
          variant: "destructive"
        });
        return;
      }
      
      if (formData.purposes.includes('college-application')) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep === 2) {
      if (!formData.currentUniversity || !formData.currentYear || !formData.applicationLevel || !formData.targetUniversity || !formData.targetEntry) {
        toast({
          title: "Please fill in all application details",
          description: "All fields are required for college application guidance.",
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
              <h1 className="text-2xl font-bold text-gray-900">CollegeBuddy</h1>
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
                Step {currentStep} of {formData.purposes.includes('college-application') ? '2' : '1'}
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
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Your age"
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

              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current-university">Current University</Label>
                      <Input
                        id="current-university"
                        value={formData.currentUniversity}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentUniversity: e.target.value }))}
                        placeholder="Your current school"
                      />
                    </div>
                    <div>
                      <Label htmlFor="current-year">Current Year</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, currentYear: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freshman">Freshman</SelectItem>
                          <SelectItem value="sophomore">Sophomore</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="application-level">Application Level</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, applicationLevel: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="What are you applying for?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="target-university">Target University/Dream School</Label>
                    <Input
                      id="target-university"
                      value={formData.targetUniversity}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetUniversity: e.target.value }))}
                      placeholder="e.g., Harvard, MIT, Stanford"
                    />
                  </div>

                  <div>
                    <Label htmlFor="target-entry">Target Entry Term</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, targetEntry: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="When do you want to start?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fall-2025">Fall 2025</SelectItem>
                        <SelectItem value="spring-2026">Spring 2026</SelectItem>
                        <SelectItem value="fall-2026">Fall 2026</SelectItem>
                        <SelectItem value="spring-2027">Spring 2027</SelectItem>
                        <SelectItem value="fall-2027">Fall 2027</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  {currentStep === 2 || !formData.purposes.includes('college-application') ? 'Complete Registration' : 'Next'}
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
