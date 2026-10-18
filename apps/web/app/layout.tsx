import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://strand.app'),
  title: {
    default: 'Strand — Elegant Multi-Account Client for Threads on macOS',
    template: '%s | Strand',
  },
  description:
    'An unofficial, native-inspired multi-account desktop client for Threads on macOS. Isolated sessions, pure monochrome aesthetics, and privacy-first local storage.',
  keywords: [
    'Threads for Mac',
    'Threads desktop client',
    'macOS Threads app',
    'multi-account Threads',
    'Threads client macOS',
    'Strand',
    'Strand app',
    'Threads dark mode Mac',
    'multi-session Threads',
  ],
  authors: [{ name: 'Strand Open Source Project' }],
  creator: 'Strand Team',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
    url: 'https://strand.app',
    title: 'Strand — Multi-Account Threads Client for macOS',
    description:
      'Seamlessly switch between multiple Threads accounts on macOS with strictly isolated sandboxed sessions.',
    siteName: 'Strand',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Strand macOS Client Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strand — Multi-Account Threads Client for macOS',
    description:
      'Seamlessly switch between multiple Threads accounts with isolated sessions and a minimalist macOS experience.',
    images: ['/icon.png'],
  },
  alternates: {
    canonical: 'https://strand.app',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Strand',
  operatingSystem: 'macOS 13.0 or later (Ventura, Sonoma, Sequoia)',
  applicationCategory: 'SocialNetworkingApplication',
  softwareVersion: '0.2.0',
  description:
    'An unofficial, privacy-first multi-account desktop client for Threads on macOS with isolated sessions and pure monochrome aesthetics.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '128',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-neutral-50 text-neutral-900 antialiased dark:bg-[#0d0d0e] dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 transition-colors duration-200">
        {children}
      </body>
    </html>
  )
}
