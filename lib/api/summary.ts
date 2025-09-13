import axios from "axios";
import { dataManager } from "../utils/data-manager";
import { useTitle } from "./AssestmentContext";
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
export async function getDashboardSummary(userId?: string): Promise<DashboardSummary> {
  const lastAssessment = dataManager.getLocalStorage("last-assessment");
  
  // Build payload from saved data (fallback to defaults if missing)
  const payload = lastAssessment?.data ?? {
    name: "John Doe",
    workExperience: "2 years as a web developer",
    educationLevel: "Bachelor of Computer Science",
    interests: ["Web Development", "Data Science", "AI"], // Fixed typo: intrests -> interests
    skills: {
      communication: "Good",
      teamwork: "Excellent",
      problem_solving: "Strong",
    },
  };

  console.log("Sending payload to API:", payload);

  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:5000/api",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 20000, // 10 second timeout
      }
    );

    console.log("Raw API Response:", response.data);

  const data = response?.data?.llmResponse || response?.data;

    
    console.log("Raw API Response:", data);
    if (!data) {
      console.warn("No llmResponse in API response, using fallback data");
      return FALLBACK_DASHBOARD_DATA;
    }

    console.log("Extracted llmResponse:", data);

    // Validate and extract career match scores with fallback
    let topCareer = FALLBACK_DASHBOARD_DATA.topCareer;
    let careerTitles: string[] = []
    let careerScores: number[] = []
    if (data.careerMatchScores && Object.keys(data.careerMatchScores).length > 0) {
      try {
        const topCareerEntry = Object.entries(data.careerMatchScores)
          .filter(([_, scoreData]) => scoreData && typeof scoreData.score === 'number')
          .sort((a, b) => b[1].score - a[1].score)[0];

        if (topCareerEntry) {
          topCareer = {
            title: topCareerEntry[0],
            matchScore: Math.round(topCareerEntry[1].score),
            category: determineCategory(topCareerEntry[0]),
            };
            title_for_user.title=topCareerEntry[0]
             localStorage.setItem('selected-career', JSON.stringify(topCareerEntry[0])); 
            
    careerTitles = Object.keys(data.careerMatchScores);
    careerScores = Object.values(data.careerMatchScores).map(item => item.score);

        }
      } catch (error) {
        console.warn("Error processing career match scores:", error);
      }
    } else {
      console.warn("careerMatchScores is undefined or empty, using fallback");
    }

    // Extract skills analysis with fallbacks
    const skillsAnalysis = {
      strengths: data.skillAnalysis?.strengths || FALLBACK_DASHBOARD_DATA.skillsAnalysis.strengths,
      gaps: data.skillAnalysis?.areas_to_improve || FALLBACK_DASHBOARD_DATA.skillsAnalysis.gaps,
      recommendations: data.skillAnalysis?.recommendations || FALLBACK_DASHBOARD_DATA.skillsAnalysis.recommendations,
    };

    // Calculate progress metrics
    const resourceCount = data.learningResources 
      ? Object.values(data.learningResources).flat().length 
      : FALLBACK_DASHBOARD_DATA.progressMetrics.resourcesViewed;

    const progressMetrics = {
      assessmentComplete: true,
      resourcesViewed: resourceCount,
      skillsImproved: skillsAnalysis.strengths.length,
      careerExplored: data.careerMatchScores ? Object.keys(data.careerMatchScores).length : 5,
    };

     const result: DashboardSummary = {
      topCareer,
      skillsAnalysis,
      progressMetrics,
      nextSteps: data.yourNextSteps || FALLBACK_DASHBOARD_DATA.nextSteps,
    };

    console.log("Final processed result:", result);
    return result;

  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        console.warn("API server not reachable, using fallback data");
      } else if (error.response?.status) {
        console.warn(`API returned ${error.response.status}: ${error.response.statusText}`);
      } else if (error.code === 'ECONNABORTED') {
        console.warn("API request timed out");
      }
    }
    
    // Return fallback data instead of throwing error
    console.log("Returning fallback data due to API error");
    return FALLBACK_DASHBOARD_DATA;
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

// Optional: Add a function to test API connection
export async function testApiConnection(): Promise<boolean> {
  try {
    const response = await axios.get("http://localhost:5000/api", {
      timeout: 20000,
    });
    return response.status === 200;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}

export { title_for_user };