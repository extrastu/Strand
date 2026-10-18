import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://istrand.vercel.app'),
  title: {
    default: 'Strand — Elegant Multi-Account Client for Threads on macOS',
    template: '%s | Strand — Threads Client for macOS',
  },
  description:
    'Strand is an unofficial, native-inspired desktop client for Threads on macOS. Seamlessly manage multiple accounts with isolated partitions, pure monochrome aesthetics, and privacy-first local storage.',
  keywords: [
    'Threads for Mac',
    'Threads desktop client',
    'macOS Threads app',
    'multi-account Threads',
    'Threads client macOS',
    'Strand',
    'Strand app',
    'Threads 桌面版',
    'Threads 电脑客户端',
    'Threads 多账号管理',
    'Mac 版 Threads',
    'Threads dark mode Mac',
    'multi-session Threads',
    'Apple Silicon Threads app',
  ],
  authors: [{ name: 'extrastu', url: 'https://github.com/extrastu' }],
  creator: 'extrastu',
  publisher: 'Strand',
  applicationName: 'Strand',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.png', sizes: '180x180' }],
    shortcut: ['/favicon.svg'],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
    url: 'https://istrand.vercel.app',
    title: 'Strand — Multi-Account Threads Client for macOS',
    description:
      'Seamlessly switch between multiple Threads accounts on macOS with strictly isolated sandboxed sessions and native monochrome elegance.',
    siteName: 'Strand',
    images: [
      {
        url: 'https://istrand.vercel.app/icon.png',
        width: 512,
        height: 512,
        alt: 'Strand — Multi-Account Client for Threads on macOS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strand — Multi-Account Threads Client for macOS',
    description:
      'Seamlessly switch between multiple Threads accounts with isolated sessions and a minimalist macOS experience.',
    images: ['https://istrand.vercel.app/icon.png'],
    creator: '@extrastu',
  },
  alternates: {
    canonical: 'https://istrand.vercel.app',
    languages: {
      'en-US': 'https://istrand.vercel.app',
      'zh-CN': 'https://istrand.vercel.app',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'social networking',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Strand',
  url: 'https://istrand.vercel.app',
  downloadUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.1/Strand-0.2.1-darwin-arm64.dmg',
  screenshot: 'https://istrand.vercel.app/icon.png',
  operatingSystem: 'macOS 13.0 or later (Ventura, Sonoma, Sequoia)',
  applicationCategory: 'SocialNetworkingApplication',
  softwareVersion: '0.2.1',
  description:
    'An unofficial, privacy-first multi-account desktop client for Threads on macOS with isolated sessions, native monochrome aesthetics, and custom shortcuts.',
  author: {
    '@type': 'Person',
    name: 'extrastu',
    url: 'https://github.com/extrastu',
  },
  sameAs: [
    'https://github.com/extrastu/Strand',
    'https://www.threads.com/@thre.addrop',
  ],
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
        <Analytics />
      </body>
    </html>
  )
}
