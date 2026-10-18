import React from 'react'
import { Heart } from 'lucide-react'
import type { Language } from '../i18n/content'
import { content } from '../i18n/content'

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
)

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
          <div className="flex items-center gap-6 font-medium">
            <a
              href="#download"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {t.links.releases}
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>{t.links.repo}</span>
            </a>
            <a
              href="https://github.com"
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
              © {new Date().getFullYear()} Strand Project. {t.rights}
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
