// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Teknodeya - We design and build your ideas',
    template: '%s | Teknodeya',
  },
  description: 'Transform your ideas into powerful digital experiences with Teknodeya. Expert web development, mobile apps, UI/UX design, and creative solutions.',
  keywords: ['web development', 'mobile apps', 'UI/UX design', 'creative design', 'digital agency'],
  authors: [{ name: 'Teknodeya' }],
  creator: 'Teknodeya',
  publisher: 'Teknodeya',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Teknodeya - We design and build your ideas',
    description: 'Transform your ideas into powerful digital experiences with Teknodeya.',
    url: '/',
    siteName: 'Teknodeya',
    images: [
      {
        url: '/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Teknodeya - We design and build your ideas',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teknodeya - We design and build your ideas',
    description: 'Transform your ideas into powerful digital experiences with Teknodeya.',
    images: ['/assets/og-image.jpg'],
    creator: '@teknodeya',
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
  icons: {
    icon: '/assets/text-logo.png',
    shortcut: '/assets/text-logo.png',
    apple: '/assets/text-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}