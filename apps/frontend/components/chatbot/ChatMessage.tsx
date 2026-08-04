import type { ChatMessage as ChatMessageType } from "@/lib/api/chat"
import { cn } from "@/lib/utils"
import { UserIcon, SparklesIcon } from "@heroicons/react/24/solid"
import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"


interface ChatMessageProps {
  message: ChatMessageType
  className?: string
}

export default function ChatMessage({ message, className }: ChatMessageProps) {
  const isBot = message.type === "bot"

  return (
    <div className={cn("flex gap-3 rounded-lg p-4", isBot ? "bg-gray-50" : "bg-white", className)}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isBot ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600",
        )}
      >
        {isBot ? <SparklesIcon className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900">{isBot ? "AI Career Advisor" : "You"}</span>
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className={cn("text-sm leading-6 break-words", isBot ? "text-gray-700" : "text-gray-900") }>
          <ReactMarkdown
            remarkPlugins={[remarkBreaks, remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 whitespace-pre-wrap">{children}</p>,
              ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
              li: ({ children }) => <li className="whitespace-pre-wrap">{children}</li>,
              a: ({ children, href }) => (
                <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 underline underline-offset-2">
                  {children}
                </a>
              ),
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
