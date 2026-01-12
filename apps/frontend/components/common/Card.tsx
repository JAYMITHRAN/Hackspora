import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "feature" | "job" | "career" | "glass"
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    const baseStyles = "rounded-xl border transition-all duration-200"

    const variants = {
      default: "bg-white border-gray-200 shadow-sm",
      feature: "bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-md",
      job: "bg-white border-gray-200 shadow-sm hover:shadow-md",
      career: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm",
      glass: "bg-white/80 backdrop-blur-sm border-white/20 shadow-lg",
    }

    const hoverStyles = hover ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : ""

    return (
      <div className={cn(baseStyles, variants[variant], hoverStyles, className)} ref={ref} {...props}>
        {children}
      </div>
    )
  },
)

Card.displayName = "Card"

export default Card
