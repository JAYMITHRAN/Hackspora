"use client"

import { useState, useEffect } from "react"
import { type JobListing, getJobListings } from "@/lib/api/jobs"
import Card from "@/components/common/Card"
import Button from "@/components/common/Button"
import { MapPinIcon, ClockIcon, BuildingOfficeIcon, GlobeAltIcon } from "@heroicons/react/24/outline"

interface JobFeedProps {
  category?: string
  className?: string
}

export default function JobFeed({ category, className }: JobFeedProps) {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "full-time" | "internship">("all")

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const jobData = await getJobListings({ query: category })
        setJobs(jobData)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [category])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently posted"
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const filteredJobs = jobs.filter((job) => {
    if (filter === "internship") {
      return job.job_type?.toLowerCase() === "internship" || job.role.toLowerCase().includes("intern")
    }
    if (filter === "full-time") {
      return (job.job_type?.toLowerCase() || "full-time") === "full-time"
    }
    return true
  })

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Latest Opportunities</h3>
        <div className="flex gap-2">
          {(["all", "full-time", "internship"] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
            >
              {type === "all" ? "All Jobs" : type === "full-time" ? "Full-time" : "Internships"}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id || job.url} variant="job" className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{job.role || job.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {job.location}
                    </div>
                    {job.remote && (
                      <div className="flex items-center gap-1">
                        <GlobeAltIcon className="w-4 h-4" />
                        Remote
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <ClockIcon className="w-3 h-3" />
                    {formatDate(job.published_at || job.created_at)}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {job.education_requirements || "Education requirements not listed"}
                </div>
                <Button size="sm" variant="outline" onClick={() => window.open(job.url, "_blank")}
                >
                  Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
