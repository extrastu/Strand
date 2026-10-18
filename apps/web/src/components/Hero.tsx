import React from 'react'
import { Download, Sparkles, Apple, ArrowRight, ShieldCheck } from 'lucide-react'
import type { Language } from '../i18n/content'
import { content } from '../i18n/content'

interface HeroProps {
  lang: Language
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = content[lang].hero

  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-grid">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-gradient-to-tr from-neutral-200/50 to-neutral-300/30 dark:from-neutral-800/20 dark:to-neutral-700/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 mb-8 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
          <span>{t.badge}</span>
          <ArrowRight className="w-3 h-3 text-neutral-400" />
        </div>

        {/* Primary Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.08] mb-6">
          {t.titlePrimary}
          <br />
          <span className="bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-300 dark:to-neutral-400 bg-clip-text text-transparent">
            {t.titleSecondary}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
          {t.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-8">
          <a
            href="#download"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md hover:bg-neutral-800 dark:hover:bg-white active:scale-98 transition-all"
          >
            <Apple className="w-4 h-4 fill-current" />
            <div className="text-left">
              <div className="font-semibold">{t.downloadDmg}</div>
              <div className="text-[11px] opacity-75">{t.downloadDmgSub}</div>
            </div>
          </a>

          <a
            href="#download"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-neutral-500" />
            <span>{t.downloadZip}</span>
          </a>
        </div>

        {/* Trust Badges / Platform Specs */}
        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t.platformNote}</span>
        </div>
      </div>
    </section>
  )
}
