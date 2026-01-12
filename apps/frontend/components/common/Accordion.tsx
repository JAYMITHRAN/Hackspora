"use client"

import { useState, type ReactNode } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

interface AccordionItem {
  id: string
  title: string
  content: ReactNode
  icon?: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export default function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    } else {
      setOpenItems((prev) => (prev.includes(itemId) ? [] : [itemId]))
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)

        return (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                {item.icon && <div className="text-gray-500">{item.icon}</div>}
                <span className="font-medium text-gray-900">{item.title}</span>
              </div>
              <ChevronDownIcon
                className={cn(
                  "w-5 h-5 text-gray-500 transition-transform duration-200",
                  isOpen && "transform rotate-180",
                )}
              />
            </button>
            {isOpen && <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">{item.content}</div>}
          </div>
        )
      })}
    </div>
  )
}
