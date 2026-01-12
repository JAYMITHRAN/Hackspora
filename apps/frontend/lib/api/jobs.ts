import { apiClient } from "../utils/api-client"
import { title_for_user } from "./summary"

export interface JobListing {
  id: string
  title: string
  role: string
  company: string
  location: string
  website: string
  url: string
  description: string
  salary_range?: string
  job_type?: string
  experience_level?: string
  remote?: boolean
  created_at: string
  published_at: string
  education_requirements?: string
  source?: string
}

export interface JobResponseMeta {
  count: number
  generated_at: string
  source?: string
}

export interface JobResponse {
  role: string
  jobs: JobListing[]
  meta?: JobResponseMeta
}

export interface JobSearchParams {
  query?: string
  page?: number
  limit?: number
  location?: string
  jobType?: string
  experience?: string
  remote?: boolean
}

const DEFAULT_ROLE = "Software Engineer"

const ensureString = (value: unknown): string => (typeof value === "string" ? value.trim() : "")

const ensureIso = (value: unknown): string => {
  const candidate = ensureString(value)
  const date = candidate ? new Date(candidate) : new Date()
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

const sanitizeUrl = (value: unknown): string | null => {
  const raw = ensureString(value)
  if (!raw) return null
  try {
    const prefixed = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    const parsed = new URL(prefixed)
    return parsed.toString()
  } catch (_) {
    return null
  }
}

const normalizeListing = (
  job: Partial<JobListing> | null | undefined,
  index: number,
  fallbackRole: string,
): JobListing | null => {
  if (!job || typeof job !== "object") return null

  const role = ensureString(job.role) || ensureString(job.title) || fallbackRole || DEFAULT_ROLE
  const company = ensureString(job.company) || "Confidential"
  const location = ensureString(job.location) || "Global"
  const url = sanitizeUrl((job as JobListing).url || (job as any).apply_url)
  if (!url) return null

  const baseTitle = ensureString(job.title) || `${role} at ${company} in ${location}`
  const id = ensureString(job.id) || `${role.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}-${index}`

  return {
    id,
    title: baseTitle,
    role,
    company,
    location,
    website:
      ensureString(job.website) ||
      (() => {
        try {
          return new URL(url).host
        } catch (_) {
          return "example.com"
        }
      })(),
    url,
    description: ensureString(job.description) || "Description unavailable.",
    salary_range: ensureString(job.salary_range),
    job_type: ensureString(job.job_type) || "Full-time",
    experience_level: ensureString(job.experience_level) || "Mid Level",
    remote:
      typeof job.remote === "boolean"
        ? job.remote
        : /remote|anywhere/i.test(location)
          ? true
          : undefined,
    created_at: ensureIso(job.created_at),
    published_at: ensureIso(job.published_at || job.created_at),
    education_requirements: ensureString(job.education_requirements),
    source: ensureString(job.source) || "llm",
  }
}

export async function getJobListings(params: JobSearchParams = {}): Promise<JobListing[]> {
  try {
    const query = (params.query || title_for_user.title || DEFAULT_ROLE).trim()
    const encoded = encodeURIComponent(query)
    const data = await apiClient.get<JobResponse | JobListing[] | JobListing>(`/api/job/${encoded}`)
    const rawJobs = Array.isArray(data)
      ? data
      : Array.isArray((data as JobResponse)?.jobs)
        ? (data as JobResponse).jobs
        : data
          ? [data as JobListing]
          : []

    const normalized = rawJobs
      .map((job, index) => normalizeListing(job, index, query))
      .filter((job): job is JobListing => Boolean(job))

    if (!normalized.length) {
      throw new Error("No valid job listings returned")
    }

    return normalized
  } catch (error) {
    console.error("Failed to fetch job listings:", error)
    throw new Error("Failed to load job listings. Please try again.")
  }
}

export async function getJobDetails(jobId: string, params?: JobSearchParams): Promise<JobListing | null> {
  try {
    const listings = await getJobListings(params)
    return listings.find((job) => job.id === jobId) || null
  } catch (error) {
    console.error("Failed to fetch job details:", error)
    return null
  }
}
