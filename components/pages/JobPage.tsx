"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Button from "@/components/common/Button"
import Card from "@/components/common/Card"
import { getJobListings, type JobListing, type JobSearchParams } from "@/lib/api/jobs"
import { useLocalStorage } from "@/lib/hooks/useLocalStorage"
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid"

export default function JobPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    query: "",
    location: "",
    jobType: "",
    experience: "",
    remote: false,
    page: 1,
    limit: 20
  })
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useLocalStorage<string[]>("saved-jobs", [])
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)

  // Get job role from results page
  const [selectedCareer] = useLocalStorage<string>("selected-career", "")

  // --- Load Jobs ---
  const loadJobs = async () => {
    if (!selectedCareer) return
    setLoading(true)
    try {
      const jobData = await getJobListings({ query: selectedCareer })
      setJobs(jobData)
    } catch (error) {
      console.error("Failed to load jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedCareer) {
      setLoading(false)
      return
    }
    // Set initial query based on selected career
    setSearchParams(prev => ({ ...prev, query: selectedCareer }))
    loadJobs()
  }, [selectedCareer])

  // --- Handle Search & Filters ---
  const handleSearch = (newParams: Partial<JobSearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams,
      page: 1 // Reset to first page when searching
    }))
  }

  const handleFilterChange = (key: keyof JobSearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value }))
  }

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      if (prev.includes(jobId)) return prev.filter(id => id !== jobId)
      return [...prev, jobId]
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const truncateDescription = (description: string, maxLength: number = 200) => {
    if (!description) return "" 
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + "..."
  }

  const extractCompanyFromTitle = (title: string) => {
    const match = title
    return match ? match[1].trim() : "Company"
  }

  const extractLocationFromTitle = (title: string) => {
    const match = title
    return match ? match[1].trim() : "Location not specified"
  }

  // --- Render No Data if no selected career ---
  if (!selectedCareer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h1>
            <p className="text-gray-600 mb-6">
              Complete your assessment to see your results dashboard.
            </p>
            <Button onClick={() => router.push("/assessment")}>Take Assessment</Button>
          </div>
        </div>
      </div>
    )
  }

  // --- Main Jobs Page UI ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
          <p className="text-gray-600">
            Find {selectedCareer} jobs around the world
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or keywords..."
                    
                    onChange={(e) => handleSearch({ query: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="lg:w-64">
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={searchParams.location}
                    onChange={(e) => handleSearch({ location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FunnelIcon className="h-5 w-5" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                      value={searchParams.jobType}
                      onChange={(e) => handleFilterChange("jobType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <select
                      value={searchParams.experience}
                      onChange={(e) => handleFilterChange("experience", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Levels</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remote"
                      checked={searchParams.remote}
                      onChange={(e) => handleFilterChange("remote", e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remote" className="ml-2 text-sm text-gray-700">
                      Remote Work
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Job Results */}
        <div className="space-y-4">
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <Card className="text-center py-12">
              <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
              <Button onClick={() => setSearchParams({})}>Clear Filters</Button>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id || job.url || `${job.title}-${job.url}`} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <BriefcaseIcon className="h-4 w-4" />
                          {extractCompanyFromTitle(job.title)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {extractLocationFromTitle(job.title)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {formatDate(job.published_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title={savedJobs.includes(job.id) ? "Remove from saved" : "Save job"}
                      >
                        {savedJobs.includes(job.id) ? (
                          <StarSolidIcon className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <StarIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">{truncateDescription(job.description)}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Source:</span>
                      <span className="text-sm font-medium text-blue-600">{job.website}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>View Details</Button>
                      <Button size="sm" onClick={() => window.open(job.url, '_blank')} className="flex items-center gap-1">
                        Apply
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Content */}
          </div>
        </div>
      )}
    </div>
  )
}
