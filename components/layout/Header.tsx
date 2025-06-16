'use client'

import Link from 'next/link'
import { LoadingLink } from '@/components/ui/loading-link'
import { Button } from '@/components/ui/button'
import { Brain, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Coding Agent', href: '/agents/coding' },
    { name: 'Design Agent', href: '/agents/design' },
    { name: 'Image Agent', href: '/agents/image' },
    { name: 'Research Agent', href: '/agents/research' },
    { name: 'Movie Agent', href: '/agents/movie' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">AI Agents</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <LoadingLink
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </LoadingLink>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-2">
            {navigation.map((item) => (
              <LoadingLink
                key={item.name}
                href={item.href}
                className="block py-2 text-sm font-medium transition-all duration-200 hover:text-primary hover:translate-x-2 hover:bg-primary/5 rounded px-2 -mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </LoadingLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}