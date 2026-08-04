const LLM_BASE_URL = process.env.LLM_SERVICE_BASE_URL || "http://localhost:11435";
const DEFAULT_MODEL = process.env.LLM_MODEL || "llama3.2:1b";
const { recordAssessment } = require("../lib/stateStore");

const REQUIRED_FIELDS = ["name", "workExperience", "educationLevel"];

const cleanJsonString = (text = "") => text.replace(/```(?:json)?/gi, "").trim();

const parseLlmContent = (content) => {
  if (!content) {
    throw new Error("LLM response did not include content");
  }

  try {
    return JSON.parse(cleanJsonString(content));
  } catch (error) {
    throw new Error("LLM response was not valid JSON");
  }
};

const validateAssessmentPayload = (body = {}) => {
  const errors = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
      errors.push(`${field} is required`);
    }
  });

  const interests = Array.isArray(body.interests)
    ? body.interests
        .map((interest) => (typeof interest === "string" ? interest.trim() : String(interest || "")).trim())
        .filter(Boolean)
    : [];
  if (interests.length === 0) {
    errors.push("interests must be a non-empty array");
  }

  const skills = body.skills;
  if (!skills || typeof skills !== "object" || Array.isArray(skills)) {
    errors.push("skills must be an object");
  }

  const normalizedSkills =
    skills && typeof skills === "object" && !Array.isArray(skills)
      ? Object.entries(skills).reduce((acc, [key, value]) => {
          acc[String(key).trim()] = value;
          return acc;
        }, {})
      : {};

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      name: body.name?.trim() || "",
      workExperience: body.workExperience?.trim() || "",
      educationLevel: body.educationLevel?.trim() || "",
      interests,
      skills: normalizedSkills,
      preferences: body.preferences && typeof body.preferences === "object" ? body.preferences : {},
    },
  };
};

const apiController = {
  getMethod: (_req, res) => {
    res.json({ status: "ok" });
  },
  postMethod: async (req, res) => {
    const { isValid, errors, data } = validateAssessmentPayload(req.body);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid assessment payload", details: errors });
    }

    const llmRequest = {
      model: DEFAULT_MODEL,
      stream: false,
      messages: [
        {
          role: "system",
          content: `You are a professional career guidance system that analyzes a student's profile (name, work experience, education level, interests, and skills) and suggests a suitable career role in a structured JSON format.

In your analysis, provide:

1. A single recommended role.
2. Career match scores (0-100) for these roles: software_development, data_science, project_management, ux_ui_design, digital_marketing, cybersecurity, cloud_engineering, product_management, business_analysis, artificial_intelligence.
3. A skillAnalysis object with strengths, areas_to_improve, and recommendations (three concise bullet items each).
4. "yourNextSteps" containing 4 sequential, actionable steps.
5. "learningResources" with at least two curated links for every role listed above.

Return only JSON following this contract:
{
  "llmResponse": {
    "recommendedRole": "string",
    "careerMatchScores": { "role_name": { "score": number } },
    "skillAnalysis": {
      "strengths": ["string"],
      "areas_to_improve": ["string"],
      "recommendations": ["string"]
    },
    "yourNextSteps": ["string"],
    "learningResources": { "role_name": ["url"] }
  }
}
`,
        },
        {
          role: "user",
          content: JSON.stringify(data),
        },
      ],
    };

    try {
      const response = await fetch(`${LLM_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(llmRequest),
      });

      if (!response.ok) {
        throw new Error(`LLM request failed with status ${response.status}`);
      }

      const llmResponse = await response.json();
      const parsed = parseLlmContent(llmResponse?.message?.content);
      const normalized = parsed.llmResponse || parsed;

      recordAssessment({
        payload: data,
        response: { llmResponse: normalized },
        timestamp: new Date().toISOString(),
      });

      return res.json({ llmResponse: normalized });
    } catch (error) {
      console.error("LLM service error:", error.message);
      return res.status(502).json({ error: "Failed to contact LLM service" });
    }
  },
};

module.exports = apiController;
