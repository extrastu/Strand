import React from 'react'
import { Download, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import type { Language } from '@/lib/i18n/content'
import { content } from '@/lib/i18n/content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AppleIcon } from '@/components/icons'

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
        <div className="inline-flex items-center mb-8">
          <Badge
            variant="secondary"
            className="gap-2 px-3.5 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
            <span>{t.badge}</span>
            <ArrowRight className="w-3 h-3 text-neutral-400" />
          </Badge>
        </div>

        {/* Primary Heading with Semantic H1 for SEO */}
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
          <Button
            size="lg"
            asChild
            className="w-full sm:w-auto h-auto py-3.5 px-6 rounded-xl shadow-md"
          >
            <a href="#download" className="gap-2.5">
              <AppleIcon className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm leading-tight">{t.downloadDmg}</div>
                <div className="text-[11px] opacity-75 font-normal leading-tight">{t.downloadDmgSub}</div>
              </div>
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto h-auto py-3.5 px-5 rounded-xl shadow-2xs"
          >
            <a href="#download" className="gap-2">
              <Download className="w-4 h-4 text-neutral-500" />
              <span>{t.downloadZip}</span>
            </a>
          </Button>
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
