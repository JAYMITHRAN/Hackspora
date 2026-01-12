const LLM_BASE_URL = process.env.LLM_SERVICE_BASE_URL || "http://localhost:11435";
const DEFAULT_MODEL = process.env.LLM_MODEL || "llama3.2:1b";

const stripFence = (text = "") => text.replace(/```(?:json)?/gi, "").trim();

const ensureString = (value) => (typeof value === "string" ? value.trim() : "");

const ensureIsoDate = (value) => {
  const candidate = ensureString(value);
  const date = candidate ? new Date(candidate) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const sanitizeUrl = (value) => {
  const candidate = ensureString(value);
  if (!candidate) return null;

  try {
    const prefixed = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
    const parsed = new URL(prefixed);
    if (!parsed.host) {
      return null;
    }
    return parsed.toString();
  } catch (error) {
    return null;
  }
};

const coerceBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "remote"].includes(normalized)) return true;
    if (["false", "no", "onsite"].includes(normalized)) return false;
  }
  return null;
};

const normalizeJob = (job, index, fallbackRole) => {
  if (!job || typeof job !== "object") {
    throw new Error("Invalid job payload");
  }

  const role = ensureString(job.role) || ensureString(job.title) || fallbackRole || "Opportunity";
  const company = ensureString(job.company) || "Confidential";
  const location = ensureString(job.location) || "Global";
  const baseTitle = ensureString(job.title) || `${role} at ${company} in ${location}`;
  const id = ensureString(job.id) || `${role.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}-${index}`;
  const url = sanitizeUrl(job.url) || sanitizeUrl(job.apply_url) || null;
  const website = ensureString(job.website) || (url ? new URL(url).host : "example.com");
  const description = ensureString(job.description) || "Description unavailable.";
  const salary = ensureString(job.salary_range || job.compensation);
  const jobType = ensureString(job.job_type) || "Full-time";
  const experienceLevel = ensureString(job.experience_level) || "Mid Level";
  const education = ensureString(job.education_requirements) || "Bachelor's degree or equivalent experience";
  const remoteFlag = coerceBoolean(job.remote);

  if (!url) {
    throw new Error("Missing apply URL");
  }

  return {
    id,
    title: baseTitle,
    role,
    company,
    location,
    website,
    url,
    description,
    salary_range: salary || "Competitive",
    job_type: jobType,
    experience_level: experienceLevel,
    remote: remoteFlag ?? /remote|anywhere|global/i.test(location),
    created_at: ensureIsoDate(job.created_at),
    published_at: ensureIsoDate(job.published_at || job.created_at),
    education_requirements: education,
    source: ensureString(job.source) || "llm-generated",
  };
};

const parseJobList = (content, role) => {
  const cleaned = stripFence(content);
  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error("LLM response was not valid JSON");
  }

  const rawJobs = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.jobs)
      ? parsed.jobs
      : null;

  if (!rawJobs) {
    throw new Error("LLM response did not contain a job array");
  }

  const normalized = rawJobs.reduce((acc, job, index) => {
    try {
      const normalizedJob = normalizeJob(job, index, role);
      acc.push(normalizedJob);
    } catch (error) {
      console.warn("Dropping invalid job entry", error.message);
    }
    return acc;
  }, []);

  if (!normalized.length) {
    throw new Error("LLM response did not provide any valid jobs");
  }

  return normalized;
};

const jobController = {
  getMethod: async (req, res) => {
    const rawRole = req.params.role;
    const role = typeof rawRole === "string" ? rawRole.trim() : "";

    if (!role) {
      return res.status(400).json({ error: "Role parameter is required" });
    }

    const llmRequest = {
      model: DEFAULT_MODEL,
      stream: false,
      messages: [
        {
          role: "system",
          content: `You are an AI job sourcing agent.

Return strictly valid JSON that matches this TypeScript interface:
{
  "jobs": Array<{
    "id": string,
    "title": string,
    "role": string,
    "company": string,
    "location": string,
    "website": string,
    "url": string,
    "description": string,
    "salary_range": string,
    "job_type": "Full-time" | "Part-time" | "Contract" | "Internship",
    "experience_level": "Entry" | "Mid" | "Senior" | "Lead",
    "remote": boolean,
    "created_at": string (ISO timestamp),
    "published_at": string (ISO timestamp),
    "education_requirements": string
  }>
}

Rules:
- Provide exactly 10 unique postings spanning multiple companies and regions.
- Use ISO 8601 timestamps within the last 90 days.
- Ensure URLs are https links that point to the employer career site or job board.
- Keep text concise and professional.
- Do not wrap the JSON with markdown fences or add commentary.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            role,
            instructions: "Generate diverse global openings across industries",
          }),
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
      const content = llmResponse?.message?.content;
      const jobs = parseJobList(content, role);

      return res.json({
        role,
        jobs,
        meta: {
          count: jobs.length,
          generated_at: new Date().toISOString(),
          source: "llm",
        },
      });
    } catch (error) {
      console.error("Job generation error:", error.message);
      const status = error.message?.startsWith("LLM response") ? 422 : 502;
      return res.status(status).json({ error: error.message || "Failed to generate job listings" });
    }
  },
};

module.exports = jobController;