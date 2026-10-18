import React, { useEffect, useState } from 'react'
import type { Language } from './i18n/content'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { AppMockup } from './components/AppMockup'
import { Features } from './components/Features'
import { Shortcuts } from './components/Shortcuts'
import { DownloadSection } from './components/DownloadSection'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'

export const App: React.FC = () => {
  // Initialize language from browser preference or fallback to en
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('strand_lang') as Language
      if (saved === 'en' || saved === 'zh-CN') return saved
      return navigator.language.startsWith('zh') ? 'zh-CN' : 'en'
    }
    return 'en'
  })

  // Initialize theme from system or user preference
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('strand_theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('strand_lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    localStorage.setItem('strand_theme', darkMode ? 'dark' : 'light')
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-[#0d0d0e] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 transition-colors duration-200">
      <Navbar lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1">
        <Hero lang={lang} />
        <AppMockup lang={lang} darkMode={darkMode} />
        <Features lang={lang} />
        <Shortcuts lang={lang} />
        <DownloadSection lang={lang} />
        <FAQ lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  )
}

export default App
