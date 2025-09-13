"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from "@/lib/utils"
import { 
  PlayIcon, 
  CheckCircleIcon, 
  ClockIcon,
  StarIcon,
  FireIcon,
  TrophyIcon,
  AcademicCapIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline"

interface Quiz {
  id: string
  title: string
  type: string
  difficulty: 'easy' | 'medium' | 'hard'
  questions: number
  points: number
  timeLimit: number
  completed: boolean
  score?: number
  description: string
  icon: any
}

export default function QuizCard() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const quizzes: Quiz[] = [
    {
      id: "coding-basics",
      title: "JavaScript Fundamentals",
      type: "coding",
      difficulty: "easy",
      questions: 10,
      points: 100,
      timeLimit: 15,
      completed: false,
      description: "Test your JavaScript knowledge with basic concepts",
      icon: AcademicCapIcon
    },
    {
      id: "aptitude-logic",
      title: "Logical Reasoning",
      type: "aptitude",
      difficulty: "medium",
      questions: 15,
      points: 150,
      timeLimit: 20,
      completed: true,
      score: 85,
      description: "Challenge your logical thinking skills",
      icon: LightBulbIcon
    },
    {
      id: "soft-skills",
      title: "Communication Skills",
      type: "softSkills",
      difficulty: "easy",
      questions: 8,
      points: 80,
      timeLimit: 10,
      completed: false,
      description: "Assess your interpersonal communication abilities",
      icon: StarIcon
    },
    {
      id: "tech-industry",
      title: "Tech Industry Trends",
      type: "industry",
      difficulty: "hard",
      questions: 20,
      points: 200,
      timeLimit: 25,
      completed: false,
      description: "Stay updated with latest technology trends",
      icon: TrophyIcon
    }
  ]

  const dailyChallenge = {
    id: "daily-challenge",
    title: "Daily Challenge",
    type: "mixed",
    difficulty: "medium" as const,
    questions: 12,
    points: 120,
    timeLimit: 18,
    completed: false,
    description: "Complete today's special challenge for bonus points",
    icon: FireIcon
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢'
      case 'medium': return '🟡'
      case 'hard': return '🔴'
      default: return '⚪'
    }
  }

  const handleStartQuiz = (quizId: string) => {
    // Route to quiz page with quiz parameters
    const quizParams = new URLSearchParams({
      type: quizId,
      title: quizzes.find(q => q.id === quizId)?.title || 'Quiz'
    })
    window.location.href = `/quiz?${quizParams.toString()}`
  }

  const renderQuizCard = (quiz: Quiz, isDaily = false) => {
    const Icon = quiz.icon
    
    return (
      <Card 
        key={quiz.id}
        className={cn(
          "group relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform",
          isDaily 
            ? "border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 hover:shadow-orange-200/50" 
            : "border border-gray-200 hover:shadow-lg hover:shadow-blue-200/50",
          selectedQuiz === quiz.id && "ring-2 ring-blue-500 scale-105"
        )}
        onClick={() => !isPlaying && handleStartQuiz(quiz.id)}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                isDaily 
                  ? "bg-orange-100 group-hover:bg-orange-200" 
                  : "bg-blue-100 group-hover:bg-blue-200"
              )}>
                <Icon className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  isDaily ? "text-orange-600" : "text-blue-600"
                )} />
              </div>
              <div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {quiz.description}
                </CardDescription>
              </div>
            </div>
            
            {isDaily && (
              <Badge className="bg-orange-500 text-white animate-pulse">
                <FireIcon className="w-3 h-3 mr-1" />
                Daily
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{quiz.questions}</div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{quiz.points}</div>
              <div className="text-xs text-gray-500">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{quiz.timeLimit}m</div>
              <div className="text-xs text-gray-500">Time Limit</div>
            </div>
            <div className="text-center">
              <Badge className={getDifficultyColor(quiz.difficulty)}>
                {getDifficultyIcon(quiz.difficulty)} {quiz.difficulty}
              </Badge>
            </div>
          </div>

          {quiz.completed && quiz.score && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Completed</span>
                <span className="text-sm font-bold text-green-600">{quiz.score}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${quiz.score}%` }}
                />
              </div>
            </div>
          )}

            <Button 
              onClick={() => handleStartQuiz(quiz.id)}
              className={cn(
                "w-full transition-all duration-300 group-hover:scale-105 transform",
                isDaily 
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {quiz.completed ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  {t('gamification.quizzes.completed')}
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4 mr-2" />
                  {t('gamification.quizzes.startQuiz')}
                </>
              )}
            </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Daily Challenge */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <FireIcon className="w-6 h-6 text-orange-500 mr-2" />
          {t('gamification.quizzes.dailyChallenge')}
        </h2>
        {renderQuizCard(dailyChallenge, true)}
      </div>

      {/* Regular Quizzes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <AcademicCapIcon className="w-6 h-6 text-blue-500 mr-2" />
          {t('gamification.quizzes.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => renderQuizCard(quiz))}
        </div>
      </div>

      {/* Weekly Challenge */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <TrophyIcon className="w-6 h-6 text-purple-500 mr-2" />
          {t('gamification.quizzes.weeklyChallenge')}
        </h2>
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-purple-200/50 transition-all duration-300 cursor-pointer hover:scale-105 transform">
          <CardContent className="p-8 text-center">
            <TrophyIcon className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Weekly Master Challenge</h3>
            <p className="text-gray-600 mb-4">Complete all quizzes this week to unlock the master challenge</p>
            <div className="flex justify-center space-x-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">30</div>
                <div className="text-xs text-gray-500">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">45m</div>
                <div className="text-xs text-gray-500">Time</div>
              </div>
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 transform"
              disabled
            >
              <TrophyIcon className="w-4 h-4 mr-2" />
              Locked - Complete 3 more quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
