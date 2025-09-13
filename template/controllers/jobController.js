
const jobController  = {
  getMethod: async(req,res)=>{

    const role = req.params.role;
   const payload = {
  model: "llama3.2:1b",
  messages: [
    {
      role: "system",
      content: `You are a smart job listing generator.

Given the following example job data, generate 5 similar job listings for the role: **"Digital Marketing Specialist"** in the same JSON format. Vary the companies, locations, and URLs, but keep the role title consistent. Ensure that all fields match the structure exactly.
Your response must return only the following JSON object, no explanation, no additional text: 
[
{
  "id": "68c453052715058d7507c976",
  "title": "Digital Marketing Specialist at Meta in Menlo Park, California",
  "website": "www.metacareers.com",
  "url": "https://www.metacareers.com/jobs/123456789",
  "description": "Meta is hiring a Digital Marketing Specialist to create and optimize campaigns across social media platforms. You will analyze campaign performance, manage budgets, and work with creative teams to maximize ROI.",
  "created_at": "2025-09-12T08:00:00.000Z",
  "published_at": "2025-09-12T08:00:00.000Z",
  "education_requirements": "Bachelor's degree in Marketing, Business, or related field. 2+ years of experience in digital marketing, SEO, or paid media campaigns."
}
    ]
Respond ONLY with an array of 10 job JSON objects in the exact same structure.
`
    },
    {
      role: "user",
      content: JSON.stringify(
        `job vacancies accross various companies for the role: **"${role}"**`
      ),
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
      console.log(result.message.content);
      const dataArray = result.message.content;
      let clean = dataArray.replace(/```/g, "").trim(); 
      return res.send(
        clean
      );
      //
    } catch (error) {
      console.error("LLM service error:", error.message);
      return res.status(500).json({ error: "Failed to contact LLM service" });
    }
  },

  
}
module.exports = jobController;