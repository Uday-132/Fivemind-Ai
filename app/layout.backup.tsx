import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdvancedCursor } from '@/components/ui/advanced-cursor'
import { AnimatedBackground, FloatingElements } from '@/components/ui/animated-background'
import { PageTransition } from '@/components/ui/page-transition'
import { FloatingActionMenu } from '@/components/ui/floating-action-menu'
import { PageLoading } from '@/components/ui/page-loading'

export const metadata: Metadata = {
  title: 'AI Agents Platform',
  description: 'Powerful AI agents for coding, design, image generation, research automation, and movie recommendations',
  keywords: 'AI, agents, coding, design, image generation, research, automation, movie recommendations, IMDb',
  authors: [{ name: 'AI Agents Platform' }],
  creator: 'AI Agents Platform',
  publisher: 'AI Agents Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="cursor-none" style={{ fontFamily: '"Courier New", monospace' }}>
        <Providers>
          <AdvancedCursor>
            <AnimatedBackground />
            <FloatingElements />
            <PageLoading />
            <div className="min-h-screen flex flex-col relative z-10">
              <Header />
              <main className="flex-1">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <Footer />
              <FloatingActionMenu />
            </div>
          </AdvancedCursor>
        </Providers>
      </body>
    </html>
  )
}