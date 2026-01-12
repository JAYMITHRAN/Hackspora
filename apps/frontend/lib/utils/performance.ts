// Performance monitoring and optimization utilities
class PerformanceMonitor {
  private metrics = new Map<string, number>()

  startTimer(label: string): void {
    this.metrics.set(label, performance.now())
  }

  endTimer(label: string): number {
    const startTime = this.metrics.get(label)
    if (!startTime) {
      console.warn(`Timer '${label}' was not started`)
      return 0
    }

    const duration = performance.now() - startTime
    this.metrics.delete(label)

    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
    return duration
  }

  measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(label)
    return fn().finally(() => {
      this.endTimer(label)
    })
  }

  measureSync<T>(label: string, fn: () => T): T {
    this.startTimer(label)
    try {
      return fn()
    } finally {
      this.endTimer(label)
    }
  }

  // Web Vitals monitoring
  observeWebVitals(): void {
    if (typeof window === "undefined") return

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log("LCP:", lastEntry.startTime)
    }).observe({ entryTypes: ["largest-contentful-paint"] })

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        console.log("FID:", (entry as any).processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ["first-input"] })

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsValue = 0
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      })
      console.log("CLS:", clsValue)
    }).observe({ entryTypes: ["layout-shift"] })
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Debounce utility for performance optimization
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Lazy loading utility
export function createLazyLoader<T>(loader: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null

  return () => {
    if (!promise) {
      promise = loader()
    }
    return promise
  }
}
