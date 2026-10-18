import React from 'react'
import { Users, Palette, ShieldCheck, Command, Languages, Zap } from 'lucide-react'
import type { Language } from '@/lib/i18n/content'
import { content } from '@/lib/i18n/content'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface FeaturesProps {
  lang: Language
}

const iconMap = {
  Users,
  Palette,
  ShieldCheck,
  Command,
  Languages,
  Zap,
}

export const Features: React.FC<FeaturesProps> = ({ lang }) => {
  const t = content[lang].features

  return (
    <section id="features" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-medium tracking-wider text-neutral-500 uppercase">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2 mb-4">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            {t.subtitle}
          </p>
        </div>

        {/* Feature Grid with shadcn Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.items.map((item, idx) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Zap
            return (
              <Card
                key={idx}
                className="group p-6 border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-2xs hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100 mb-4 group-hover:scale-105 transition-transform duration-200">
                  <IconComponent className="w-5 h-5" />
                </div>
                <CardTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.desc}
                </CardDescription>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
