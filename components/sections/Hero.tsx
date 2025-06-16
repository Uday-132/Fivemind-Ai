'use client'

import { EnhancedButton, MagneticButton } from '@/components/ui/enhanced-button'
import { AnimatedGradientText } from '@/components/ui/animated-background'
import { StaggerContainer, StaggerItem } from '@/components/ui/page-transition'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="container py-16 md:py-24 relative">
      <StaggerContainer className="text-center space-y-8">
        <StaggerItem>
          <motion.div 
            className="inline-flex items-center rounded-full border px-4 py-2 text-sm backdrop-blur-sm bg-background/50"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
            </motion.div>
            Powered by Advanced AI Models
          </motion.div>
        </StaggerItem>
        
        <StaggerItem>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Five Powerful AI Agents
            <br />
            <AnimatedGradientText>
              One Platform
            </AnimatedGradientText>
          </motion.h1>
        </StaggerItem>
        
        <StaggerItem>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Automate your workflow with specialized AI agents for coding, design, image generation, 
            research, and movie recommendations. Fast, reliable, and cost-effective solutions for modern developers.
          </motion.p>
        </StaggerItem>
        
        <StaggerItem>
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <MagneticButton variant="gradient" size="lg">
              <Link href="#agents" className="flex items-center justify-center">
                Try Agents Now
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Link>
            </MagneticButton>
          </motion.div>
        </StaggerItem>
        
        <StaggerItem>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { value: "5", label: "AI Agents" },
              { value: "99.9%", label: "Uptime" },
              { value: "<2s", label: "Response Time" },
              { value: "Free", label: "Per Request" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 1 + index * 0.1 
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </StaggerItem>
      </StaggerContainer>
      
      {/* Floating Action Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}