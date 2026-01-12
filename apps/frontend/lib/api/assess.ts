import { apiClient } from "@/lib/utils/api-client"
import { dataManager } from "@/lib/utils/data-manager"

export interface AssessmentPreferences {
  name?: string
  age?: string
  location?: string
  [key: string]: unknown
}

export interface AssessmentData {
  educationLevel: string
  interests: string[]
  skills: Record<string, number>
  experience: string
  preferences: AssessmentPreferences
}

export interface AssessmentPayload {
  name: string
  workExperience: string
  educationLevel: string
  interests: string[]
  skills: Record<string, string>
  preferences: {
    age?: string
    location?: string
  }
}

export interface AssessmentResponse {
  llmResponse: Record<string, any>
}

interface StoredAssessment {
  payload: AssessmentPayload
  response?: AssessmentResponse
  timestamp: string
}

export async function submitAssessment(data: AssessmentData): Promise<AssessmentResponse> {
  if (!dataManager.validateAssessmentData(data)) {
    throw new Error("Invalid assessment data")
  }

  try {
    const payload = dataManager.transformAssessmentForAPI(data) as AssessmentPayload
    const response = await apiClient.post<AssessmentResponse>("/api", payload)

    const stored: StoredAssessment = {
      payload,
      response,
      timestamp: new Date().toISOString(),
    }

    dataManager.setLocalStorage("last-assessment", stored)
    dataManager.setLocalStorage("assessment-data", data)

    return response
  } catch (error) {
    console.error("Assessment submission failed:", error)
    throw error instanceof Error ? error : new Error("Failed to submit assessment")
  }
}

export async function getAssessmentHistory(): Promise<any[]> {
  try {
    const cached = dataManager.get<any[]>("assessment-history")
    if (cached) {
      return cached
    }

    const history = await apiClient.get<any[]>("/assessments/history")
    dataManager.set("assessment-history", history)
    return history
  } catch (error) {
    console.error("Failed to fetch assessment history:", error)

    const localHistory = dataManager.getLocalStorage<StoredAssessment>("last-assessment")
    return localHistory ? [localHistory] : []
  }
}

export async function retakeAssessment(): Promise<void> {
  dataManager.invalidate("assessment-history")
  dataManager.removeLocalStorage("assessment-data")
  dataManager.removeLocalStorage("last-assessment")
}
