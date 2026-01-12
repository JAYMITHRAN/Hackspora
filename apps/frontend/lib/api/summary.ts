import { apiClient } from "../utils/api-client";
import { dataManager } from "../utils/data-manager";
import type { AssessmentPayload, AssessmentResponse } from "./assess";
export interface DashboardSummary {
  topCareer: {
    title: string;
    matchScore: number;
    category: string;
  };
  skillsAnalysis: {
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  };
  progressMetrics: {
    assessmentComplete: boolean;
    resourcesViewed: number;
    skillsImproved: number;
    careerExplored: number;
  };
  nextSteps: string[];
  careerTitles?: string[];
  careerScores?: number[];
}
interface ApiResponse {
  llmResponse: {
    recommendedRole?: string;
    careerMatchScores?: Record<string, { score: number }>;
    skillAnalysis?: {
      strengths?: string[];
      areas_to_improve?: string[];
      recommendations?: string[];
    };
    yourNextSteps?: string[];
    learningResources?: Record<string, string[]>;
  };
}

interface StoredAssessment {
  payload: AssessmentPayload;
  response?: AssessmentResponse;
  timestamp: string;
}

const DEFAULT_ASSESSMENT_PAYLOAD: AssessmentPayload = {
  name: "John Doe",
  workExperience: "2 years as a web developer",
  educationLevel: "Bachelor of Computer Science",
  interests: ["Web Development", "Data Science", "AI"],
  skills: {
    communication: "Good",
    teamwork: "Excellent",
    problem_solving: "Strong",
  },
  preferences: {
    age: "22",
    location: "Remote",
  },
};

// Fallback data structure
const FALLBACK_DASHBOARD_DATA: DashboardSummary = {
  topCareer: {
    title: "Software Developer",
    matchScore: 85,
    category: "Technology"
  },
  skillsAnalysis: {
    strengths: ["Problem Solving", "Technical Skills", "Analytical Thinking"],
    gaps: ["Communication", "Leadership", "Project Management"],
    recommendations: [
      "Improve communication skills through practice",
      "Take on leadership roles in projects", 
      "Learn project management methodologies"
    ]
  },
  progressMetrics: {
    assessmentComplete: true,
    resourcesViewed: 8,
    skillsImproved: 3,
    careerExplored: 5
  },
  nextSteps: [
    "Complete skill development courses",
    "Build a strong portfolio",
    "Network with industry professionals",
    "Apply for entry-level positions"
  ]
};

const title_for_user = {
  "title": ""
}
const buildDashboardSummary = (data: ApiResponse["llmResponse"] | undefined): DashboardSummary => {
  if (!data) {
    return FALLBACK_DASHBOARD_DATA
  }

  let topCareer = FALLBACK_DASHBOARD_DATA.topCareer
  if (data.careerMatchScores && Object.keys(data.careerMatchScores).length > 0) {
    try {
      const topCareerEntry = Object.entries(data.careerMatchScores)
        .filter(([_, scoreData]) => scoreData && typeof scoreData.score === "number")
        .sort((a, b) => b[1].score - a[1].score)[0]

      if (topCareerEntry) {
        topCareer = {
          title: topCareerEntry[0],
          matchScore: Math.round(topCareerEntry[1].score),
          category: determineCategory(topCareerEntry[0]),
        }
        title_for_user.title = topCareerEntry[0]
        if (typeof window !== "undefined") {
          localStorage.setItem("selected-career", JSON.stringify(topCareerEntry[0]))
        }
      }
    } catch (error) {
      console.warn("Error processing career match scores:", error)
    }
  }

  const skillsAnalysis = {
    strengths: data.skillAnalysis?.strengths || FALLBACK_DASHBOARD_DATA.skillsAnalysis.strengths,
    gaps: data.skillAnalysis?.areas_to_improve || FALLBACK_DASHBOARD_DATA.skillsAnalysis.gaps,
    recommendations: data.skillAnalysis?.recommendations || FALLBACK_DASHBOARD_DATA.skillsAnalysis.recommendations,
  }

  const resourceCount = data.learningResources
    ? Object.values(data.learningResources).flat().length
    : FALLBACK_DASHBOARD_DATA.progressMetrics.resourcesViewed

  const progressMetrics = {
    assessmentComplete: true,
    resourcesViewed: resourceCount,
    skillsImproved: skillsAnalysis.strengths.length,
    careerExplored: data.careerMatchScores ? Object.keys(data.careerMatchScores).length : 5,
  }

  return {
    topCareer,
    skillsAnalysis,
    progressMetrics,
    nextSteps: data.yourNextSteps || FALLBACK_DASHBOARD_DATA.nextSteps,
  }
}

export async function getDashboardSummary(userId?: string): Promise<DashboardSummary> {
  const lastAssessment = dataManager.getLocalStorage<StoredAssessment>("last-assessment")
  const payload = lastAssessment?.payload ?? DEFAULT_ASSESSMENT_PAYLOAD

  try {
    const response = await apiClient.post<ApiResponse>("/api", payload)
    const normalized = response?.llmResponse || (response as any)

    dataManager.setLocalStorage("last-assessment", {
      payload,
      response,
      timestamp: new Date().toISOString(),
    })

    return buildDashboardSummary(normalized)
  } catch (error) {
    console.error("Error fetching dashboard summary:", error)

    if (lastAssessment?.response?.llmResponse) {
      console.warn("Using cached assessment summary due to API error")
      return buildDashboardSummary(lastAssessment.response.llmResponse)
    }

    return FALLBACK_DASHBOARD_DATA
  }
}

// Helper function to determine career category
function determineCategory(careerTitle: string): string {
  const title = careerTitle.toLowerCase();
  
  if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
    return 'Design';
  } else if (title.includes('manage') || title.includes('lead') || title.includes('director')) {
    return 'Management';
  } else if (title.includes('market') || title.includes('sales') || title.includes('business')) {
    return 'Business';
  } else if (title.includes('data') || title.includes('analyst') || title.includes('scientist')) {
    return 'Analytics';
  } else if (title.includes('develop') || title.includes('engineer') || title.includes('tech') || title.includes('software')) {
    return 'Technology';
  } else {
    return 'General';
  }
}

export async function testApiConnection(): Promise<boolean> {
  try {
    await apiClient.get("/api")
    return true
  } catch (error) {
    console.error("API health check failed:", error)
    return false
  }
}

export { title_for_user };