export const EDUCATION_LEVELS = [
  { value: "high-school", label: "High School", icon: "🎓" },
  { value: "associate", label: "Associate Degree", icon: "📚" },
  { value: "bachelor", label: "Bachelor's Degree", icon: "🎓" },
  { value: "master", label: "Master's Degree", icon: "📖" },
  { value: "phd", label: "PhD/Doctorate", icon: "🔬" },
  { value: "bootcamp", label: "Bootcamp/Certificate", icon: "💻" },
  { value: "self-taught", label: "Self-Taught", icon: "🧠" },
]

export const INTEREST_CATEGORIES = [
  { value: "technology", label: "Technology", icon: "💻", color: "bg-blue-100 text-blue-800" },
  { value: "design", label: "Design", icon: "🎨", color: "bg-purple-100 text-purple-800" },
  { value: "healthcare", label: "Healthcare", icon: "🏥", color: "bg-green-100 text-green-800" },
  { value: "business", label: "Business", icon: "💼", color: "bg-orange-100 text-orange-800" },
  { value: "education", label: "Education", icon: "📚", color: "bg-yellow-100 text-yellow-800" },
  { value: "finance", label: "Finance", icon: "💰", color: "bg-emerald-100 text-emerald-800" },
  { value: "marketing", label: "Marketing", icon: "📈", color: "bg-pink-100 text-pink-800" },
  { value: "science", label: "Science", icon: "🔬", color: "bg-indigo-100 text-indigo-800" },
]

export const SKILL_CATEGORIES = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Creativity",
  "Technical Skills",
  "Analytical Thinking",
  "Teamwork",
  "Time Management",
  "Adaptability",
  "Critical Thinking",
]

export const COMPANY_LOGOS = [
  { name: "Google", logo: "/google-logo.png" },
  { name: "Microsoft", logo: "/microsoft-logo.png" },
  { name: "Apple", logo: "/apple-logo.png" },
  { name: "Amazon", logo: "/amazon-logo.png" },
  { name: "Meta", logo: "/meta-logo-abstract.png" },
  { name: "Netflix", logo: "/netflix-inspired-logo.png" },
]

export const SOCIAL_PROOF_STATS = [
  { label: "Career Paths Discovered", value: "50,000+" },
  { label: "Students Guided", value: "25,000+" },
  { label: "Success Rate", value: "94%" },
  { label: "Partner Companies", value: "500+" },
]

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
