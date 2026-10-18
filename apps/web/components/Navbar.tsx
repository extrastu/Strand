'use client'

import React, { useState } from 'react'
import { Moon, Sun, Globe, Download, Menu, X } from 'lucide-react'
import type { Language } from '@/lib/i18n/content'
import { content } from '@/lib/i18n/content'
import { Button } from '@/components/ui/button'
import { GithubIcon } from '@/components/icons'

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
        <a href="/" className="flex items-center gap-2.5 group">
          <img
            src="/icon.svg"
            alt="Strand Logo"
            className="w-8 h-8 rounded-lg shadow-xs transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-neutral-50">
              Strand
            </span>
            <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              v0.2.2
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <a
            href="/#features"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t.features}
          </a>
          <a
            href="/#showcase"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t.showcase}
          </a>
          <a
            href="/#shortcuts"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t.shortcuts}
          </a>
          <a
            href="/#faq"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t.faq}
          </a>
          <a
            href="/changelog"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t.changelog}
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Language Switch */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="gap-1.5 text-xs text-neutral-700 dark:text-neutral-300"
            title="Switch Language / 切换语言"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? '中文' : 'EN'}</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="h-8 w-8 text-neutral-700 dark:text-neutral-300"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* GitHub Source */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-neutral-700 dark:text-neutral-300"
          >
            <a
              href="https://github.com/extrastu/Strand"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </Button>

          {/* Download CTA */}
          <Button size="sm" asChild className="ml-1 rounded-lg">
            <a href="/#download" className="gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>{t.download}</span>
            </a>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="h-8 w-8 text-neutral-700 dark:text-neutral-300"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-8 w-8 text-neutral-700 dark:text-neutral-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 px-5 py-4 space-y-3">
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {t.features}
          </a>
          <a
            href="/#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {t.showcase}
          </a>
          <a
            href="/#shortcuts"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {t.shortcuts}
          </a>
          <a
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {t.faq}
          </a>
          <a
            href="/changelog"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {t.changelog}
          </a>
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLang}
              className="gap-1.5 text-xs text-neutral-700 dark:text-neutral-300"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? '切换为中文' : 'Switch to English'}</span>
            </Button>
            <Button size="sm" asChild>
              <a href="/#download" onClick={() => setMobileMenuOpen(false)} className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>{t.download}</span>
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
