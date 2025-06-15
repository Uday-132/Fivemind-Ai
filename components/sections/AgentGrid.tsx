'use client'

import { AnimatedCard } from '@/components/ui/animated-card'
import { LoadingButton } from '@/components/ui/loading-button'
import { StaggerContainer, StaggerItem } from '@/components/ui/page-transition'
import { AnimatedGradientText } from '@/components/ui/animated-background'
import { Code, Palette, Image, Search } from 'lucide-react'
import { motion } from 'framer-motion'

const agents = [
  {
    id: 'coding',
    title: 'AI Coding Agent',
    description: 'Solve LeetCode problems with step-by-step explanations and optimized solutions.',
    icon: Code,
    features: ['Problem Analysis', 'Multiple Solutions', 'Time Complexity', 'Code Explanation'],
    href: '/agents/coding',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20'
  },
  {
    id: 'design',
    title: 'Design-to-Code Agent',
    description: 'Convert Figma designs and images into clean Tailwind CSS + React code.',
    icon: Palette,
    features: ['Figma Integration', 'Image Analysis', 'Responsive Code', 'Component Structure'],
    href: '/agents/design',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20'
  },
  {
    id: 'image',
    title: 'Text-to-Image Agent',
    description: 'Generate stunning images from text descriptions using advanced AI models.',
    icon: Image,
    features: ['AI Generation', 'Multiple Styles', 'High Resolution', 'Instant Download'],
    href: '/agents/image',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20'
  },
  {
    id: 'research',
    title: 'Research Agent',
    description: 'Autonomous web research with multi-source analysis and cited reports.',
    icon: Search,
    features: ['Web Scraping', 'Source Analysis', 'Report Generation', 'Citation Tracking'],
    href: '/agents/research',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20'
  }
]

export function AgentGrid() {
  return (
    <section id="agents" className="container py-16">
      <StaggerContainer>
        <StaggerItem>
          <div className="text-center space-y-4 mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Choose Your <AnimatedGradientText>AI Agent</AnimatedGradientText>
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Each agent is specialized for specific tasks, optimized for performance and cost-effectiveness.
            </motion.p>
          </div>
        </StaggerItem>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent, index) => {
            const Icon = agent.icon
            return (
              <StaggerItem key={agent.id}>
                <AnimatedCard 
                  hoverEffect="tilt" 
                  className="group h-full"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className={`w-12 h-12 rounded-lg ${agent.bgColor} flex items-center justify-center flex-shrink-0`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Icon className={`h-6 w-6 ${agent.color}`} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{agent.title}</h3>
                        <p className="text-muted-foreground text-base">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {agent.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={feature} 
                          className="text-sm text-muted-foreground flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.1 + featureIndex * 0.05 
                          }}
                          viewport={{ once: true }}
                        >
                          <motion.div 
                            className="w-1.5 h-1.5 rounded-full bg-primary mr-2"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              delay: featureIndex * 0.2 
                            }}
                          />
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                    
                    <LoadingButton 
                      href={agent.href}
                      variant="gradient" 
                      className="w-full group"
                    >
                      {agent.id === 'coding' ? 'Coding Agent' : 
                       agent.id === 'design' ? 'Design Agent' : 
                       agent.id === 'image' ? 'Image Agent' : 
                       agent.id === 'research' ? 'Research Agent' : agent.title}
                    </LoadingButton>
                  </div>
                </AnimatedCard>
              </StaggerItem>
            )
          })}
        </div>
      </StaggerContainer>
    </section>
  )
}