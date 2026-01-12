"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Brain, 
  Download, 
  Eye, 
  Save, 
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  X
} from 'lucide-react'
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useToast } from '@/hooks/use-toast'

export default function ResumeBuilder() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState('personal')
  const [isGenerating, setIsGenerating] = useState(false)

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
  ]

  const [formData, setFormData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      summary: ''
    },
    experience: [
      {
        company: '',
        position: '',
        duration: '',
        description: ''
      }
    ],
    education: [
      {
        institution: '',
        degree: '',
        duration: '',
        gpa: ''
      }
    ],
    skills: []
  })

  const handleGenerateWithAI = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "AI Enhancement Complete!",
        description: "Your resume has been optimized with AI suggestions.",
      })
    }, 2000)
  }

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '', description: '' }]
    }))
  }

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', duration: '', gpa: '' }]
    }))
  }

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const renderPersonalSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            placeholder="John Doe"
            value={formData.personal.fullName}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personal: { ...prev.personal, fullName: e.target.value }
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="john@example.com"
            value={formData.personal.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personal: { ...prev.personal, email: e.target.value }
            }))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            placeholder="+1 (555) 123-4567"
            value={formData.personal.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personal: { ...prev.personal, phone: e.target.value }
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            placeholder="San Francisco, CA"
            value={formData.personal.location}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personal: { ...prev.personal, location: e.target.value }
            }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile</Label>
        <Input 
          id="linkedin" 
          placeholder="https://linkedin.com/in/johndoe"
          value={formData.personal.linkedin}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            personal: { ...prev.personal, linkedin: e.target.value }
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea 
          id="summary" 
          placeholder="Write a compelling summary of your professional background..."
          rows={4}
          value={formData.personal.summary}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            personal: { ...prev.personal, summary: e.target.value }
          }))}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerateWithAI}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Brain className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderExperienceSection = () => (
    <div className="space-y-6">
      {formData.experience.map((exp, index) => (
        <Card key={index} className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Experience #{index + 1}</CardTitle>
            {formData.experience.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExperience(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input 
                  placeholder="Google Inc."
                  value={exp.company}
                  onChange={(e) => {
                    const newExp = [...formData.experience]
                    newExp[index].company = e.target.value
                    setFormData(prev => ({ ...prev, experience: newExp }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input 
                  placeholder="Software Engineer"
                  value={exp.position}
                  onChange={(e) => {
                    const newExp = [...formData.experience]
                    newExp[index].position = e.target.value
                    setFormData(prev => ({ ...prev, experience: newExp }))
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input 
                placeholder="Jan 2020 - Present"
                value={exp.duration}
                onChange={(e) => {
                  const newExp = [...formData.experience]
                  newExp[index].duration = e.target.value
                  setFormData(prev => ({ ...prev, experience: newExp }))
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe your key responsibilities and achievements..."
                rows={3}
                value={exp.description}
                onChange={(e) => {
                  const newExp = [...formData.experience]
                  newExp[index].description = e.target.value
                  setFormData(prev => ({ ...prev, experience: newExp }))
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        variant="outline" 
        onClick={addExperience}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  )

  const renderEducationSection = () => (
    <div className="space-y-6">
      {formData.education.map((edu, index) => (
        <Card key={index} className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
            {formData.education.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input 
                  placeholder="Stanford University"
                  value={edu.institution}
                  onChange={(e) => {
                    const newEdu = [...formData.education]
                    newEdu[index].institution = e.target.value
                    setFormData(prev => ({ ...prev, education: newEdu }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input 
                  placeholder="Bachelor of Science in Computer Science"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...formData.education]
                    newEdu[index].degree = e.target.value
                    setFormData(prev => ({ ...prev, education: newEdu }))
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input 
                  placeholder="2016 - 2020"
                  value={edu.duration}
                  onChange={(e) => {
                    const newEdu = [...formData.education]
                    newEdu[index].duration = e.target.value
                    setFormData(prev => ({ ...prev, education: newEdu }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input 
                  placeholder="3.8/4.0"
                  value={edu.gpa}
                  onChange={(e) => {
                    const newEdu = [...formData.education]
                    newEdu[index].gpa = e.target.value
                    setFormData(prev => ({ ...prev, education: newEdu }))
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        variant="outline" 
        onClick={addEducation}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  )

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Skills</Label>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'].map((skill, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {skill}
              <button className="ml-2 text-xs hover:text-red-600">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Add a skill..." className="flex-1" />
          <Button variant="outline">Add</Button>
        </div>
      </div>
      
      <Button 
        variant="default" 
        onClick={handleGenerateWithAI}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Brain className="h-4 w-4 mr-2 animate-spin" />
            Analyzing Skills...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Suggest Skills with AI
          </>
        )}
      </Button>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSection()
      case 'experience':
        return renderExperienceSection()
      case 'education':
        return renderEducationSection()
      case 'skills':
        return renderSkillsSection()
      default:
        return renderPersonalSection()
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AI Resume <span className="text-blue-600">Builder</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create a professional, ATS-optimized resume with our intelligent builder
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-blue-600">Build Sections</CardTitle>
              <CardDescription>Complete each section to build your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>
                  {sections.find(s => s.id === activeSection)?.label}
                </span>
              </CardTitle>
              <CardDescription>
                Fill in your information and let AI optimize it for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderActiveSection()}
            </CardContent>
          </Card>
        </div>

        {/* Preview & Actions */}
        <div className="lg:col-span-1">
          <div className="space-y-4 sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[8.5/11] bg-gray-50 rounded-lg border border-gray-200 p-4 text-xs text-gray-500">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    <div className="mt-4 space-y-1">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Preview Resume
              </Button>
              <Button variant="default" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="ghost" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
