"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Button from "@/components/common/Button"
import Card from "@/components/common/Card"
import Modal from "@/components/common/Modal"
import RadarChartWrapper from "@/components/dashboard/RadarChartWrapper"
import { getCareerResources, type LearningResource } from "@/lib/api/resources"
import { getCareerRecommendations, type CareerRecommendation } from "@/lib/api/recommend"
import { useLocalStorage } from "@/lib/hooks/useLocalStorage"
import { ArrowLeftIcon, BookmarkIcon, ShareIcon, PlayIcon, StarIcon, ClockIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"

interface CareerDetailPageProps {
  careerId: string
}

export default function CareerDetailPage({ careerId }: CareerDetailPageProps) {
  const router = useRouter()
  const [career, setCareer] = useState<CareerRecommendation | null>(null)
  const [resources, setResources] = useState<LearningResource[]>([])
  const [savedResources, setSavedResources] = useLocalStorage<string[]>("saved-resources", [])
  const [loading, setLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)

  // Mock user skills data
  const [userSkills] = useState({
    "Design Thinking": 6,
    Prototyping: 4,
    "User Research": 3,
    Figma: 5,
    Communication: 7,
    "Problem Solving": 8,
  })

  useEffect(() => {
    const loadCareerData = async () => {
      setLoading(true)
      try {
        // Load career details
        const careers = await getCareerRecommendations()
        const foundCareer = careers.find((c) => c.id === careerId)
        setCareer(foundCareer || null)

        // Load resources
        const resourceData = await getCareerResources(careerId)
        setResources(resourceData)
      } catch (error) {
        console.error("Error loading career data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCareerData()
  }, [careerId])

  const handleSaveResource = (resourceId: string) => {
    if (savedResources.includes(resourceId)) {
      setSavedResources(savedResources.filter((id) => id !== resourceId))
    } else {
      setSavedResources([...savedResources, resourceId])
    }
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Career Not Found</h1>
            <Button onClick={() => router.back()} icon={<ArrowLeftIcon className="w-4 h-4 bg-transparent" />}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Prepare radar chart data
  const radarData = career.requiredSkills.slice(0, 6).map((skill) => ({
    skill,
    current: userSkills[skill as keyof typeof userSkills] || Math.floor(Math.random() * 5) + 3,
    required: Math.floor(Math.random() * 3) + 7,
  }))

  // Learning roadmap steps
  const roadmapSteps = [
    {
      id: 1,
      title: "Foundation Skills",
      description: "Build core competencies",
      duration: "2-4 weeks",
      resources: resources.filter((r) => r.type === "course").slice(0, 2),
    },
    {
      id: 2,
      title: "Practical Application",
      description: "Hands-on projects and practice",
      duration: "4-6 weeks",
      resources: resources.filter((r) => r.type === "video").slice(0, 2),
    },
    {
      id: 3,
      title: "Portfolio Development",
      description: "Create showcase projects",
      duration: "3-4 weeks",
      resources: resources.filter((r) => r.type === "article").slice(0, 1),
    },
    {
      id: 4,
      title: "Certification",
      description: "Earn industry credentials",
      duration: "2-3 weeks",
      resources: resources.filter((r) => r.type === "certification").slice(0, 1),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            icon={<ArrowLeftIcon className="w-4 h-4 bg-transparent" />}
          >
            Back to Chat
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} icon={<ShareIcon className="w-4 h-4 bg-transparent" />}>
              Share
            </Button>
          </div>
        </div>

        {/* Career Overview */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {career.category}
                </span>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-lg">{career.matchScore}% Match</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{career.title}</h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">{career.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Salary Range</h3>
                  <p className="text-2xl font-bold text-green-600">{career.salaryRange}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Growth Rate</h3>
                  <p className="text-2xl font-bold text-blue-600">{career.growthRate} annually</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Job Demand</h3>
                  <p className="text-2xl font-bold text-purple-600">High</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Comparison */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills Analysis</h2>
            <RadarChartWrapper data={radarData} />
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-gray-900">Skill Gaps to Address:</h3>
              {radarData
                .filter((item) => item.required > item.current)
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-900">{item.skill}</span>
                    <span className="text-sm text-red-700">Need +{item.required - item.current} levels</span>
                  </div>
                ))}
            </div>
          </Card>

          {/* Required Skills */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Required Skills</h2>
            <div className="space-y-4">
              {career.requiredSkills.map((skill, index) => {
                const userLevel = userSkills[skill as keyof typeof userSkills] || Math.floor(Math.random() * 5) + 3
                const requiredLevel = Math.floor(Math.random() * 3) + 7
                const percentage = Math.min((userLevel / requiredLevel) * 100, 100)

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{skill}</span>
                      <span className="text-sm text-gray-600">
                        {userLevel}/{requiredLevel}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentage >= 70 ? "bg-green-500" : percentage >= 40 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Learning Roadmap */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Roadmap</h2>
          <div className="space-y-6">
            {roadmapSteps.map((step, index) => (
              <div key={step.id} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {step.id}
                  </div>
                  {index < roadmapSteps.length - 1 && <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  {step.resources.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {step.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <img
                            src={resource.thumbnail || "/placeholder.svg"}
                            alt={resource.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{resource.title}</h4>
                            <p className="text-sm text-gray-600">{resource.provider}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveResource(resource.id)}
                            icon={
                              savedResources.includes(resource.id) ? (
                                <BookmarkSolidIcon className="w-4 h-4 text-blue-500" />
                              ) : (
                                <BookmarkIcon className="w-4 h-4 bg-transparent" />
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Resources */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
                <img
                  src={resource.thumbnail || "/placeholder.svg"}
                  alt={resource.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                      {resource.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{resource.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600">{resource.provider}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      {resource.duration}
                    </div>
                    <span className="font-semibold text-green-600">{resource.price}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" icon={<PlayIcon className="w-3 h-3" />}>
                      Start
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveResource(resource.id)}
                      icon={
                        savedResources.includes(resource.id) ? (
                          <BookmarkSolidIcon className="w-4 h-4 text-blue-500" />
                        ) : (
                          <BookmarkIcon className="w-4 h-4 bg-transparent" />
                        )
                      }
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share Career Path" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">Share this career path with others:</p>
          <div className="flex gap-2">
            <Button onClick={copyToClipboard} className="flex-1">
              Copy Link
            </Button>
            <Button variant="outline" onClick={() => setShowShareModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
