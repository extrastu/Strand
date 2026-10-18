'use client'

import React, { useEffect, useState } from 'react'
import type { Language } from '@/lib/i18n/content'
import { detectBrowserLanguage } from '@/lib/i18n/detect'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { AppMockup } from '@/components/AppMockup'
import { Features } from '@/components/Features'
import { Shortcuts } from '@/components/Shortcuts'
import { DownloadSection } from '@/components/DownloadSection'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

export const LandingPage: React.FC = () => {
  const [lang, setLang] = useState<Language>('en')
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    // Follow browser language, fallback to 'en' if unmatched
    setLang(detectBrowserLanguage())

    const savedTheme = localStorage.getItem('strand_theme')
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('strand_lang', lang)
    document.documentElement.lang = lang
  }, [lang, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('strand_theme', darkMode ? 'dark' : 'light')
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode, mounted])

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
