"use client"

import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import { useTranslation } from "@/lib/hooks/useTranslation"
import QuizCard from "@/components/gamification/QuizCard"
import CareerGameCard from "@/components/gamification/CareerGameCard"
import AchievementBadge from "@/components/gamification/AchievementBadge"
import { cn } from "@/lib/utils"
import { 
  TrophyIcon, 
  StarIcon, 
  FireIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline"

type SectionType = "quizzes" | "careerGames"

export default function GamePage() {
  const [activeSection, setActiveSection] = useState<SectionType>("quizzes")
  const { t } = useTranslation()

  const sections = [
    { 
      id: "quizzes" as SectionType, 
      name: t('gamification.sections.quizzes'),
      icon: AcademicCapIcon,
      description: "Test your skills and earn points"
    },
    { 
      id: "careerGames" as SectionType, 
      name: t('gamification.sections.careerGames'),
      icon: BriefcaseIcon,
      description: "Explore career paths through simulation"
    },
  ]

  // Mock user stats
  const userStats = {
    totalPoints: 1250,
    level: 8,
    streak: 12,
    badges: 5,
    quizzesCompleted: 23,
    gamesPlayed: 7
  }

  const achievements = [
    { id: "firstQuiz", name: "First Quiz", icon: StarIcon, earned: true },
    { id: "perfectScore", name: "Perfect Score", icon: TrophyIcon, earned: true },
    { id: "streak", name: "Streak Master", icon: FireIcon, earned: true },
    { id: "explorer", name: "Career Explorer", icon: ChartBarIcon, earned: false },
    { id: "skillMaster", name: "Skill Master", icon: AcademicCapIcon, earned: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 cursor-gaming">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('gamification.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('gamification.subtitle')}
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform border border-blue-100 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</p>
              </div>
              <TrophyIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform border border-green-100 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Level</p>
                <p className="text-2xl font-bold text-green-600">{userStats.level}</p>
              </div>
              <StarIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform border border-orange-100 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-orange-600">{userStats.streak} days</p>
              </div>
              <FireIcon className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform border border-purple-100 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Badges</p>
                <p className="text-2xl font-bold text-purple-600">{userStats.badges}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "group relative p-6 rounded-xl transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105",
                      activeSection === section.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "p-3 rounded-lg transition-all duration-300",
                        activeSection === section.id
                          ? "bg-white/20"
                          : "bg-blue-100 group-hover:bg-blue-200"
                      )}>
                        <Icon className={cn(
                          "w-6 h-6 transition-colors duration-300",
                          activeSection === section.id
                            ? "text-white"
                            : "text-blue-600 group-hover:text-blue-700"
                        )} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg">{section.name}</h3>
                        <p className="text-sm opacity-80">{section.description}</p>
                      </div>
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none",
                      activeSection === section.id
                        ? "opacity-100 bg-gradient-to-r from-blue-500 to-purple-600"
                        : "group-hover:opacity-20 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600"
                    )} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {activeSection === "quizzes" && <QuizCard />}
            {activeSection === "careerGames" && <CareerGameCard />}
          </div>

          {/* Right Column - Achievements & Progress */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrophyIcon className="w-6 h-6 text-yellow-500 mr-2" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quizzes Completed</span>
                    <span>{userStats.quizzesCompleted}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Games Played</span>
                    <span>{userStats.gamesPlayed}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '46%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
