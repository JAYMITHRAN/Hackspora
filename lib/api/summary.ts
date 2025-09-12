import axios from "axios";

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
  
    careerMatchScores: Record<string, { score: number }>;
  nextSteps: string[];
}

interface ApiResponse {
  llmResponse: {
    recommendedRole: string;
    careerMatchScores: Record<string, { score: number }>;
    skillAnalysis: {
      strengths: string[];
      areas_to_improve: string[];
      recommendations: string[];
    };
    yourNextSteps: string[];
    learningResources: Record<string, string[]>;
  };
}

export async function getDashboardSummary(
  userId?: string,
): Promise<DashboardSummary> {
  const payload = {
    name: "John Doe",
    workExperience: "2 years as a web developer",
    educationLevel: "Bachelor of Computer Science",
    intrests: ["Web Development", "Data Science", "AI"],
    skills: {
      communication: "Good",
      teamwork: "Excellent",
      problem_solving: "Strong",
    },
  };

  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:5000/api",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = response.data.llmResponse;

    // Pick topCareer by highest score
    const topCareerEntry = Object.entries(data.careerMatchScores).sort(
      (a, b) => b[1].score - a[1].score,
    )[0];

    return {
      topCareer: {
        title: topCareerEntry[0],
        matchScore: topCareerEntry[1].score,
        category: topCareerEntry[0].includes("Design") ? "Design" : "Tech",
      },

      skillsAnalysis: {
        strengths: data.skillAnalysis.strengths,
        gaps: data.skillAnalysis.areas_to_improve,
        recommendations: data.skillAnalysis.recommendations,
      },
      progressMetrics: {
        assessmentComplete: true, // Hardcoded; adjust if you have API data
        resourcesViewed: Object.values(data.learningResources).flat().length,
        skillsImproved: data.skillAnalysis.strengths.length,
        careerExplored: Object.keys(data.careerMatchScores).length,
      },
      nextSteps: data.yourNextSteps,
      careerMatchScores: data.careerMatchScores,
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
}