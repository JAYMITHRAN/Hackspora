import { Suspense } from "react"
import QuizPage from "@/components/pages/QuizPage"

export default function Quiz() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <QuizPage />
    </Suspense>
  )
}

