import { API_BASE_URL } from "./constants"

// Centralized API client for all backend communications
class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(baseUrl = API_BASE_URL || "/api") {
    this.baseUrl = baseUrl
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        ...this.headers,
        ...(options.headers || {}),
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const contentType = response.headers.get("content-type") || ""
      const isJson = contentType.includes("application/json")
      const payload = isJson ? await response.json() : await response.text()

      if (!response.ok) {
        const errorMessage =
          typeof payload === "string"
            ? payload || response.statusText
            : payload?.error || payload?.message || response.statusText

        const error = new Error(`API Error: ${errorMessage}`)
        if (typeof payload === "object" && payload !== null) {
          ;(error as Error & { details?: unknown }).details = payload.details
        }
        throw error
      }

      return payload as T
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  setAuthToken(token: string) {
    this.headers["Authorization"] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.headers["Authorization"]
  }
}

export const apiClient = new ApiClient()
