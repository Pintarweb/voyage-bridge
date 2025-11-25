'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'en-US' | 'zh-CN' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ja-JP' | 'ko-KR' | 'ar-SA'

interface LanguageContextType {
    language: Language
    setLanguage: (language: Language) => void
    languageName: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_NAMES: Record<Language, string> = {
    'en-US': 'English (US)',
    'zh-CN': '简体中文',
    'es-ES': 'Español',
    'fr-FR': 'Français',
    'de-DE': 'Deutsch',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
    'ar-SA': 'العربية'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en-US')

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            languageName: LANGUAGE_NAMES[language]
        }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
