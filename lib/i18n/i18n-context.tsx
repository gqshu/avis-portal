"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { translations } from "./translations"

type Locale = "en" | "fr"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  // Load locale from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("locale") as Locale
      if (savedLocale && ["en", "fr"].includes(savedLocale)) {
        setLocale(savedLocale)
      }
    }
  }, [])

  // Save locale to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale)
    }
  }, [locale])

  // Translation function with improved error handling
  const t = useCallback(
    (key: string, params: Record<string, string | number> = {}): string => {
      try {
        // Check if the key exists in the translations for the current locale
        const localeTranslations = translations[locale]

        if (!localeTranslations) {
          console.error(`Locale "${locale}" not found in translations`)
          return key
        }

        // Check if the key exists in the current locale
        if (key in localeTranslations) {
          let translation = localeTranslations[key]

          // Replace parameters in the translation
          Object.entries(params).forEach(([paramKey, paramValue]) => {
            translation = translation.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue))
          })

          return translation
        }

        // If the key doesn't exist in the current locale, try English as fallback
        if (locale !== "en" && translations.en && key in translations.en) {
          console.warn(`Translation key "${key}" not found in "${locale}" locale, falling back to English`)

          let translation = translations.en[key]

          // Replace parameters in the fallback translation
          Object.entries(params).forEach(([paramKey, paramValue]) => {
            translation = translation.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue))
          })

          return translation
        }

        // If the key doesn't exist in any locale, return the key itself
        console.error(`Translation key "${key}" not found in any locale`)
        return key
      } catch (error) {
        console.error(`Error translating key "${key}":`, error)
        return key
      }
    },
    [locale],
  )

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export const useTranslation = useI18n
