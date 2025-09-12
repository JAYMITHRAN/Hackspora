"use client"

import { useState } from "react"
import type { CareerRecommendation } from "@/lib/api/recommend"
import Card from "@/components/common/Card"
import Button from "@/components/common/Button"
import { StarIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import { cn } from "@/lib/utils"

interface CareerCardProps {
  career: CareerRecommendation
  onViewDetails: (careerId: string) => void
  className?: string
}

export default function CareerCard({ career, onViewDetails, className }: CareerCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <Card
      className={cn("w-64 h-48 cursor-pointer perspective-1000", className)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d",
          isFlipped && "rotate-y-180",
        )}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">{career.category}</span>
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">{career.matchScore}%</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{career.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{career.description}</p>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              <span className="font-medium">Salary:</span> {career.salaryRange}
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">Growth:</span> {career.growthRate} annually
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-4 flex flex-col justify-between bg-gradient-to-br from-blue-50 to-indigo-50">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
            <div className="space-y-1">
              {career.requiredSkills.slice(0, 4).map((skill, index) => (
                <div key={index} className="text-xs bg-white px-2 py-1 rounded text-gray-700">
                  {skill}
                </div>
              ))}
            </div>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(career.id)
            }}
            icon={<ArrowTopRightOnSquareIcon className="w-3 h-3" />}
            className="w-full"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  )
}
