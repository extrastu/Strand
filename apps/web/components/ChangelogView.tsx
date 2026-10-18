'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  ExternalLink,
  Download,
  Calendar,
  Tag,
  Archive,
} from 'lucide-react'
import type { Language } from '@/lib/i18n/content'
import { content } from '@/lib/i18n/content'
import { detectBrowserLanguage } from '@/lib/i18n/detect'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppleIcon, GithubIcon } from '@/components/icons'

export const ChangelogView: React.FC = () => {
  const [lang, setLang] = useState<Language>('en')
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem('strand_lang') as Language | null
    if (savedLang && (savedLang === 'en' || savedLang === 'zh-CN')) {
      setLang(savedLang)
    } else {
      setLang(detectBrowserLanguage())
    }

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

  const t = content[lang].changelogPage

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'features':
        return <Sparkles className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
      case 'improvements':
        return <Zap className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
      case 'fixes':
        return <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
      default:
        return <Tag className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
    }
  }

  const getCategoryLabel = (category: string) => {
    if (category === 'features') return t.categories.features
    if (category === 'improvements') return t.categories.improvements
    if (category === 'fixes') return t.categories.fixes
    return category
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-[#0d0d0e] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 transition-colors duration-200">
      <Navbar lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backHome}</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="pb-10 border-b border-neutral-200 dark:border-neutral-800">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 mb-4">
            <Tag className="w-3 h-3" />
            <span>{t.tag}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Release Timeline */}
        <div className="mt-12 space-y-12">
          {t.releases.map((rel) => (
            <article
              key={rel.version}
              id={rel.version}
              className="relative pl-6 sm:pl-8 border-l border-neutral-200 dark:border-neutral-800 group"
            >
              {/* Timeline node */}
              <div
                className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                  rel.isLatest
                    ? 'bg-neutral-950 dark:bg-white border-neutral-950 dark:border-white ring-4 ring-neutral-200 dark:ring-neutral-800'
                    : 'bg-neutral-300 dark:bg-neutral-700 border-neutral-50 dark:border-neutral-900'
                }`}
              />

              {/* Version & Date Header */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono">
                  {rel.version}
                </h2>
                {rel.isLatest && (
                  <Badge variant="default" className="text-[11px] font-medium tracking-wide">
                    {t.latestBadge}
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono ml-auto sm:ml-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={rel.date}>{rel.date}</time>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                {rel.summary}
              </p>

              {/* Quick download & action buttons if URLs provided */}
              {(rel.dmgUrl || rel.zipUrl || rel.releaseUrl) && (
                <div className="flex flex-wrap items-center gap-2.5 mb-8 p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80">
                  {rel.dmgUrl && (
                    <Button size="sm" asChild className="rounded-lg h-8 text-xs font-medium gap-1.5 shadow-xs">
                      <a href={rel.dmgUrl} download>
                        <AppleIcon className="w-3.5 h-3.5" />
                        <span>{t.downloadDmg}</span>
                      </a>
                    </Button>
                  )}
                  {rel.zipUrl && (
                    <Button variant="outline" size="sm" asChild className="rounded-lg h-8 text-xs font-medium gap-1.5">
                      <a href={rel.zipUrl} download>
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.downloadZip}</span>
                      </a>
                    </Button>
                  )}
                  {rel.releaseUrl && (
                    <Button variant="ghost" size="sm" asChild className="rounded-lg h-8 text-xs font-medium gap-1.5 ml-auto text-neutral-600 dark:text-neutral-300">
                      <a href={rel.releaseUrl} target="_blank" rel="noopener noreferrer">
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>{t.releaseNotes}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {/* Categorized change blocks */}
              <div className="space-y-6">
                {rel.sections.map((section, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-neutral-700 dark:text-neutral-300">
                      {getCategoryIcon(section.category)}
                      <span>{getCategoryLabel(section.category)}</span>
                    </div>
                    <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* GitHub Releases CTA Card */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2 text-base">
              <Archive className="w-4 h-4" />
              <span>Full Historical Archive</span>
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              {lang === 'en'
                ? 'Looking for raw build artifacts, SHA256 hashes, or older pre-releases?'
                : '寻找历史完整构建工件、SHA-256 校验和或早期预发布版本？'}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="rounded-lg gap-2 shrink-0">
            <a
              href="https://github.com/extrastu/Strand/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Releases</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </Button>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
