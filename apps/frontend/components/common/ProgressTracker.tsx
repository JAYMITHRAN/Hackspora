import { cn } from "@/lib/utils"
import { CheckIcon } from "@heroicons/react/24/solid"

interface Step {
  id: string
  title: string
  description?: string
}

interface ProgressTrackerProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export default function ProgressTracker({ steps, currentStep, className }: ProgressTrackerProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                    isCompleted && "bg-green-500 text-white",
                    isCurrent && "bg-blue-500 text-white ring-4 ring-blue-100",
                    isUpcoming && "bg-gray-200 text-gray-500",
                  )}
                >
                  {isCompleted ? <CheckIcon className="w-5 h-5" /> : stepNumber}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      (isCompleted || isCurrent) && "text-gray-900",
                      isUpcoming && "text-gray-500",
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && <p className="text-xs text-gray-500 mt-1">{step.description}</p>}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-200",
                    stepNumber < currentStep ? "bg-green-500" : "bg-gray-200",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
