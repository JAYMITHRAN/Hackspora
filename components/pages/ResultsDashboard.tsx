"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/layout/Navbar"
import Button from "@/components/common/Button"
import Card from "@/components/common/Card"
import Accordion from "@/components/common/Accordion"
import RadarChartWrapper from "@/components/dashboard/RadarChartWrapper"
import BarChartWrapper from "@/components/dashboard/BarChartWrapper"
import { getDashboardSummary, type DashboardSummary } from "@/lib/api/summary"
import { getCareerRecommendations, type CareerRecommendation } from "@/lib/api/recommend"
import { getCareerResources, type LearningResource } from "@/lib/api/resources"
import { useLocalStorage } from "@/lib/hooks/useLocalStorage"
import {
  TrophyIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  SparklesIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

export default function ResultsDashboard() {
  const router = useRouter()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [careers, setCareers] = useState<CareerRecommendation[]>([])
  const [resources, setResources] = useState<Record<string, LearningResource[]>>({})
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [savedResources] = useLocalStorage<string[]>("saved-resources", [])

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        // Load summary data
        const summaryData = await getDashboardSummary()
        setSummary(summaryData)

        // Load career recommendations
        const careerData = await getCareerRecommendations()
        setCareers(careerData)

        // Load resources for each career
        const resourcePromises = careerData.map(async (career) => {
          const careerResources = await getCareerResources(career.id)
          return { careerId: career.id, resources: careerResources }
        })

        const resourceResults = await Promise.all(resourcePromises)
        const resourceMap = resourceResults.reduce(
          (acc, { careerId, resources }) => {
            acc[careerId] = resources
            return acc
          },
          {} as Record<string, LearningResource[]>,
        )
        setResources(resourceMap)

        // Show confetti animation
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleExportPDF = () => {
    // Dummy PDF export functionality
    console.log("Exporting to PDF...")
    alert("PDF export functionality would be implemented here!")
  }

  const handleShare = () => {
    // Dummy share functionality
    navigator.clipboard.writeText(window.location.href)
    alert("Dashboard link copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h1>
            <p className="text-gray-600 mb-6">Complete your assessment to see your results dashboard.</p>
            <Button onClick={() => router.push("/assessment")}>Take Assessment</Button>
          </div>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const skillsRadarData = summary.skillsAnalysis.strengths.slice(0, 6).map((skill) => ({
    skill,
    current: Math.floor(Math.random() * 3) + 7,
    required: Math.floor(Math.random() * 2) + 8,
  }))

  const careerScoresData = careers.slice(0, 5).map((career) => ({
    name: career.title.split(" ").slice(0, 2).join(" "),
    score: career.matchScore,
    category: career.category,
  }))

  // Prepare accordion data for resources
  const accordionItems = careers.map((career) => ({
    id: career.id,
    title: `${career.title} Resources`,
    icon: <SparklesIcon className="w-5 h-5" />,
    content: (
      <div className="space-y-3">
        {resources[career.id]?.slice(0, 3).map((resource) => (
          <div key={resource.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <img
              src={resource.thumbnail || "/placeholder.svg"}
              alt={resource.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{resource.title}</h4>
              <p className="text-sm text-gray-600">{resource.provider}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">{resource.price}</div>
              <div className="text-xs text-gray-500">{resource.duration}</div>
            </div>
          </div>
        )) || <p className="text-gray-500">No resources available</p>}
      </div>
    ),
  }))

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/4 left-1/4 animate-bounce">🎉</div>
          <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: "200ms" }}>
            ✨
          </div>
          <div className="absolute top-1/2 left-1/3 animate-bounce" style={{ animationDelay: "400ms" }}>
            🎊
          </div>
          <div className="absolute top-2/3 right-1/3 animate-bounce" style={{ animationDelay: "600ms" }}>
            🌟
          </div>
        </div>
      )}

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Career Results</h1>
            <p className="text-gray-600">Comprehensive analysis of your career assessment</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              icon={<DocumentArrowDownIcon className="w-4 h-4 bg-transparent" />}
            >
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleShare} icon={<ShareIcon className="w-4 h-4 bg-transparent" />}>
              Share Results
            </Button>
          </div>
        </div>

        {/* Top Career Highlight */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Best Match
                </span>
                <span className="text-2xl font-bold text-green-600">{summary.topCareer.matchScore}%</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{summary.topCareer.title}</h2>
              <p className="text-gray-600">{summary.topCareer.category}</p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/career/${careers.find((c) => c.title === summary.topCareer.title)?.id}`)}
            className="bg-green-600 hover:bg-green-700"
          >
            Explore This Career
          </Button>
        </Card>

        {/* Progress Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {summary.progressMetrics.assessmentComplete ? "Complete" : "Incomplete"}
            </div>
            <div className="text-sm text-gray-600">Assessment Status</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{summary.progressMetrics.resourcesViewed}</div>
            <div className="text-sm text-gray-600">Resources Viewed</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <SparklesIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{summary.progressMetrics.skillsImproved}</div>
            <div className="text-sm text-gray-600">Skills Improved</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrophyIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{summary.progressMetrics.careerExplored}</div>
            <div className="text-sm text-gray-600">Careers Explored</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Analysis */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills vs Requirements</h2>
            <RadarChartWrapper data={skillsRadarData} />
          </Card>

          {/* Career Scores */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Career Match Scores</h2>
            <BarChartWrapper data={careerScoresData} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Analysis Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills Analysis</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                  <CheckIcon className="w-5 h-5" />
                  Your Strengths
                </h3>
                <div className="space-y-2">
                  {summary.skillsAnalysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  Areas to Improve
                </h3>
                <div className="space-y-2">
                  {summary.skillsAnalysis.gaps.map((gap, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-800">{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                  <LightBulbIcon className="w-5 h-5" />
                  Recommendations
                </h3>
                <div className="space-y-2">
                  {summary.skillsAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-blue-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Next Steps</h2>
            <div className="space-y-4">
              {summary.nextSteps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{step}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button onClick={() => router.push("/chat")} className="w-full">
                Continue with AI Advisor
              </Button>
            </div>
          </Card>
        </div>

        {/* Resources by Career */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Resources by Career</h2>
          <Accordion items={accordionItems} />
        </Card>
      </div>
    </div>
  )
}
