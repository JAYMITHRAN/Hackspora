"use client"

import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import { useTranslation } from "@/lib/hooks/useTranslation"
import ResumeBuilder from "@/components/resume/ResumeBuilder"
import ResumeAnalyzer from "@/components/resume/ResumeAnalyzer"
import { cn } from "@/lib/utils"

type TabType = "builder" | "analyzer"

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState<TabType>("builder")
  const { t } = useTranslation()

  const tabs = [
    { id: "builder" as TabType, name: t('resume.tabs.builder') },
    { id: "analyzer" as TabType, name: t('resume.tabs.analyzer') },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('resume.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('resume.subtitle')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 cursor-pointer",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          {activeTab === "builder" && <ResumeBuilder />}
          {activeTab === "analyzer" && <ResumeAnalyzer />}
        </div>
      </div>
    </div>
  )
}
