"use client"

import { useState, useRef } from "react"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useToast } from '@/hooks/use-toast'
import { 
  DocumentMagnifyingGlassIcon, 
  CloudArrowUpIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  XMarkIcon
} from "@heroicons/react/24/outline"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResumeAnalyzer() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        setSelectedFile(file)
        toast({
          title: "File Selected",
          description: `${file.name} is ready for analysis.`,
        })
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF, DOC, or DOCX file.",
          variant: "destructive"
        })
      }
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a resume file first.",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const dummyResults = {
        atsScore: 87,
        overallScore: 8.5,
        suggestions: [
          {
            type: "strength",
            title: "Strong Technical Skills",
            description: "Your technical skills section is well-organized and comprehensive",
            priority: "high"
          },
          {
            type: "improvement",
            title: "Add Quantifiable Achievements",
            description: "Consider adding more specific metrics and numbers to your experience section",
            priority: "medium"
          },
          {
            type: "improvement",
            title: "Optimize Keywords",
            description: "Include more industry-specific keywords to improve ATS compatibility",
            priority: "high"
          },
          {
            type: "suggestion",
            title: "Format Consistency",
            description: "Ensure consistent formatting throughout your resume",
            priority: "low"
          }
        ],
        strengths: [
          "Clear professional summary",
          "Relevant work experience",
          "Good use of action verbs",
          "Proper contact information"
        ],
        improvements: [
          "Add more quantifiable achievements",
          "Include industry-specific keywords",
          "Expand on technical skills",
          "Add relevant certifications"
        ]
      }
      
      setAnalysisResults(dummyResults)
      setIsAnalyzing(false)
      
      toast({
        title: "Analysis Complete!",
        description: "Your resume has been analyzed successfully.",
      })
    }, 3000)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setAnalysisResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DocumentMagnifyingGlassIcon className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('resume.analyzer.title')}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('resume.analyzer.subtitle')}
        </p>
      </div>

      {/* Upload Area */}
      <div className="max-w-4xl mx-auto mb-8">
        {!selectedFile ? (
          <div 
            className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Your Resume
            </h3>
            <p className="text-gray-500 mb-6">
              {t('resume.analyzer.placeholder')}
            </p>
            
            <Button 
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              <CloudArrowUpIcon className="w-5 h-5 mr-2" />
              Choose File
            </Button>
            
            <p className="text-sm text-gray-400 mt-4">
              Supports PDF, DOC, DOCX files up to 10MB
            </p>
          </div>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DocumentMagnifyingGlassIcon className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                  >
                    {isAnalyzing ? (
                      <>
                        <DocumentMagnifyingGlassIcon className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <DocumentMagnifyingGlassIcon className="w-4 h-4 mr-2" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="max-w-6xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Analysis Results
          </h3>
          
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {analysisResults.atsScore}/100
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">ATS Score</h4>
                <p className="text-sm text-gray-600">
                  {analysisResults.atsScore >= 80 ? 'Excellent' : 
                   analysisResults.atsScore >= 60 ? 'Good' : 'Needs Improvement'} 
                  compatibility with ATS systems
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {analysisResults.overallScore}/10
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h4>
                <p className="text-sm text-gray-600">
                  {analysisResults.overallScore >= 8 ? 'Outstanding' : 
                   analysisResults.overallScore >= 6 ? 'Good' : 'Needs Work'} 
                  resume quality
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResults.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResults.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-center text-sm">
                      <ExclamationTriangleIcon className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <LightBulbIcon className="w-5 h-5 mr-2" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Personalized suggestions to improve your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.suggestions.map((suggestion: any, index: number) => (
                  <div key={index} className="flex items-start p-4 rounded-lg border">
                    <div className="flex-shrink-0 mr-4">
                      {suggestion.type === 'strength' && (
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                      )}
                      {suggestion.type === 'improvement' && (
                        <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />
                      )}
                      {suggestion.type === 'suggestion' && (
                        <LightBulbIcon className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                          suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {suggestion.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analysis Preview - Only show if no results */}
      {!analysisResults && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            What You'll Get
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ATS Optimization */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">ATS Optimization</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Ensure your resume passes Applicant Tracking Systems
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Keyword optimization
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Format compatibility
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Section structure
                </div>
              </div>
            </div>

            {/* Content Analysis */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Content Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Get detailed feedback on your resume content
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Skills assessment
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Experience gaps
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Achievement metrics
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <LightBulbIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900">AI Suggestions</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Personalized recommendations for improvement
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Action verbs
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Industry keywords
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Formatting tips
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
