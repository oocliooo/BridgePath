import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TutorDashboard from './TutorDashboard';

interface TutorRegistrationProps {
  onBack: () => void;
}

const TutorRegistration = ({ onBack }: TutorRegistrationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nickname: '',
    provinceOfGaokao: '',
    highSchoolGraduatedFrom: '',
    university: '',
    educationLevel: '',
    yearOfStudy: '',
    department: '',
    major: '',
    services: [] as string[],
    pricing: {} as Record<string, string>,
    studentId: null as File | null,
    mbti: ''
  });
  const { toast } = useToast();

  const services = [
    { id: 'cv-ps-sop', label: 'CV/Personal Statement/SoP Help', defaultPrice: '45' },
    { id: 'interview-prep', label: 'Interview Preparation', defaultPrice: '55' },
    { id: 'major-consulting', label: 'Major/Career Consulting', defaultPrice: '50' },
    { id: 'application-process', label: 'Application Process Q&A', defaultPrice: '40' },
    { id: 'campus-life', label: 'Campus Life Consulting', defaultPrice: '35' },
    { id: 'culture-adaptation', label: 'Cultural Adaptation & Life Advice', defaultPrice: '35' },
  ];

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, serviceId],
        pricing: {
          ...prev.pricing,
          [serviceId]: services.find(s => s.id === serviceId)?.defaultPrice || '50'
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        services: prev.services.filter(s => s !== serviceId),
        pricing: Object.fromEntries(
          Object.entries(prev.pricing).filter(([key]) => key !== serviceId)
        )
      }));
    }
  };

  const handlePricingChange = (serviceId: string, price: string) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [serviceId]: price
      }
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, studentId: file }));
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.nickname || !formData.provinceOfGaokao || !formData.highSchoolGraduatedFrom || !formData.university || !formData.educationLevel || !formData.yearOfStudy || !formData.department || !formData.major || !formData.mbti) {
        toast({
          title: "Please fill in all fields",
          description: "All personal information fields are required.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (formData.services.length === 0) {
        toast({
          title: "Please select at least one service",
          description: "You need to offer at least one service to continue.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!formData.studentId) {
        toast({
          title: "Please upload your student ID",
          description: "Student ID verification is required.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(4);
    }
  };

  if (currentStep === 4) {
    return <TutorDashboard tutorData={formData} onBack={() => setCurrentStep(3)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Services & Pricing"}
                {currentStep === 3 && "Verification"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nickname">Name</Label>
                      <Input
                        id="nickname"
                        value={formData.nickname}
                        onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="province-of-gaokao">Province of Gaokao</Label>
                    <Input
                      id="province-of-gaokao"
                      type="text"
                      placeholder="Enter the province where you took Gaokao"
                      value={formData.provinceOfGaokao}
                      onChange={e => setFormData(prev => ({ ...prev, provinceOfGaokao: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="high-school-graduated-from">High School Graduated From</Label>
                    <Input
                      id="high-school-graduated-from"
                      type="text"
                      placeholder="Enter your high school name"
                      value={formData.highSchoolGraduatedFrom}
                      onChange={e => setFormData(prev => ({ ...prev, highSchoolGraduatedFrom: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      value={formData.university}
                      onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                      placeholder="Your university name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="education-level">Education Level</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, educationLevel: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UG">Undergraduate (UG)</SelectItem>
                          <SelectItem value="PG">Postgraduate (PG)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="year-of-study">Year of Study</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, yearOfStudy: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st year</SelectItem>
                          <SelectItem value="2">2nd year</SelectItem>
                          <SelectItem value="3">3rd year</SelectItem>
                          <SelectItem value="4">4th year</SelectItem>
                          <SelectItem value="5">5th year</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="e.g., Engineering"
                      />
                    </div>
                    <div>
                      <Label htmlFor="major">Major</Label>
                      <Input
                        id="major"
                        value={formData.major}
                        onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mbti">MBTI</Label>
                    <Input
                      id="mbti"
                      type="text"
                      placeholder="Enter your MBTI type (e.g. INFP)"
                      value={formData.mbti}
                      onChange={e => setFormData(prev => ({ ...prev, mbti: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <Label className="text-base font-medium">Select Services You Can Provide</Label>
                    <p className="text-sm text-gray-600 mb-4">Choose the services you want to offer and set your hourly rates</p>
                    
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={service.id}
                              checked={formData.services.includes(service.id)}
                              onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                            />
                            <Label htmlFor={service.id} className="font-medium">
                              {service.label}
                            </Label>
                          </div>
                          {formData.services.includes(service.id) && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">¥</span>
                              <Input
                                type="number"
                                value={formData.pricing[service.id] || ''}
                                onChange={(e) => handlePricingChange(service.id, e.target.value)}
                                className="w-20"
                                placeholder="500"
                              />
                              <span className="text-sm text-gray-600">/hour</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div>
                    <Label className="text-base font-medium">Upload Student ID</Label>
                    <p className="text-sm text-gray-600 mb-4">Please upload a clear photo of your student ID for verification</p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <Label htmlFor="student-id-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                          Click to upload your student ID
                        </Label>
                        <Input
                          id="student-id-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                    
                    {formData.studentId && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {formData.studentId.name} uploaded successfully
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                  {currentStep === 3 ? 'Complete Registration' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorRegistration;
