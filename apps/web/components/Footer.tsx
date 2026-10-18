import React from 'react'
import { Heart, Scale } from 'lucide-react'
import type { Language } from '@/lib/i18n/content'
import { content } from '@/lib/i18n/content'
import { GithubIcon } from '@/components/icons'

interface FooterProps {
  lang: Language
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = content[lang].footer

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100 dark:bg-[#0c0c0d] py-12 text-xs text-neutral-500 dark:text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          {/* Brand info */}
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt="Strand" className="w-7 h-7 rounded-lg" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                Strand
              </div>
              <div className="text-[11px] text-neutral-500">{t.tagline}</div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <a
              href="https://github.com/extrastu/Strand/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {t.links.releases}
            </a>
            <a
              href="https://github.com/extrastu/Strand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>{t.links.repo}</span>
            </a>
            <a
              href="https://github.com/extrastu/Strand/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <Scale className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t.links.license}</span>
            </a>
            <a
              href="https://github.com/extrastu/Strand/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {t.links.issues}
            </a>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px]">
          <div>
            <p>{t.disclaimer}</p>
            <p className="mt-1">
              © {new Date().getFullYear()} Strand Project. {t.rights} ·{' '}
              <a
                href="https://github.com/extrastu/Strand/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                {t.licenseNote}
              </a>
            </p>
          </div>
          <div className="flex items-center gap-1 text-neutral-400">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span>for macOS creators</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
