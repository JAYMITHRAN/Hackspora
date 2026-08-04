"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
  type ChatMessage,
  clearChatHistory,
  getChatHistory,
  saveChatHistory,
  sendChatMessage,
} from "@/lib/api/chat"

const WELCOME_MESSAGE: ChatMessage = {
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
}

export function useChatbot() {
  const [conversationId] = useState(() => `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const isSendingRef = useRef(false)
  const hasLoadedHistoryRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const loadHistory = async () => {
      const history = await getChatHistory(conversationId)

      if (cancelled) {
        return
      }

      if (history.length > 0) {
        setMessages(history)
      } else {
        setMessages([WELCOME_MESSAGE])
      }

      hasLoadedHistoryRef.current = true
    }

    loadHistory()

    return () => {
      cancelled = true
      hasLoadedHistoryRef.current = false
    }
  }, [conversationId])

  useEffect(() => {
    if (!hasLoadedHistoryRef.current) {
      return
    }

    saveChatHistory(messages, conversationId)
  }, [conversationId, messages])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isSendingRef.current) return

      isSendingRef.current = true

      const userMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: "user",
        content: content.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const botResponse = await sendChatMessage(content)
        setMessages((prev) => [...prev, botResponse])
      } catch (error) {
        console.error("Error sending message:", error)
        const errorMessage: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          type: "bot",
          content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
        isSendingRef.current = false
      }
    },
    [],
  )

  const clearChat = useCallback(() => {
    clearChatHistory(conversationId)
    hasLoadedHistoryRef.current = false
    setMessages([WELCOME_MESSAGE])
    saveChatHistory([WELCOME_MESSAGE], conversationId)
    hasLoadedHistoryRef.current = true
  }, [conversationId])

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  }
}
