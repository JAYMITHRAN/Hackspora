"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"
import ChatMessage from "@/components/chatbot/ChatMessage"
import ChatInput from "@/components/chatbot/ChatInput"
import QuickReplies from "@/components/chatbot/QuickReplies"
import JobFeed from "@/components/dashboard/JobFeed"
import Button from "@/components/common/Button"
import Card from "@/components/common/Card"
import Modal from "@/components/common/Modal"
import { useChatbot } from "@/lib/hooks/useChatbot"
import { useLocalStorage } from "@/lib/hooks/useLocalStorage"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { getCareerRecommendations, type CareerRecommendation } from "@/lib/api/recommend"
import {
  UserIcon,
  Cog6ToothIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"

interface ProfileData {
  name: string
  educationLevel: string
  interests: string[]
  topSkills: string[]
}

interface AssessmentData {
  preferences?: {
    name?: string
  }
  educationLevel?: string
  interests?: string[]
  skills?: Record<string, number>
}

export default function ChatPage() {
  const router = useRouter()
  const { messages, isLoading, sendMessage, clearChat } = useChatbot()
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showJobFeed, setShowJobFeed] = useState(false)
  const [jobFeedType, setJobFeedType] = useState<"jobs" | "internships">("jobs")
  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendation[]>([])
  const [showChangeProfileModal, setShowChangeProfileModal] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get profile data from assessment
  const [assessmentData] = useLocalStorage<AssessmentData>("assessment-data", {})
  const [profileData] = useState<ProfileData>({
    name: assessmentData.preferences?.name || "User",
    educationLevel: assessmentData.educationLevel || "Not specified",
    interests: assessmentData.interests || [],
    topSkills: Object.entries(assessmentData.skills || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([skill]) => skill),
  })

  // Auto-scroll to bottom when new messages arrive or when typing indicator appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Load career recommendations on mount
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const recommendations = await getCareerRecommendations()
        setCareerRecommendations(recommendations)
      } catch (error) {
        console.error("Error loading recommendations:", error)
      }
    }
    loadRecommendations()
  }, [])

  // Update typing indicator based on loading state
  useEffect(() => {
    setIsTyping(isLoading)
  }, [isLoading])

  const quickReplies = [
    {
      id: "resources",
      text: t('chat.quickReplies.showResources'),
      icon: <AcademicCapIcon className="w-4 h-4" />,
    },
    {
      id: "jobs",
      text: t('chat.quickReplies.jobUpdates'),
      icon: <BriefcaseIcon className="w-4 h-4" />,
    },
    {
      id: "careers",
      text: t('chat.quickReplies.topCareers'),
      icon: <ChartBarIcon className="w-4 h-4" />,
    },
  ]

  const handleQuickReply = (reply: any) => {
    switch (reply.id) {
      case "resources":
        sendMessage("Show me learning resources for my recommended careers")
        break
      case "jobs":
        setShowJobFeed(true)
        sendMessage("Show me the latest job opportunities")
        break
      case "careers":
        sendMessage("What are my top career recommendations?")
        break
    }
  }

  const handleCareerCardClick = (careerId: string) => {
    router.push(`/career/${careerId}`)
  }

  const handleChangeProfile = () => {
    setShowChangeProfileModal(true)
  }

  const handleResetAssessment = () => {
    localStorage.removeItem("assessment-data")
    router.push("/assessment")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          title="Profile & Roadmap"
          className={`w-80 lg:w-72 fixed top-0 left-0 h-full z-40 bg-white border-r border-gray-200 transition-transform
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:static lg:translate-x-0
          `}
        >
          {/* Desktop close button */}
          <div className="hidden lg:flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              icon={<XMarkIcon className="w-5 h-5" />}
            />
          </div>

          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{profileData.name}</h3>
                  <p className="text-sm text-gray-600">{profileData.educationLevel}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleChangeProfile}
                  icon={<Cog6ToothIcon className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-1">
                    {profileData.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Top Skills</h4>
                  <div className="space-y-1">
                    {profileData.topSkills.map((skill, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Career Recommendations */}
            {careerRecommendations.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-blue-500" />
                  Recommended Careers
                </h3>
                <div className="space-y-3">
                  {careerRecommendations.slice(0, 3).map((career) => (
                    <div
                      key={career.id}
                      onClick={() => handleCareerCardClick(career.id)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <h4 className="font-medium text-sm text-gray-900 mb-1">{career.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{career.description}</p>
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-medium text-blue-600">{career.matchScore}% match</span>
                         <span className="text-xs text-gray-500">{career.salaryRange}</span>
                       </div>
                    </div>
                  ))}
                  {careerRecommendations.length > 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 bg-transparent"
                      onClick={() => router.push("/results")}
                    >
                      View All ({careerRecommendations.length})
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* AI Roadmap */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-blue-500" />
                AI Roadmap
              </h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Complete Assessment", status: "completed", description: "Understand your profile" },
                  { step: 2, title: "Explore Careers", status: "current", description: "Chat with AI advisor" },
                  { step: 3, title: "Skill Development", status: "upcoming", description: "Build required skills" },
                  { step: 4, title: "Job Applications", status: "upcoming", description: "Apply to positions" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        item.status === "completed"
                          ? "bg-green-500 text-white"
                          : item.status === "current"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/results")}
                >
                  View Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={handleChangeProfile}
                >
                  Change Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={handleResetAssessment}
                >
                  Retake Assessment
                </Button>
              </div>
            </Card>
          </div>
        </Sidebar>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col transition-all">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {/* menu */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen((open) => !open)}
                icon={<Bars3Icon className="w-5 h-5" />}
              />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                 <div>
                   <h1 className="font-semibold text-gray-900">{t('chat.title')}</h1>
                   <p className="text-xs text-gray-500 flex items-center gap-1">
                     {isTyping ? (
                       <>
                         <span>{t('chat.status.thinking')}</span>
                         <div className="flex gap-0.5 items-center">
                           <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms] [animation-duration:1.4s]"></div>
                           <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms] [animation-duration:1.4s]"></div>
                           <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms] [animation-duration:1.4s]"></div>
                         </div>
                       </>
                     ) : (
                       t('chat.status.online')
                     )}
                   </p>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJobFeed(!showJobFeed)}
                icon={<BriefcaseIcon className="w-4 h-4 bg-transparent" />}
              >
                {showJobFeed ? "Hide Jobs" : "Show Jobs"}
              </Button>
              <Button variant="ghost" size="sm" onClick={clearChat} icon={<XMarkIcon className="w-4 h-4" />}>
                Clear Chat
              </Button>
            </div>
          </div>

           <div className="flex flex-1 overflow-hidden">
             {/* Chat Messages */}
             <div className="flex-1 flex flex-col min-w-0">
               <div className="flex-1 overflow-y-auto scroll-smooth">
                 <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
                   {messages.map((message) => (
                     <ChatMessage key={message.id} message={message} />
                   ))}
                   {isTyping && (
                     <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                       <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                         <SparklesIcon className="w-4 h-4 text-white" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-2">
                           <span className="font-medium text-sm text-gray-900">{t('chat.title')}</span>
                           <span className="text-xs text-gray-500">{t('chat.thinking.dots')}</span>
                           <div className="flex gap-1 items-center">
                             <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms] [animation-duration:1.4s]"></div>
                             <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms] [animation-duration:1.4s]"></div>
                             <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms] [animation-duration:1.4s]"></div>
                           </div>
                         </div>
                         <div className="text-sm text-gray-600 italic">
                           {t('chat.thinking.analyzing')}
                         </div>
                       </div>
                     </div>
                   )}
                   <div ref={messagesEndRef} className="h-4" />
                 </div>
               </div>

              {/* Quick Replies */}
              <div className="max-w-4xl mx-auto w-full px-4 py-2">
                <QuickReplies replies={quickReplies} onReplyClick={handleQuickReply} />
              </div>

              {/* Chat Input */}
              <div className="max-w-4xl mx-auto w-full px-4 pb-4">
                <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
              </div>
            </div>

            {/* Job Feed Panel */}
            {showJobFeed && (
              <div className="w-80 border-l border-gray-200 bg-white flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Job Feed</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowJobFeed(false)}
                      icon={<XMarkIcon className="w-4 h-4" />}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={jobFeedType === "jobs" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setJobFeedType("jobs")}
                    >
                      Latest Jobs
                    </Button>
                    <Button
                      variant={jobFeedType === "internships" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setJobFeedType("internships")}
                    >
                      Internships
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <JobFeed category={jobFeedType} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Profile Modal */}
      <Modal
        isOpen={showChangeProfileModal}
        onClose={() => setShowChangeProfileModal(false)}
        title="Change Profile"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You can update your profile information or retake the assessment to get new recommendations.
          </p>
          <div className="flex gap-3">
            <Button onClick={handleResetAssessment} className="flex-1">
              Retake Assessment
            </Button>
            <Button variant="outline" onClick={() => setShowChangeProfileModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
