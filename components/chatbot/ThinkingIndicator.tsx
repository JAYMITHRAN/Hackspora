"use client"

import { SparklesIcon } from "@heroicons/react/24/solid"

interface ThinkingIndicatorProps {
  className?: string
}

export default function ThinkingIndicator({ className = "" }: ThinkingIndicatorProps) {
  return (
    <div className={`flex gap-3 p-4 bg-gray-50 rounded-lg ${className}`}>
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <SparklesIcon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-sm text-gray-900">AI Career Advisor</span>
          <span className="text-xs text-gray-500">thinking</span>
          <div className="flex gap-1 items-center">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms] [animation-duration:1.4s]"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms] [animation-duration:1.4s]"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms] [animation-duration:1.4s]"></div>
          </div>
        </div>
        <div className="text-sm text-gray-600 italic">
          Analyzing your question and preparing a response...
        </div>
      </div>
    </div>
  )
}
