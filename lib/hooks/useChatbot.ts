"use client"

import { useState, useCallback } from "react"
import { type ChatMessage, sendChatMessage } from "@/lib/api/chat"

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content: `Hello! I'm your AI career advisor. I've analyzed your assessment and I'm here to help you explore career paths, answer questions, and provide personalized guidance.

Based on your profile, I can see you have strong interests in design and technology. I've identified several career paths that align well with your skills and interests.

What would you like to explore first? You can ask me about:
• Specific career recommendations
• Skills you need to develop
• Learning resources and courses
• Job market insights
• Next steps in your career journey

Feel free to ask me anything!`,
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>()

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      // Add user message
      const userMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: "user",
        content: content.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        // Send to API and get bot response
        const botResponse = await sendChatMessage(content)
        setMessages((prev) => [...prev, botResponse])

        if (!conversationId) {
          setConversationId(botResponse.id)
        }
      } catch (error) {
        console.error("Error sending message:", error)
        // Add error message
        const errorMessage: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          type: "bot",
          content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId],
  )

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        type: "bot",
        content: `Hello! I'm your AI career advisor. How can I help you today?

You can ask me about:
• Career recommendations based on your assessment
• Skills development and learning paths
• Job market insights and opportunities
• Specific career details and requirements

What would you like to explore?`,
        timestamp: new Date(),
      },
    ])
    setConversationId(undefined)
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  }
}
