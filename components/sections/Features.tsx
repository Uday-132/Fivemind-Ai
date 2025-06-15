import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Shield, DollarSign, Clock, Globe, Cpu } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized AI models with sub-2 second response times for most tasks.'
  },
  {
    icon: DollarSign,
    title: 'Free Cost',
    description: 'It is Free of Cost'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never stored. Complete privacy guaranteed.'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Always-on service with 99.9% uptime SLA and global edge deployment.'
  },
  {
    icon: Cpu,
    title: 'Smart Caching',
    description: 'Intelligent caching reduces costs and improves response times for similar requests.'
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Support for 50+ programming languages and natural languages worldwide.'
  }
]

export function Features() {
  return (
    <section className="container py-16 bg-muted/30">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Why Choose Our Platform?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built for developers who need reliable, fast, and cost-effective AI automation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}