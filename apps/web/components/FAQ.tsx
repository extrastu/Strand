'use client'

import React from 'react'
import type { Language } from '@/lib/i18n/content'
import { content } from '@/lib/i18n/content'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQProps {
  lang: Language
}

export const FAQ: React.FC<FAQProps> = ({ lang }) => {
  const t = content[lang].faq

  return (
    <section id="faq" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-900/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-medium tracking-wider text-neutral-500 uppercase">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
            {t.title}
          </h2>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#151517] p-6 shadow-2xs">
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {t.items.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
