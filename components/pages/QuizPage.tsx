"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from "@/lib/utils"
import { 
  ClockIcon, 
  FlagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TrophyIcon,
  StarIcon,
  FireIcon
} from "@heroicons/react/24/outline"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  flaggedQuestions: number[]
}

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { toast } = useToast()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(5).fill(-1))
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Sample quiz data
  const questions: Question[] = [
    {
      id: 1,
      question: "What is the primary purpose of React hooks?",
      options: [
        "To manage component state and side effects",
        "To create reusable UI components",
        "To handle routing in React applications",
        "To optimize component performance"
      ],
      correctAnswer: 0,
      explanation: "React hooks allow you to use state and other React features in functional components.",
      category: "React",
      difficulty: "easy"
    },
    {
      id: 2,
      question: "Which method is used to update state in React?",
      options: [
        "this.setState()",
        "useState()",
        "setState()",
        "updateState()"
      ],
      correctAnswer: 1,
      explanation: "useState() is the hook used to manage state in functional components.",
      category: "React",
      difficulty: "easy"
    },
    {
      id: 3,
      question: "What does the useEffect hook do?",
      options: [
        "Manages component state",
        "Handles side effects and lifecycle events",
        "Creates new components",
        "Optimizes rendering performance"
      ],
      correctAnswer: 1,
      explanation: "useEffect is used to perform side effects and manage component lifecycle in functional components.",
      category: "React",
      difficulty: "medium"
    },
    {
      id: 4,
      question: "Which of the following is NOT a valid React hook?",
      options: [
        "useState",
        "useEffect",
        "useComponent",
        "useContext"
      ],
      correctAnswer: 2,
      explanation: "useComponent is not a valid React hook. The valid hooks are useState, useEffect, useContext, etc.",
      category: "React",
      difficulty: "medium"
    },
    {
      id: 5,
      question: "What is the purpose of the dependency array in useEffect?",
      options: [
        "To specify which props to watch",
        "To control when the effect runs",
        "To define the component's dependencies",
        "To optimize component rendering"
      ],
      correctAnswer: 1,
      explanation: "The dependency array controls when the useEffect hook runs based on changes to specified values.",
      category: "React",
      difficulty: "hard"
    }
  ]

  const quizType = searchParams.get('type') || 'coding'
  const quizTitle = searchParams.get('title') || 'JavaScript Fundamentals'

  // Timer effect
  useEffect(() => {
    if (isQuizStarted && !isSubmitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isQuizStarted, isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (isSubmitted) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleFlagQuestion = () => {
    if (isSubmitted) return
    
    const newFlagged = flaggedQuestions.includes(currentQuestion)
      ? flaggedQuestions.filter(q => q !== currentQuestion)
      : [...flaggedQuestions, currentQuestion]
    setFlaggedQuestions(newFlagged)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    if (isSubmitted) return
    
    setIsSubmitted(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length

    const result: QuizResult = {
      score: Math.round((correctAnswers / questions.length) * 100),
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent: 300 - timeLeft,
      flaggedQuestions
    }

    setQuizResult(result)
    setShowResults(true)

    toast({
      title: "Quiz Submitted!",
      description: `You scored ${result.score}% (${correctAnswers}/${questions.length} correct)`,
    })
  }

  const handleStartQuiz = () => {
    setIsQuizStarted(true)
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(5).fill(-1))
    setFlaggedQuestions([])
    setTimeLeft(300)
    setIsSubmitted(false)
    setShowResults(false)
    setQuizResult(null)
    setIsQuizStarted(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                {quizTitle}
              </CardTitle>
              <CardDescription className="text-lg">
                Test your knowledge with 5 carefully crafted questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <ClockIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">5:00</div>
                  <div className="text-sm text-gray-600">Time Limit</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrophyIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Quiz Instructions:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                    Read each question carefully before selecting your answer
                  </li>
                  <li className="flex items-center">
                    <FlagIcon className="w-4 h-4 text-orange-500 mr-2" />
                    Use the flag button to mark questions for review
                  </li>
                  <li className="flex items-center">
                    <ClockIcon className="w-4 h-4 text-blue-500 mr-2" />
                    Keep an eye on the timer - quiz auto-submits when time runs out
                  </li>
                  <li className="flex items-center">
                    <TrophyIcon className="w-4 h-4 text-purple-500 mr-2" />
                    You can navigate between questions using the arrow buttons
                  </li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={() => router.back()}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleStartQuiz}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Quiz
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Quiz Results
              </CardTitle>
              <CardDescription className="text-lg">
                Great job completing the quiz!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className={cn(
                  "text-6xl font-bold mb-2",
                  quizResult.score >= 80 ? "text-green-600" :
                  quizResult.score >= 60 ? "text-yellow-600" : "text-red-600"
                )}>
                  {quizResult.score}%
                </div>
                <div className="text-lg text-gray-600">
                  {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
                </div>
              </div>

              {/* Detailed Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-blue-600">
                    {formatTime(quizResult.timeSpent)}
                  </div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <FlagIcon className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-orange-600">
                    {quizResult.flaggedQuestions.length}
                  </div>
                  <div className="text-sm text-gray-600">Questions Flagged</div>
                </div>
              </div>

              {/* Performance Message */}
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
                <p className="text-sm text-gray-600">
                  {quizResult.score >= 80 ? "Excellent work! You have a strong understanding of this topic." :
                   quizResult.score >= 60 ? "Good job! Consider reviewing some concepts to improve further." :
                   "Keep studying! Review the material and try again to improve your score."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  onClick={handleRetakeQuiz}
                  variant="outline"
                  className="flex-1"
                >
                  <TrophyIcon className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button 
                  onClick={() => router.push('/game')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <StarIcon className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quizTitle}</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-orange-600">
              <ClockIcon className="w-5 h-5" />
              <span className="font-mono text-lg font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
            <Button
              onClick={handleFlagQuestion}
              variant={flaggedQuestions.includes(currentQuestion) ? "default" : "outline"}
              size="sm"
              className={flaggedQuestions.includes(currentQuestion) ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              <FlagIcon className="w-4 h-4 mr-1" />
              {flaggedQuestions.includes(currentQuestion) ? "Flagged" : "Flag"}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge className={getDifficultyColor(currentQ.difficulty)}>
                {currentQ.difficulty}
              </Badge>
              <Badge variant="outline">{currentQ.category}</Badge>
            </div>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:scale-105 transform",
                    selectedAnswers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center",
                      selectedAnswers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    )}>
                      {selectedAnswers[currentQuestion] === index && (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-110 transform",
                  index === currentQuestion
                    ? "border-blue-500 bg-blue-500 text-white"
                    : selectedAnswers[index] !== -1
                    ? "border-green-500 bg-green-50 text-green-700"
                    : flaggedQuestions.includes(index)
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            {currentQuestion === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitted}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <TrophyIcon className="w-4 h-4 mr-2" />
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
              >
                Next
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

