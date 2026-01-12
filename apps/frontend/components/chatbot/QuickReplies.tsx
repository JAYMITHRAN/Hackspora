"use client"

import type React from "react"

import Button from "@/components/common/Button"

interface QuickReply {
  id: string
  text: string
  icon?: React.ReactNode
}

interface QuickRepliesProps {
  replies: QuickReply[]
  onReplyClick: (reply: QuickReply) => void
  className?: string
}

export default function QuickReplies({ replies, onReplyClick, className }: QuickRepliesProps) {
  return (
    <div className={`flex flex-wrap gap-2 p-4 bg-gray-50 border-t border-gray-200 ${className}`}>
      <span className="text-sm text-gray-600 w-full mb-2">Quick replies:</span>
      {replies.map((reply) => (
        <Button
          key={reply.id}
          variant="outline"
          size="sm"
          onClick={() => onReplyClick(reply)}
          icon={reply.icon}
          className="text-xs"
        >
          {reply.text}
        </Button>
      ))}
    </div>
  )
}
