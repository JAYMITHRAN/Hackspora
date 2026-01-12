// Data management utilities for caching and state management
interface CacheItem<T> {
  data: T
  timestamp: number
  expiry: number
}

class DataManager {
  private cache = new Map<string, CacheItem<any>>()
  private readonly DEFAULT_CACHE_TIME = 5 * 60 * 1000 // 5 minutes

  // Cache management
  set<T>(key: string, data: T, cacheTime = this.DEFAULT_CACHE_TIME): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + cacheTime,
    }
    this.cache.set(key, item)
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Local storage utilities
  setLocalStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  getLocalStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Failed to read from localStorage:", error)
      return null
    }
  }

  removeLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Failed to remove from localStorage:", error)
    }
  }

  // Session management
  setSession<T>(key: string, data: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save to sessionStorage:", error)
    }
  }

  getSession<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Failed to read from sessionStorage:", error)
      return null
    }
  }

  // Data validation
  validateAssessmentData(data: any): boolean {
    if (!data) {
      return false
    }

    const hasBasics = Boolean(data.educationLevel && data.experience)
    const hasInterests = Array.isArray(data.interests) && data.interests.length > 0
    const hasSkills = data.skills && typeof data.skills === "object" && Object.keys(data.skills).length > 0
    const hasName = Boolean(data.preferences?.name)

    return hasBasics && hasInterests && hasSkills && hasName
  }

  validateUserProfile(profile: any): boolean {
    return !!(profile && profile.name && typeof profile.name === "string" && profile.name.trim().length > 0)
  }

  // Data transformation utilities
  private describeExperience(experience: string) {
    switch ((experience || "").toLowerCase()) {
      case "none":
        return "No professional experience yet"
      case "entry":
        return "0-2 years of experience"
      case "mid":
        return "3-5 years of experience"
      case "senior":
        return "5+ years of experience"
      default:
        return experience || "Experience not specified"
    }
  }

  private normalizeSkills(skills: Record<string, number | string> = {}) {
    return Object.entries(skills).reduce<Record<string, string>>((acc, [key, value]) => {
      const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, "_")
      const score = typeof value === "number" ? value : Number.NaN

      let descriptor: string
      if (!Number.isNaN(score)) {
        if (score >= 8) descriptor = "Expert"
        else if (score >= 6) descriptor = "Advanced"
        else if (score >= 4) descriptor = "Intermediate"
        else descriptor = "Beginner"
      } else {
        descriptor = String(value)
      }

      acc[normalizedKey] = descriptor
      return acc
    }, {})
  }

  transformAssessmentForAPI(data: any) {
    const interests = Array.isArray(data.interests)
      ? Array.from(
          new Set(
            data.interests
              .map((interest: string) => (typeof interest === "string" ? interest.trim() : ""))
              .filter(Boolean),
          ),
        )
      : []

    return {
      name: data.preferences?.name?.trim() || "Student",
      workExperience: this.describeExperience(data.experience),
      educationLevel: data.educationLevel,
      interests,
      skills: this.normalizeSkills(data.skills || {}),
      preferences: {
        age: data.preferences?.age || "",
        location: data.preferences?.location || "",
      },
    }
  }

  transformCareerFromAPI(apiData: any) {
    return {
      id: apiData.id,
      title: apiData.title,
      description: apiData.description,
      matchScore: apiData.match_score || apiData.matchScore,
      requiredSkills: apiData.required_skills || apiData.requiredSkills,
      salaryRange: apiData.salary_range || apiData.salaryRange,
      growthRate: apiData.growth_rate || apiData.growthRate,
      category: apiData.category,
    }
  }
}

export const dataManager = new DataManager()
