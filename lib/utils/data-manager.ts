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
    return !!(
      data &&
      data.educationLevel &&
      data.interests &&
      Array.isArray(data.interests) &&
      data.interests.length > 0 &&
      data.skills &&
      typeof data.skills === "object"
    )
  }

  validateUserProfile(profile: any): boolean {
    return !!(profile && profile.name && typeof profile.name === "string" && profile.name.trim().length > 0)
  }

  // Data transformation utilities
  transformAssessmentForAPI(data: any) {
    return {
      education_level: data.educationLevel,
      interests: data.interests,
      skills: data.skills,
      experience: data.experience,
      preferences: data.preferences,
      timestamp: new Date().toISOString(),
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
