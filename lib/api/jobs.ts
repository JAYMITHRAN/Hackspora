import axios from "axios"
import { title_for_user } from "./summary"
export interface JobListing {
  id: string
  title: string
  website: string
  url: string
  description: string
  created_at: string
  published_at: string
  education_requirements?: string
  experience_requirements?: string
}

export interface JobSearchParams {
  query?: string
  page?: number
  limit?: number
}

export async function getJobListings(params: JobSearchParams = {}): Promise<JobListing[]> {
  try {
    const { query = `${title_for_user.title}` } = params
    console.log(params)
    const res = await axios.get(`http://localhost:5000/api/job/${params.query}`, )

    let data = res.data

    // ✅ ensure data is always an array
    if (!Array.isArray(data)) {
      data = [data]
    }

    return data
  } catch (error: any) {
    console.error("Failed to fetch job listings:", error?.response?.data || error.message)
    throw new Error("Failed to load job listings. Please try again.")
  }
}

export async function getJobDetails(jobId: string): Promise<JobListing | null> {
  try {
    const res = await axios.get(`http://localhost:5000/api/job/${jobId}`)
    return res.data || null
  } catch (error) {
    console.error("Failed to fetch job details:", error)
    return null
  }
}
