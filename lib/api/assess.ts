import { apiClient } from "@/lib/utils/api-client"
import { dataManager } from "@/lib/utils/data-manager"

export interface AssessmentData {
  educationLevel: string
  interests: string[]
  skills: Record<string, number>
  experience: string
  preferences: Record<string, any>
}

export interface AssessmentResponse {
  success: boolean
  assessmentId: string
  message: string
  recommendations?: any[]
}

export async function submitAssessment(data: AssessmentData): Promise<AssessmentResponse> {
  // Validate data before submission
  if (!dataManager.validateAssessmentData(data)) {
    throw new Error("Invalid assessment data")
  }

  try {
    // Transform data for API
    const apiData = dataManager.transformAssessmentForAPI(data)

    // Check cache first
    const cacheKey = `assessment-${JSON.stringify(apiData).slice(0, 50)}`
    const cached = dataManager.get<AssessmentResponse>(cacheKey)

    if (cached) {
      console.log("Returning cached assessment result")
      return cached
    }

    // Make API call (currently stubbed)
    console.log("Submitting assessment:", apiData)

    // Simulate API call with realistic delay
    const response = await new Promise<AssessmentResponse>((resolve) => {
      setTimeout(() => {
        const result: AssessmentResponse = {
          success: true,
          assessmentId: Math.random().toString(36).substr(2, 9),
          message: "Assessment submitted successfully",
          recommendations: [
            { careerId: "ux-designer", score: 92 },
            { careerId: "frontend-developer", score: 88 },
            { careerId: "product-manager", score: 85 },
          ],
        }
        resolve(result)
      }, 1000)
    })

    // Cache the response
    dataManager.set(cacheKey, response, 10 * 60 * 1000) // 10 minutes

    // Save to local storage for persistence
    dataManager.setLocalStorage("last-assessment", {
      data: apiData,
      response,
      timestamp: new Date().toISOString(),
    })

    return response
  } catch (error) {
    console.error("Assessment submission failed:", error)
    throw new Error("Failed to submit assessment. Please try again.")
  }
}

export async function getAssessmentHistory(): Promise<any[]> {
  try {
    // Check cache first
    const cached = dataManager.get<any[]>("assessment-history")
    if (cached) {
      return cached
    }

    // Simulate API call
    const history = await apiClient.get<any[]>("/assessments/history")

    // Cache the result
    dataManager.set("assessment-history", history)

    return history
  } catch (error) {
    console.error("Failed to fetch assessment history:", error)

    const localHistory = dataManager.getLocalStorage("last-assessment")
    return localHistory ? [localHistory] : []
  }
}

export async function retakeAssessment(): Promise<void> {

  dataManager.invalidate("assessment-history")
  dataManager.removeLocalStorage("assessment-data")
  dataManager.removeLocalStorage("last-assessment")

  console.log("Assessment data cleared for retake")
}
