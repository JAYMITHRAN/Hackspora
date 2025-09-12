"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Button from "@/components/common/Button"
import Card from "@/components/common/Card"
import { Input } from "@/components/common/FormField"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useLocalStorage } from "@/lib/hooks/useLocalStorage"
import { COMPANY_LOGOS, SOCIAL_PROOF_STATS } from "@/lib/utils/constants"
import {
  SparklesIcon,
  ChartBarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  CheckIcon,
  PlayIcon,
} from "@heroicons/react/24/outline"

export default function LandingPage() {
  const [email, setEmail] = useLocalStorage("newsletter-email", "")
  const [typewriterText, setTypewriterText] = useState("")
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const typewriterTexts = [
    "Discover your dream career with AI",
    "Get personalized career recommendations",
    "Build skills for your future success",
    "Connect with top employers worldwide",
  ]

  // Typewriter effect
  useEffect(() => {
    const currentText = typewriterTexts[currentTextIndex]
    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (charIndex <= currentText.length) {
        setTypewriterText(currentText.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [currentTextIndex]) // Removed typewriterTexts from dependencies to prevent infinite loops

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const features = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "AI Career Advisor",
      description:
        "Get personalized career recommendations powered by advanced AI algorithms that understand your unique skills and interests.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Skill Gap Analysis",
      description:
        "Identify exactly what skills you need to develop for your target career with detailed gap analysis and learning roadmaps.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <BriefcaseIcon className="w-8 h-8" />,
      title: "Live Job Updates",
      description:
        "Stay updated with the latest job opportunities that match your profile and career goals in real-time.",
      color: "from-green-500 to-emerald-600",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <SparklesIcon className="w-4 h-4" />
                AI-Powered Career Guidance
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
                Your Future Career Starts{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Here</span>
              </h1>

              <div className="h-16 mb-8">
                <p className="text-xl text-gray-600 text-pretty">
                  {typewriterText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/assessment">
                  <Button size="lg" icon={<ArrowRightIcon className="w-5 h-5" />}>
                    Start Assessment
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<PlayIcon className="w-5 h-5 bg-transparent" />}
                  onClick={() => {
                    // Demo persona functionality
                    console.log("Demo persona clicked")
                  }}
                >
                  Try Demo Persona
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  Free Assessment
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  Instant Results
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  AI-Powered
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/modern-professional-using-ai-career-guidance-dashb.jpg"
                  alt="AI Career Guidance Dashboard"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Students Worldwide</h2>
            <p className="text-lg text-gray-600">Join thousands who have discovered their ideal career path</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {SOCIAL_PROOF_STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600 mb-6">Partnered with leading companies</p>
            <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
              {COMPANY_LOGOS.map((company, index) => (
                <img
                  key={index}
                  src={company.logo || "/placeholder.svg"}
                  alt={`${company.name} logo`}
                  className="h-8 grayscale hover:grayscale-0 transition-all duration-200"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Find Your Perfect Career
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              Our AI-powered platform provides comprehensive career guidance tailored to your unique profile and
              aspirations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="feature" hover className="p-8 text-center group">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-200`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Get started in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Take Assessment",
                description:
                  "Complete our comprehensive career assessment to help us understand your skills, interests, and goals.",
                icon: <AcademicCapIcon className="w-8 h-8" />,
              },
              {
                step: "02",
                title: "Get AI Analysis",
                description:
                  "Our AI analyzes your responses and matches you with careers that align with your profile and market demand.",
                icon: <SparklesIcon className="w-8 h-8" />,
              },
              {
                step: "03",
                title: "Start Your Journey",
                description:
                  "Receive personalized learning paths, job recommendations, and ongoing guidance to achieve your career goals.",
                icon: <BriefcaseIcon className="w-8 h-8" />,
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 text-center h-full">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                    {step.icon}
                  </div>
                  <div className="text-sm font-bold text-blue-600 mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRightIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated on Career Trends</h2>
          <p className="text-blue-100 text-lg mb-8">
            Get weekly insights on job market trends, skill demands, and career opportunities delivered to your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white"
            />
            <Button type="submit" variant="secondary" size="lg" loading={isSubscribed}>
              {isSubscribed ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>

          {isSubscribed && (
            <div className="mt-4 flex items-center justify-center gap-2 text-green-200">
              <CheckIcon className="w-5 h-5" />
              <span>Thank you for subscribing! Check your email for confirmation.</span>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Discover Your Dream Career?</h2>
          <p className="text-lg text-gray-600 mb-8 text-pretty">
            Join thousands of students and professionals who have found their ideal career path with our AI-powered
            guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment">
              <Button size="lg" icon={<ArrowRightIcon className="w-5 h-5" />}>
                Start Free Assessment
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="lg" icon={<SparklesIcon className="w-5 h-5 bg-transparent" />}>
                Chat with AI Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
