import type { Metadata } from 'next'
import { ChangelogView } from '@/components/ChangelogView'

export const metadata: Metadata = {
  title: 'Changelog — Strand for macOS',
  description:
    'All releases, new features, performance improvements, and bug fixes for Strand, the elegant multi-account Threads client for macOS.',
  alternates: {
    canonical: 'https://istrand.vercel.app/changelog',
  },
  openGraph: {
    title: 'Changelog — Strand for macOS',
    description:
      'All releases, new features, performance improvements, and bug fixes for Strand, the elegant multi-account Threads client for macOS.',
    url: 'https://istrand.vercel.app/changelog',
    siteName: 'Strand',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog — Strand for macOS',
    description:
      'All releases, new features, performance improvements, and bug fixes for Strand, the elegant multi-account Threads client for macOS.',
  },
}

export default function ChangelogPage() {
  return (
    <>
      <noscript>
        <div className="p-8 max-w-3xl mx-auto font-sans leading-relaxed">
          <h1 className="text-3xl font-bold mb-4">Strand Changelog & Release Notes</h1>
          <p className="mb-6 text-neutral-700">
            Track all releases, new capabilities, and fixes for Strand, the unofficial macOS desktop client for Threads.
          </p>
          <article className="mb-6">
            <h2 className="text-xl font-bold">v0.2.1 (October 18, 2026)</h2>
            <p className="text-neutral-600">
              Dedicated Changelog portal launch, automated release badges, and full SEO enhancements.
            </p>
          </article>
          <article className="mb-6">
            <h2 className="text-xl font-bold">v0.2.0 (October 18, 2026)</h2>
            <p className="text-neutral-600">
              Major architecture evolution to Monorepo, official Next.js 15 landing website, and enhanced multi-account keyboard workflows.
            </p>
          </article>
          <article className="mb-6">
            <h2 className="text-xl font-bold">v0.1.0 (October 16, 2026)</h2>
            <p className="text-neutral-600">
              Initial public release of Strand, the unofficial Threads multi-account client for macOS.
            </p>
          </article>
        </div>
      </noscript>
      <ChangelogView />
    </>
  )
}
