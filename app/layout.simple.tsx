import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
      <body style={{ fontFamily: '"Courier New", monospace' }}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}