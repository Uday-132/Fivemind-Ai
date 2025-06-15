import { Hero } from '@/components/sections/Hero'
import { AgentGrid } from '@/components/sections/AgentGrid'
import { Features } from '@/components/sections/Features'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <AgentGrid />
      <Features />
    </div>
  )
}