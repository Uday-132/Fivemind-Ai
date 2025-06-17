import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Five Mind AI',
  description: 'Powerful AI agents for coding, design, image generation, research automation, and movie recommendations',
  keywords: 'AI, agents, coding, design, image generation, research, automation, movie recommendations, IMDb',
  authors: [{ name: 'Five Mind AI' }],
  creator: 'Five Mind AI',
  publisher: 'Five Mind AI',
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