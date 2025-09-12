"use client"

import type { ReactNode } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Button from "@/components/common/Button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  className?: string
}

export default function Sidebar({ isOpen, onClose, children, title, className }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50",
          isOpen ? "translate-x-0" : "translate-x-full",
          "lg:relative lg:translate-x-0 lg:shadow-none lg:border-l lg:border-gray-200",
          className,
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon={<XMarkIcon className="w-4 h-4" />}
            className="lg:hidden"
          />
        </div>
        <div className="p-4 overflow-y-auto h-full">{children}</div>
      </div>
    </>
  )
}
