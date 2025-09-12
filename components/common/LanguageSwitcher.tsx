"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Button from "./Button"
import { GlobeAltIcon } from "@heroicons/react/24/outline"

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
    
    // Store language preference in localStorage
    localStorage.setItem('preferred-language', languageCode)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        icon={<GlobeAltIcon className="w-4 h-4" />}
        className="flex items-center gap-2"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                    i18n.language === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {i18n.language === language.code && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
