"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from "@/lib/utils"
import { 
  PlayIcon, 
  LockClosedIcon,
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  CpuChipIcon,
  HeartIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline"

interface CareerRole {
  id: string
  title: string
  industry: string
  level: number
  unlocked: boolean
  progress: number
  skills: string[]
  description: string
  icon: any
  color: string
  requirements: string[]
}

interface Skill {
  id: string
  name: string
  level: number
  maxLevel: number
  unlocked: boolean
  icon: any
}

export default function CareerGameCard() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const careerRoles: CareerRole[] = [
    {
      id: "frontend-developer",
      title: "Frontend Developer",
      industry: "Technology",
      level: 1,
      unlocked: true,
      progress: 65,
      skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
      description: "Build beautiful and interactive user interfaces",
      icon: CodeBracketIcon,
      color: "blue",
      requirements: ["Basic HTML knowledge", "CSS fundamentals"]
    },
    {
      id: "ui-designer",
      title: "UI/UX Designer",
      industry: "Design",
      level: 2,
      unlocked: true,
      progress: 40,
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
      description: "Create intuitive and engaging user experiences",
      icon: PaintBrushIcon,
      color: "purple",
      requirements: ["Design thinking", "Visual communication"]
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      industry: "Analytics",
      level: 3,
      unlocked: false,
      progress: 0,
      skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
      description: "Extract insights from data to drive business decisions",
      icon: ChartBarIcon,
      color: "green",
      requirements: ["Complete Frontend Developer path", "Mathematics background"]
    },
    {
      id: "product-manager",
      title: "Product Manager",
      industry: "Business",
      level: 4,
      unlocked: false,
      progress: 0,
      skills: ["Strategy", "Analytics", "Leadership", "Communication", "Market Research"],
      description: "Lead product development and strategy",
      icon: BriefcaseIcon,
      color: "orange",
      requirements: ["Complete 2 career paths", "Leadership experience"]
    },
    {
      id: "ai-engineer",
      title: "AI Engineer",
      industry: "Technology",
      level: 5,
      unlocked: false,
      progress: 0,
      skills: ["Python", "TensorFlow", "Deep Learning", "NLP", "Computer Vision"],
      description: "Build intelligent systems and AI solutions",
      icon: CpuChipIcon,
      color: "red",
      requirements: ["Complete Data Scientist path", "Advanced programming"]
    },
    {
      id: "startup-founder",
      title: "Startup Founder",
      industry: "Entrepreneurship",
      level: 6,
      unlocked: false,
      progress: 0,
      skills: ["Leadership", "Strategy", "Fundraising", "Marketing", "Operations"],
      description: "Build and scale your own company",
      icon: RocketLaunchIcon,
      color: "yellow",
      requirements: ["Complete all career paths", "Entrepreneurial mindset"]
    }
  ]

  const skills: Skill[] = [
    { id: "html", name: "HTML", level: 3, maxLevel: 5, unlocked: true, icon: CodeBracketIcon },
    { id: "css", name: "CSS", level: 2, maxLevel: 5, unlocked: true, icon: PaintBrushIcon },
    { id: "javascript", name: "JavaScript", level: 4, maxLevel: 5, unlocked: true, icon: CodeBracketIcon },
    { id: "react", name: "React", level: 1, maxLevel: 5, unlocked: true, icon: CodeBracketIcon },
    { id: "python", name: "Python", level: 0, maxLevel: 5, unlocked: false, icon: CpuChipIcon },
    { id: "figma", name: "Figma", level: 0, maxLevel: 5, unlocked: false, icon: PaintBrushIcon },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600'
      case 'purple': return 'from-purple-500 to-purple-600'
      case 'green': return 'from-green-500 to-green-600'
      case 'orange': return 'from-orange-500 to-orange-600'
      case 'red': return 'from-red-500 to-red-600'
      case 'yellow': return 'from-yellow-500 to-yellow-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getColorBg = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200'
      case 'purple': return 'bg-purple-50 border-purple-200'
      case 'green': return 'bg-green-50 border-green-200'
      case 'orange': return 'bg-orange-50 border-orange-200'
      case 'red': return 'bg-red-50 border-red-200'
      case 'yellow': return 'bg-yellow-50 border-yellow-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const handleStartGame = (roleId: string) => {
    setSelectedRole(roleId)
    setIsPlaying(true)
    toast({
      title: "Game Started!",
      description: "Begin your career journey simulation!",
    })
    
    // Simulate game completion after 3 seconds
    setTimeout(() => {
      setIsPlaying(false)
      setSelectedRole(null)
      toast({
        title: "Level Complete!",
        description: "Great progress! You've unlocked new skills.",
      })
    }, 3000)
  }

  const renderRoleCard = (role: CareerRole) => {
    const Icon = role.icon
    
    return (
      <Card 
        key={role.id}
        className={cn(
          "group relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer transform",
          role.unlocked 
            ? "hover:scale-105 hover:shadow-xl" 
            : "opacity-60 cursor-not-allowed",
          selectedRole === role.id && "ring-2 ring-blue-500 scale-105"
        )}
        onClick={() => role.unlocked && !isPlaying && handleStartGame(role.id)}
      >
        {/* Hover glow effect */}
        {role.unlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-3 rounded-xl transition-all duration-300",
                role.unlocked 
                  ? `bg-gradient-to-r ${getColorClasses(role.color)} group-hover:scale-110` 
                  : "bg-gray-200",
                role.unlocked ? "text-white" : "text-gray-400"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className={cn(
                  "text-lg transition-colors duration-300",
                  role.unlocked 
                    ? "group-hover:text-blue-600" 
                    : "text-gray-400"
                )}>
                  {role.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {role.industry} • Level {role.level}
                </CardDescription>
              </div>
            </div>
            
            {!role.unlocked && (
              <LockClosedIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </CardHeader>

        <CardContent className="relative">
          <p className="text-sm text-gray-600 mb-4">{role.description}</p>
          
          {/* Progress Bar */}
          {role.unlocked && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Progress</span>
                <span className="text-gray-500">{role.progress}%</span>
              </div>
              <Progress value={role.progress} className="h-2" />
            </div>
          )}

          {/* Skills */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Skills</h4>
            <div className="flex flex-wrap gap-2">
              {role.skills.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className={cn(
                    "text-xs transition-all duration-300",
                    role.unlocked 
                      ? "hover:scale-105 cursor-pointer" 
                      : "opacity-50"
                  )}
                >
                  {skill}
                </Badge>
              ))}
              {role.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{role.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Requirements for locked roles */}
          {!role.unlocked && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {role.requirements.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <LockClosedIcon className="w-3 h-3 mr-2 text-gray-400" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button 
            className={cn(
              "w-full transition-all duration-300",
              role.unlocked 
                ? "group-hover:scale-105 transform" 
                : "cursor-not-allowed",
              isPlaying && selectedRole === role.id && "animate-pulse"
            )}
            disabled={!role.unlocked || isPlaying}
          >
            {isPlaying && selectedRole === role.id ? (
              <>
                <PlayIcon className="w-4 h-4 mr-2 animate-pulse" />
                Playing...
              </>
            ) : role.unlocked ? (
              <>
                <PlayIcon className="w-4 h-4 mr-2" />
                {t('gamification.careerGames.playNow')}
              </>
            ) : (
              <>
                <LockClosedIcon className="w-4 h-4 mr-2" />
                Locked
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Career Path Selection */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <BriefcaseIcon className="w-6 h-6 text-blue-500 mr-2" />
          {t('gamification.careerGames.title')}
        </h2>
        <p className="text-gray-600 mb-6">{t('gamification.careerGames.subtitle')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerRoles.map((role) => renderRoleCard(role))}
        </div>
      </div>

      {/* Skills Progress */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <StarIcon className="w-6 h-6 text-purple-500 mr-2" />
          Your Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => {
            const Icon = skill.icon
            return (
              <Card 
                key={skill.id}
                className={cn(
                  "group transition-all duration-300 cursor-pointer hover:scale-105 transform",
                  skill.unlocked 
                    ? "hover:shadow-lg border-blue-200" 
                    : "opacity-60 border-gray-200"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
                      skill.unlocked 
                        ? "bg-blue-100 group-hover:bg-blue-200" 
                        : "bg-gray-100"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        skill.unlocked ? "text-blue-600" : "text-gray-400"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{skill.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={cn(
                              "h-2 rounded-full transition-all duration-500",
                              skill.unlocked ? "bg-blue-500" : "bg-gray-300"
                            )}
                            style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {skill.level}/{skill.maxLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Career Simulation Game */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <RocketLaunchIcon className="w-6 h-6 text-green-500 mr-2" />
          Career Simulation
        </h2>
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-green-200/50 transition-all duration-300 cursor-pointer hover:scale-105 transform">
          <CardContent className="p-8 text-center">
            <RocketLaunchIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Career Journey Simulator</h3>
            <p className="text-gray-600 mb-6">Experience a complete career journey from entry-level to executive</p>
            <div className="flex justify-center space-x-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">6</div>
                <div className="text-xs text-gray-500">Career Paths</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">50+</div>
                <div className="text-xs text-gray-500">Skills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">100+</div>
                <div className="text-xs text-gray-500">Challenges</div>
              </div>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 transform"
            >
              <RocketLaunchIcon className="w-4 h-4 mr-2" />
              Start Career Simulation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
