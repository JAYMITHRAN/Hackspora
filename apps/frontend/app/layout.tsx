import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import I18nProvider from "@/components/providers/I18nProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CareerPath AI - Your AI-Powered Career Guide",
  description:
    "Discover your ideal career path with AI-powered assessments, personalized recommendations, and expert guidance.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
