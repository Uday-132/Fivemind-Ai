import { Brain, Github, Twitter } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold">AI Agents</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powerful AI agents for coding, design, image generation, research automation, and movie recommendations.
            </p>
          </div>

          <div className="text-right">
            <h3 className="font-semibold mb-4">Agents</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/agents/coding" className="text-muted-foreground hover:text-primary transition-colors">Coding Agent</Link></li>
              <li><Link href="/agents/design" className="text-muted-foreground hover:text-primary transition-colors">Design Agent</Link></li>
              <li><Link href="/agents/image" className="text-muted-foreground hover:text-primary transition-colors">Image Agent</Link></li>
              <li><Link href="/agents/research" className="text-muted-foreground hover:text-primary transition-colors">Research Agent</Link></li>
              <li><Link href="/agents/movie" className="text-muted-foreground hover:text-primary transition-colors">Movie Agent</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 AI Agents Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}