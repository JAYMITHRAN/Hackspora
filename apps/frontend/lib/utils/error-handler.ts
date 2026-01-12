// Centralized error handling and user feedback
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500,
    public userMessage?: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR", 400, `Please check your ${field || "input"} and try again.`)
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, "NETWORK_ERROR", 0, "Connection issue. Please check your internet and try again.")
  }
}

export class APIError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, "API_ERROR", statusCode, "Something went wrong. Please try again later.")
  }
}

export function handleError(error: unknown): AppError {
  console.error("Error occurred:", error)

  if (error instanceof AppError) {
    return error
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new NetworkError("Network request failed")
  }

  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR", 500, "An unexpected error occurred.")
  }

  return new AppError("Unknown error", "UNKNOWN_ERROR", 500, "An unexpected error occurred.")
}

export function getErrorMessage(error: unknown): string {
  const appError = handleError(error)
  return appError.userMessage || appError.message
}

// Error reporting (for production use)
export function reportError(error: AppError, context?: Record<string, any>): void {
  // In production, this would send to error tracking service
  console.error("Error Report:", {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
  })
}
