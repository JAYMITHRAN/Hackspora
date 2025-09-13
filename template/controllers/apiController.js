// Correct way to export controller methods
const content = {
  name: "",
  workExperience: "",
  educationLevel: "",
  intrests: [],
  skills: {},
};
const apiController = {
  getMethod: (req, res) => {
    res.send("GET method works!");
  },
  postMethod: async (req, res) => {
    content.name = req.body.name;
    content.workExperience = req.body.workExperience;
    content.educationLevel = req.body.educationLevel;
    content.intrests = req.body.intrests;
    content.skills = req.body.skills;

   const payload = {
  model: "llama3.2:1b",
  messages: [
    {
      role: "system",
      content: `You are a professional career guidance system that analyzes a student's profile (name, work experience, education level, interests, and skills) and suggests a suitable career role in a structured JSON format.

In your analysis, provide:

1. A single recommended role.

2. Career match scores (from 0 to 100) for 10 key roles:
   - software_development
   - data_science
   - project_management
   - ux_ui_design
   - digital_marketing
   - cybersecurity
   - cloud_engineering
   - product_management
   - business_analysis
   - artificial_intelligence

3. A detailed skill analysis object with:
   - strengths: An array of 3 meaningful strings summarizing core strengths.
   - areas_to_improve: An array of 3 meaningful strings summarizing areas to improve.
   - recommendations: An array of 3 actionable strings as next steps.

4. A field yourNextSteps that contains 4 practical, sequential next steps the user should take to grow their career.  
   Example:
   "yourNextSteps": [
     "Step 1: Learn fundamentals of programming",
     "Step 2: Build small projects",
     "Step 3: Apply for internships",
     "Step 4: Work on advanced specializations"
   ]

Your response must return only the following JSON object, no explanation, no additional text:
{
  "llmResponse": {
    "recommendedRole": "string",

    "careerMatchScores": {
      "software_development": { "score": "number" },
      "data_science": { "score": "number" },
      "project_management": { "score": "number" },
      "ux_ui_design": { "score": "number" },
      "digital_marketing": { "score": "number" },
      "cybersecurity": { "score": "number" },
      "cloud_engineering": { "score": "number" },
      "product_management": { "score": "number" },
      "business_analysis": { "score": "number" },
      "artificial_intelligence": { "score": "number" }
    },

    "skillAnalysis": {
      "strengths": [
        "string",
        "string",
        "string"
      ],
      "areas_to_improve": [
        "string",
        "string",
        "string"
      ],
      "recommendations": [
        "string",
        "string",
        "string"
      ]
    },

    "yourNextSteps": [
      "string",
      "string",
      "string",
      "string"
    ],

    "learningResources": {
      "software_development": [
        "string",
        "string"
      ],
      "data_science": [
        "string",
        "string"
      ],
      "ux_ui_design": [
        "string",
        "string"
      ],
      "project_management": [
        "string",
        "string"
      ],
      "digital_marketing": [
        "string",
        "string"
      ],
      "cybersecurity": [
        "string",
        "string"
      ],
      "cloud_engineering": [
        "string",
        "string"
      ],
      "product_management": [
        "string",
        "string"
      ],
      "business_analysis": [
        "string",
        "string"
      ],
      "artificial_intelligence": [
        "string",
        "string"
      ]
    }
  }
}
`,
    },
    {
      role: "user",
      content: JSON.stringify(content),
    },
  ],
  stream: false,
};
    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Properly stringified
      });

      const result = await response.json(); // Parse the response body
      console.log("LLM service response:", result);
          return res.send(result.message.content);
    } catch (error) {
      console.error("LLM service error:", error.message);
      return res.status(500).json({ error: "Failed to contact LLM service" });
    }
  },
};

module.exports = apiController;
