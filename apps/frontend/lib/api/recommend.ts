import { apiClient } from "@/lib/utils/api-client"
import { dataManager } from "@/lib/utils/data-manager"

export interface CareerRecommendation {
  id: string
  title: string
  description: string
  matchScore: number
  requiredSkills: string[]
  salaryRange: string
  growthRate: string
  category: string
}

export async function getCareerRecommendations(assessmentId?: string): Promise<CareerRecommendation[]> {
  try {
    // Check cache first
    const cacheKey = `recommendations-${assessmentId || "default"}`
    const cached = dataManager.get<CareerRecommendation[]>(cacheKey)

    if (cached) {
      console.log("Returning cached recommendations")
      return cached
    }

    // Get user context for personalized recommendations
    const assessmentData = dataManager.getLocalStorage("assessment-data")
    const userInterests = assessmentData?.interests || []
    const userSkills = assessmentData?.skills || {}

    console.log("Fetching career recommendations for:", assessmentId)

    // Simulate API call with personalized data
    const recommendations = await new Promise<CareerRecommendation[]>((resolve) => {
      setTimeout(() => {
        // Generate recommendations based on user interests
        const baseRecommendations = [
          {
            id: "ux-designer",
            title: "UX Designer",
            description: "Create intuitive and engaging user experiences for digital products",
            matchScore: 92,
            requiredSkills: ["Design Thinking", "Prototyping", "User Research", "Figma"],
            salaryRange: "$65k - $120k",
            growthRate: "13%",
            category: "Design",
          },
          {
            id: "frontend-developer",
            title: "Frontend Developer",
            description: "Build responsive and interactive web applications",
            matchScore: 88,
            requiredSkills: ["JavaScript", "React", "CSS", "HTML"],
            salaryRange: "$70k - $130k",
            growthRate: "22%",
            category: "Technology",
          },
          {
            id: "product-manager",
            title: "Product Manager",
            description: "Guide product development from conception to launch",
            matchScore: 85,
            requiredSkills: ["Strategy", "Analytics", "Communication", "Leadership"],
            salaryRange: "$90k - $160k",
            growthRate: "19%",
            category: "Business",
          },
          {
            id: "data-analyst",
            title: "Data Analyst",
            description: "Transform data into actionable business insights",
            matchScore: 82,
            requiredSkills: ["SQL", "Python", "Statistics", "Visualization"],
            salaryRange: "$60k - $110k",
            growthRate: "25%",
            category: "Technology",
          },
          {
            id: "marketing-specialist",
            title: "Digital Marketing Specialist",
            description: "Drive brand awareness and customer engagement through digital channels",
            matchScore: 78,
            requiredSkills: ["SEO", "Content Marketing", "Analytics", "Social Media"],
            salaryRange: "$45k - $85k",
            growthRate: "10%",
            category: "Marketing",
          },
        ]

        // Adjust match scores based on user interests and skills
        const personalizedRecommendations = baseRecommendations.map((rec) => {
          let adjustedScore = rec.matchScore

          // Boost score if career aligns with user interests
          if (userInterests.includes("technology") && rec.category === "Technology") {
            adjustedScore += 5
          }
          if (userInterests.includes("design") && rec.category === "Design") {
            adjustedScore += 5
          }
          if (userInterests.includes("business") && rec.category === "Business") {
            adjustedScore += 3
          }

          // Boost score based on existing skills
          const skillMatch = rec.requiredSkills.filter((skill) =>
            Object.keys(userSkills).some((userSkill) => userSkill.toLowerCase().includes(skill.toLowerCase())),
          ).length

          adjustedScore += skillMatch * 2

          return {
            ...rec,
            matchScore: Math.min(adjustedScore, 100),
          }
        })

        // Sort by match score
        personalizedRecommendations.sort((a, b) => b.matchScore - a.matchScore)

        resolve(personalizedRecommendations)
      }, 800)
    })

    // Cache the results
    dataManager.set(cacheKey, recommendations, 15 * 60 * 1000) // 15 minutes

    return recommendations
  } catch (error) {
    console.error("Failed to fetch recommendations:", error)
    throw new Error("Failed to load career recommendations")
  }
}

export async function getCareerDetails(careerId: string): Promise<CareerRecommendation | null> {
  try {
    // Check cache first
    const cacheKey = `career-${careerId}`
    const cached = dataManager.get<CareerRecommendation>(cacheKey)

    if (cached) {
      return cached
    }

    // Get from recommendations list
    const recommendations = await getCareerRecommendations()
    const career = recommendations.find((r) => r.id === careerId)

    if (career) {
      dataManager.set(cacheKey, career)
      return career
    }

    return null
  } catch (error) {
    console.error("Failed to fetch career details:", error)
    return null
  }
}

export async function saveCareerInterest(careerId: string): Promise<void> {
  try {
    // Save to local storage
    const savedCareers = dataManager.getLocalStorage<string[]>("saved-careers") || []
    if (!savedCareers.includes(careerId)) {
      savedCareers.push(careerId)
      dataManager.setLocalStorage("saved-careers", savedCareers)
    }

    // Also send to API for persistence
    await apiClient.post("/careers/save", { careerId })

    console.log("Career interest saved:", careerId)
  } catch (error) {
    console.error("Failed to save career interest:", error)
  }
}

export async function getSavedCareers(): Promise<string[]> {
  try {
    return dataManager.getLocalStorage<string[]>("saved-careers") || []
  } catch (error) {
    console.error("Failed to get saved careers:", error)
    return []
  }
}
