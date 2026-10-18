import React, { useState } from 'react'
import { Moon, Sun, Globe, Download, Menu, X } from 'lucide-react'
import type { Language } from '../i18n/content'
import { content } from '../i18n/content'

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
)

interface NavbarProps {
  lang: Language
  setLang: (lang: Language) => void
  darkMode: boolean
  setDarkMode: (val: boolean) => void
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang, darkMode, setDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = content[lang].nav

  const toggleLang = () => {
    setLang(lang === 'en' ? 'zh-CN' : 'en')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 glass-nav transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src="/icon.svg"
            alt="Strand Logo"
            className="w-8 h-8 rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-neutral-50">
              Strand
            </span>
            <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              v0.2.0
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <a
            href="#features"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t.features}
          </a>
          <a
            href="#showcase"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t.showcase}
          </a>
          <a
            href="#shortcuts"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t.shortcuts}
          </a>
          <a
            href="#faq"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t.faq}
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Language Switch */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Switch Language / 切换语言"
            aria-label="Switch Language"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'en' ? '中文' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* GitHub Source */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="GitHub Repository"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Download CTA */}
          <a
            href="#download"
            className="ml-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-sm transition-all duration-150 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.download}</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-md text-neutral-700 dark:text-neutral-300"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-neutral-700 dark:text-neutral-300"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 px-5 py-4 space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {t.features}
          </a>
          <a
            href="#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {t.showcase}
          </a>
          <a
            href="#shortcuts"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {t.shortcuts}
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {t.faq}
          </a>
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'en' ? '切换为中文' : 'Switch to English'}</span>
            </button>
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.download}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
