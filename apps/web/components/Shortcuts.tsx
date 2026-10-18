import React from 'react'
import type { Language } from '@/lib/i18n/content'
import { content } from '@/lib/i18n/content'

interface ShortcutsProps {
  lang: Language
}

export const Shortcuts: React.FC<ShortcutsProps> = ({ lang }) => {
  const t = content[lang].shortcuts

  return (
    <section id="shortcuts" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-mono font-medium tracking-wider text-neutral-500 uppercase">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2 mb-3">
            {t.title}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t.subtitle}
          </p>
        </div>

        <div className="bg-white dark:bg-[#151517] rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 shadow-2xs divide-y divide-neutral-200/70 dark:divide-neutral-800/70 overflow-hidden">
          {t.keys.map((item, index) => (
            <div
              key={index}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 transition-colors"
            >
              <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                {item.desc}
              </div>
              <div className="shrink-0 flex items-center gap-1.5">
                <span className="kbd-cap">{item.key}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
