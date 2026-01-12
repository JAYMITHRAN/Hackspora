"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { ReactNode } from "react"
import clsx from "clsx"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
  children: ReactNode
}

export default function Sidebar0({ isOpen, onClose, title, className, children }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={clsx(
          "fixed top-0 left-0 bottom-0 z-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0", // always visible on desktop
          isOpen ? "translate-x-0" : "-translate-x-full", // toggle on mobile
          className
        )}
      >
        {/* Header (mobile only) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 lg:hidden">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 focus:outline-none"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full p-4">{children}</div>
      </aside>
    </>
  )
}
