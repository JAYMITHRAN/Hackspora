"use client"

import type React from "react"

import { type InputHTMLAttributes, type SelectHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface BaseFieldProps {
  label?: string
  error?: string
  required?: boolean
  icon?: React.ReactNode
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {
  options: Array<{ value: string; label: string; icon?: string }>
}

interface SliderProps extends BaseFieldProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  emoji?: string
}

interface CheckboxCardProps extends BaseFieldProps {
  options: Array<{ value: string; label: string; icon?: string; color?: string }>
  value: string[]
  onChange: (value: string[]) => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, required, icon, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
            icon && "pl-10",
            error && "border-red-300 focus:ring-red-500",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
})

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, required, icon, options, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">{icon}</div>}
          <select
            className={cn(
              "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white",
              icon && "pl-10",
              error && "border-red-300 focus:ring-red-500",
              className,
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon && `${option.icon} `}
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)

function Slider({ label, error, required, value, onChange, min = 0, max = 10, step = 1, emoji }: SliderProps) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {emoji && `${emoji} `}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Beginner ({min})</span>
          <span className="font-medium text-blue-600">Current: {value}</span>
          <span>Expert ({max})</span>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

function CheckboxCards({ label, error, required, options, value, onChange }: CheckboxCardProps) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={cn(
              "p-4 rounded-lg border-2 transition-all duration-200 text-left",
              value.includes(option.value)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white",
              option.color || "text-gray-700",
            )}
          >
            <div className="flex items-center space-x-2">
              {option.icon && <span className="text-lg">{option.icon}</span>}
              <span className="font-medium text-sm">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

Input.displayName = "Input"
Select.displayName = "Select"

export { Input, Select, Slider, CheckboxCards }
