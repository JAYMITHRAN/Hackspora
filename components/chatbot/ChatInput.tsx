"use client"

import { useState, type KeyboardEvent } from "react"
import { PaperAirplaneIcon } from "@heroicons/react/24/solid"
import Button from "@/components/common/Button"
import { useTranslation } from "@/lib/hooks/useTranslation"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder,
}: ChatInputProps) {
  const { t } = useTranslation()
  const [message, setMessage] = useState("")
  
  const defaultPlaceholder = placeholder || t('chat.input.placeholder')

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={defaultPlaceholder}
            disabled={disabled}
            rows={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          icon={<PaperAirplaneIcon className="w-4 h-4" />}
          size="md"
        >
          {t('chat.input.send')}
        </Button>
      </div>
    </div>
  )
}
