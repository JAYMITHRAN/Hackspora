"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/common/Button"
import Card from "@/components/common/Card"
import ProgressTracker from "@/components/common/ProgressTracker"
import { Input, Select, CheckboxCards } from "@/components/common/FormField"
import Navbar from "@/components/layout/Navbar"
import { useLocalStorage } from "@/lib/hooks/useLocalStorage"
import { submitAssessment, type AssessmentData } from "@/lib/api/assess"
import { EDUCATION_LEVELS, INTEREST_CATEGORIES } from "@/lib/utils/constants"
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

interface AssessmentStep {
  id: string
  title: string
  description: string
}

const ASSESSMENT_STEPS: AssessmentStep[] = [
  { id: "personal", title: "Personal Info", description: "Tell us about yourself" },
  { id: "interests", title: "Interests", description: "What excites you?" },
  { id: "skills", title: "Skills", description: "Rate your abilities" },
  { id: "summary", title: "Summary", description: "Review & submit" },
]

export default function AssessmentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right")

  // Form data with localStorage persistence
  const [formData, setFormData] = useLocalStorage<Partial<AssessmentData>>("assessment-data", {
    educationLevel: "",
    interests: [],
    skills: {},
    experience: "",
    preferences: {},
  })

  // Individual form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    age: "",
    location: "",
    educationLevel: formData.educationLevel || "",
    experience: formData.experience || "",
  })

  const [selectedInterests, setSelectedInterests] = useState<string[]>(formData.interests || [])
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>(formData.skills || {})

  useEffect(() => {
    const newFormData = {
      educationLevel: personalInfo.educationLevel,
      interests: selectedInterests,
      skills: skillRatings,
      experience: personalInfo.experience,
      preferences: {
        name: personalInfo.name,
        age: personalInfo.age,
        location: personalInfo.location,
      },
    }
    setFormData(newFormData)
  }, [
    personalInfo.educationLevel,
    personalInfo.experience,
    personalInfo.name,
    personalInfo.age,
    personalInfo.location,
    selectedInterests,
    skillRatings,
  ])

  const handleNext = () => {
    if (currentStep < ASSESSMENT_STEPS.length) {
      setSlideDirection("right")
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setSlideDirection("left")
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const assessmentData: AssessmentData = {
        educationLevel: personalInfo.educationLevel,
        interests: selectedInterests,
        skills: skillRatings,
        experience: personalInfo.experience,
        preferences: {
          name: personalInfo.name,
          age: personalInfo.age,
          location: personalInfo.location,
        },
      }

      await submitAssessment(assessmentData)
      router.push("/chat")
    } catch (error) {
      console.error("Error submitting assessment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return personalInfo.name && personalInfo.educationLevel && personalInfo.experience
      case 2:
        return selectedInterests.length >= 2
      case 3:
        // ✅ FIX: validate that all 5 skills have answers
        return (
          Object.keys(skillRatings).length === 5 &&
          Object.values(skillRatings).every((rating) => rating > 0)
        )
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    const stepClasses = cn(
      "transition-all duration-500 ease-in-out",
      slideDirection === "right" ? "animate-slide-in-right" : "animate-slide-in-left",
    )

    switch (currentStep) {
      case 1:
        return (
          <div className={stepClasses}>
            <PersonalInfoStep personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />
          </div>
        )
      case 2:
        return (
          <div className={stepClasses}>
            <InterestsStep selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests} />
          </div>
        )
      case 3:
        return (
          <div className={stepClasses}>
            <SkillsStep skillRatings={skillRatings} setSkillRatings={setSkillRatings} />
          </div>
        )
      case 4:
        return (
          <div className={stepClasses}>
            <SummaryStep
              personalInfo={personalInfo}
              selectedInterests={selectedInterests}
              skillRatings={skillRatings}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Career Assessment</h1>
          <p className="text-lg text-gray-600">
            Help us understand you better to provide personalized career recommendations
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-12">
          <ProgressTracker steps={ASSESSMENT_STEPS} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-8 min-h-[500px]">{renderStepContent()}</Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            icon={<ArrowLeftIcon className="w-4 h-4 bg-transparent" />}
          >
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {ASSESSMENT_STEPS.length}
          </div>

          {currentStep < ASSESSMENT_STEPS.length ? (
            <Button onClick={handleNext} disabled={!isStepValid()} icon={<ArrowRightIcon className="w-4 h-4" />}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              loading={isSubmitting}
              icon={<CheckIcon className="w-4 h-4" />}
            >
              Submit & Start Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------- Step Components -------------------------- */

interface PersonalInfoStepProps {
  personalInfo: {
    name: string
    age: string
    location: string
    educationLevel: string
    experience: string
  }
  setPersonalInfo: (info: any) => void
}

function PersonalInfoStep({ personalInfo, setPersonalInfo }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tell us about yourself</h2>
        <p className="text-gray-600">This helps us personalize your career recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={personalInfo.name}
          onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
          required
        />

        <Input
          label="Age"
          type="number"
          placeholder="Enter your age"
          value={personalInfo.age}
          onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
        />

        <Input
          label="Location"
          placeholder="City, Country"
          value={personalInfo.location}
          onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
        />

        <Select
          label="Education Level"
          options={EDUCATION_LEVELS}
          value={personalInfo.educationLevel}
          onChange={(e) => setPersonalInfo({ ...personalInfo, educationLevel: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Work Experience <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: "none", label: "No Experience" },
            { value: "entry", label: "0-2 years" },
            { value: "mid", label: "3-5 years" },
            { value: "senior", label: "5+ years" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPersonalInfo({ ...personalInfo, experience: option.value })}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                personalInfo.experience === option.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-700",
              )}
            >
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface InterestsStepProps {
  selectedInterests: string[]
  setSelectedInterests: (interests: string[]) => void
}

function InterestsStep({ selectedInterests, setSelectedInterests }: InterestsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">What interests you?</h2>
        <p className="text-gray-600">Select at least 2 areas that excite you (you can choose multiple)</p>
      </div>

      <CheckboxCards options={INTEREST_CATEGORIES} value={selectedInterests} onChange={setSelectedInterests} required />

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Selected: {selectedInterests.length} / {INTEREST_CATEGORIES.length}
        </p>
      </div>
    </div>
  )
}

interface SkillsStepProps {
  skillRatings: Record<string, number>
  setSkillRatings: (ratings: Record<string, number>) => void
}

function SkillsStep({ skillRatings, setSkillRatings }: SkillsStepProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const skillAssessmentQuestions = [
    {
      id: 1,
      question: "How comfortable are you with learning new technologies and adapting to changes?",
      skill: "Adaptability",
      options: [
        { value: 2, label: "I find it challenging to adapt to new technologies" },
        { value: 5, label: "I can learn new tools with some guidance" },
        { value: 8, label: "I adapt well to most technological changes" },
        { value: 10, label: "I actively seek out and embrace new technologies" },
      ],
    },
    {
      id: 2,
      question: "Rate your ability to effectively communicate complex ideas to others",
      skill: "Communication",
      options: [
        { value: 2, label: "I struggle to explain technical concepts" },
        { value: 5, label: "I can communicate basic ideas clearly" },
        { value: 8, label: "I'm good at explaining complex topics" },
        { value: 10, label: "I excel at presenting and documenting ideas" },
      ],
    },
    {
      id: 3,
      question: "How would you rate your problem-solving and analytical thinking skills?",
      skill: "Problem Solving",
      options: [
        { value: 2, label: "I often need help solving problems" },
        { value: 5, label: "I can solve routine problems independently" },
        { value: 8, label: "I'm good at breaking down complex problems" },
        { value: 10, label: "I excel at finding innovative solutions" },
      ],
    },
    {
      id: 4,
      question: "Assess your ability to work collaboratively in team environments",
      skill: "Teamwork",
      options: [
        { value: 2, label: "I prefer working independently" },
        { value: 5, label: "I can work well in most team settings" },
        { value: 8, label: "I actively contribute to team success" },
        { value: 10, label: "I often take leadership roles in teams" },
      ],
    },
    {
      id: 5,
      question: "Rate your project management and organizational skills",
      skill: "Organization",
      options: [
        { value: 2, label: "I sometimes struggle with deadlines" },
        { value: 5, label: "I can manage my own tasks effectively" },
        { value: 8, label: "I'm good at organizing team projects" },
        { value: 10, label: "I excel at managing complex projects" },
      ],
    },
  ]

  const handleSkillChange = (skill: string, value: number) => {
    setSkillRatings({ ...skillRatings, [skill]: value })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < skillAssessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const currentQuestion = skillAssessmentQuestions[currentQuestionIndex]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Rate your skills</h2>
        <p className="text-gray-600">Select the option that best describes your current skill level</p>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Question {currentQuestionIndex + 1} of {skillAssessmentQuestions.length}
            </h3>
            <span className="text-sm text-gray-500">Skill: {currentQuestion.skill}</span>
          </div>

          <p className="text-gray-700 font-medium">{currentQuestion.question}</p>

          <div className="space-y-3 mt-4">
            {currentQuestion.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  skillRatings[currentQuestion.skill] === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={`skill-${currentQuestion.skill}`}
                  value={option.value}
                  checked={skillRatings[currentQuestion.skill] === option.value}
                  onChange={() => handleSkillChange(currentQuestion.skill, option.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePreviousQuestion} icon={<ArrowLeftIcon className="w-4 h-4" />}>
          Previous
        </Button>

        <div className="flex gap-2">
          {skillAssessmentQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentQuestionIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button onClick={handleNextQuestion} icon={<ArrowRightIcon className="w-4 h-4" />}>
          {currentQuestionIndex === skillAssessmentQuestions.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}

interface SummaryStepProps {
  personalInfo: {
    name: string
    age: string
    location: string
    educationLevel: string
    experience: string
  }
  selectedInterests: string[]
  skillRatings: Record<string, number>
}

function SummaryStep({ personalInfo, selectedInterests, skillRatings }: SummaryStepProps) {
  const getEducationLabel = (value: string) =>
    EDUCATION_LEVELS.find((level) => level.value === value)?.label || value

  const getExperienceLabel = (value: string) =>
    ({ none: "No Experience", entry: "0-2 years", mid: "3-5 years", senior: "5+ years" }[value] || value)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Review Your Information</h2>
        <p className="text-gray-600">Please check your details before submitting</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{personalInfo.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Age</dt>
              <dd className="font-medium text-gray-900">{personalInfo.age}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Location</dt>
              <dd className="font-medium text-gray-900">{personalInfo.location}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Education Level</dt>
              <dd className="font-medium text-gray-900">{getEducationLabel(personalInfo.educationLevel)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Experience</dt>
              <dd className="font-medium text-gray-900">{getExperienceLabel(personalInfo.experience)}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Assessment</h3>
          <div className="space-y-4">
            {Object.entries(skillRatings).map(([skill, rating]) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{skill}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(rating / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{rating}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
