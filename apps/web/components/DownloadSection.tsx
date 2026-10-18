'use client'

import React from 'react'
import { Download, AlertCircle, FileArchive, CheckCircle2 } from 'lucide-react'
import type { Language } from '@/lib/i18n/content'
import { content } from '@/lib/i18n/content'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppleIcon } from '@/components/icons'

interface DownloadSectionProps {
  lang: Language
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ lang }) => {
  const t = content[lang].downloadSection

  return (
    <section id="download" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-medium tracking-wider text-neutral-500 uppercase">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2 mb-3">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            {t.subtitle}
          </p>
        </div>

        {/* Download Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* DMG Card */}
          <div className="relative p-6 sm:p-8 rounded-2xl border-2 border-neutral-900 dark:border-white bg-white dark:bg-[#151517] shadow-lg flex flex-col justify-between">
            <div className="absolute top-4 right-4">
              <Badge className="uppercase tracking-wide text-[10px]">
                Recommended
              </Badge>
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center mb-5 shadow-xs">
                <AppleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {t.appleSilicon.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                {t.appleSilicon.desc}
              </p>
              <div className="space-y-1.5 mb-8 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Version 0.2.0 · Universal binary ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Interactive DMG with Applications folder shortcut</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              asChild
              className="w-full py-3.5 rounded-xl text-sm font-semibold shadow-md"
            >
              <a
                href="https://github.com/extrastu/Strand/releases/download/v0.2.0/Strand-0.2.0-darwin-arm64.dmg"
                download
              >
                <Download className="w-4 h-4" />
                <span>{t.appleSilicon.btn}</span>
              </a>
            </Button>
          </div>

          {/* ZIP Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#151517] shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 flex flex-col justify-between transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-5">
                <FileArchive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {t.zipPackage.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                {t.zipPackage.desc}
              </p>
              <div className="space-y-1.5 mb-8 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Extract & launch anywhere</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sealed ad-hoc codesign</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full py-3.5 rounded-xl text-sm font-semibold shadow-2xs"
            >
              <a
                href="https://github.com/extrastu/Strand/releases/download/v0.2.0/Strand-0.2.0-darwin-arm64.zip"
                download
              >
                <Download className="w-4 h-4 text-neutral-500" />
                <span>{t.zipPackage.btn}</span>
              </a>
            </Button>
          </div>
        </div>

        {/* First Launch Tip */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 mb-6">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t.installTipTitle}: </span>
            {t.installTipText}
          </div>
        </div>

        {/* Checksum and Releases Link */}
        <div className="text-center text-xs text-neutral-500">
          <span>{t.checksumNote} </span>
          <a
            href="https://github.com/extrastu/Strand/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white font-medium"
          >
            GitHub Releases &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
