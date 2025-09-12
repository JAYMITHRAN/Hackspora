export interface DashboardSummary {
  topCareer: {
    title: string
    matchScore: number
    category: string
  }
  skillsAnalysis: {
    strengths: string[]
    gaps: string[]
    recommendations: string[]
  }
  progressMetrics: {
    assessmentComplete: boolean
    resourcesViewed: number
    skillsImproved: number
    careerExplored: number
  }
  nextSteps: string[]
}

export async function getDashboardSummary(userId?: string) {
  // Stub for backend integration
  console.log("Fetching dashboard summary for user:", userId)

  // Simulate API call with dummy data
  return new Promise<DashboardSummary>((resolve) => {
    setTimeout(() => {
      resolve({
        topCareer: {
          title: "UX Designer",
          matchScore: 92,
          category: "Design",
        },
        skillsAnalysis: {
          strengths: ["Creative Thinking", "Problem Solving", "Communication"],
          gaps: ["Prototyping", "User Research", "Data Analysis"],
          recommendations: ["Take a UX research course", "Practice with Figma", "Build a portfolio"],
        },
        progressMetrics: {
          assessmentComplete: true,
          resourcesViewed: 5,
          skillsImproved: 2,
          careerExplored: 3,
        },
        nextSteps: [
          "Complete the UX Design Bootcamp",
          "Build 2-3 portfolio projects",
          "Apply for junior UX positions",
          "Network with other designers",
        ],
      })
    }, 900)
  })
}
