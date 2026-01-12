"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  TrophyIcon, 
  StarIcon, 
  FireIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CheckCircleIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline"

interface Achievement {
  id: string
  name: string
  icon: any
  earned: boolean
}

interface AchievementBadgeProps {
  achievement: Achievement
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = achievement.icon

  const getIconColor = (earned: boolean) => {
    return earned ? "text-yellow-500" : "text-gray-300"
  }

  const getBgColor = (earned: boolean) => {
    return earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
  }

  return (
    <div
      className={cn(
        "group relative p-3 rounded-lg border transition-all duration-300 cursor-pointer",
        achievement.earned ? "hover:scale-105 hover:shadow-lg" : "opacity-60",
        getBgColor(achievement.earned)
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(
          "p-2 rounded-lg transition-all duration-300",
          achievement.earned ? "bg-yellow-100 group-hover:bg-yellow-200" : "bg-gray-100"
        )}>
          {achievement.earned ? (
            <Icon className="w-5 h-5 text-yellow-600" />
          ) : (
            <LockClosedIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1">
          <h4 className={cn(
            "font-medium text-sm transition-colors duration-300",
            achievement.earned ? "text-gray-900 group-hover:text-yellow-700" : "text-gray-500"
          )}>
            {achievement.name}
          </h4>
          <p className="text-xs text-gray-500">
            {achievement.earned ? "Earned" : "Locked"}
          </p>
        </div>

        {achievement.earned && (
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
        )}
      </div>

      {/* Hover tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          {achievement.earned ? "Achievement unlocked!" : "Complete requirements to unlock"}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* Glow effect for earned achievements */}
      {achievement.earned && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  )
}
