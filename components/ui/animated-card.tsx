'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: 'tilt' | 'lift' | 'glow' | 'scale' | 'magnetic'
  glowColor?: string
}

export function AnimatedCard({ 
  children, 
  className = "", 
  hoverEffect = 'tilt',
  glowColor = 'blue'
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const cardVariants = {
    initial: { 
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },
    hover: {
      scale: hoverEffect === 'scale' ? 1.05 : hoverEffect === 'lift' ? 1.02 : 1,
      y: hoverEffect === 'lift' ? -10 : 0,
      boxShadow: hoverEffect === 'glow' 
        ? `0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.04)`
        : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    }
  }

  const tiltStyle = hoverEffect === 'tilt' ? {
    rotateX,
    rotateY,
    transformStyle: "preserve-3d" as const
  } : {}

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-lg bg-card text-card-foreground shadow-sm border backdrop-blur-sm",
        hoverEffect === 'glow' && `shadow-${glowColor}-500/20`,
        className
      )}
      style={tiltStyle}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onMouseMove={hoverEffect === 'tilt' ? handleMouseMove : undefined}
      onMouseLeave={hoverEffect === 'tilt' ? handleMouseLeave : undefined}
    >
      {/* Glow effect */}
      {hoverEffect === 'glow' && (
        <motion.div
          className={`absolute -inset-0.5 bg-gradient-to-r from-${glowColor}-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}
          whileHover={{ opacity: 0.75 }}
        />
      )}
      
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0"
        whileHover={{
          opacity: [0, 1, 0],
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

// Stacked Cards Animation
export function StackedCards({ cards }: { cards: ReactNode[] }) {
  return (
    <div className="relative">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{
            scale: 1 - index * 0.05,
            y: index * 10,
            zIndex: cards.length - index,
          }}
          whileHover={{
            scale: 1,
            y: -index * 20,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: index * 0.1
            }
          }}
        >
          {card}
        </motion.div>
      ))}
    </div>
  )
}

// Flip Card
export function FlipCard({ 
  front, 
  back, 
  className = "" 
}: { 
  front: ReactNode
  back: ReactNode
  className?: string 
}) {
  return (
    <motion.div
      className={cn("relative w-full h-64 [perspective:1000px]", className)}
      whileHover={{ rotateY: 180 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      {/* Front */}
      <motion.div
        className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-lg"
        style={{ rotateY: 0 }}
      >
        {front}
      </motion.div>
      
      {/* Back */}
      <motion.div
        className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-lg"
        style={{ rotateY: 180 }}
      >
        {back}
      </motion.div>
    </motion.div>
  )
}

// Expandable Card
export function ExpandableCard({ 
  title, 
  preview, 
  content, 
  className = "" 
}: {
  title: ReactNode
  preview: ReactNode
  content: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn("bg-card rounded-lg border overflow-hidden", className)}
      layout
      initial={{ height: "auto" }}
      whileHover={{ height: "auto" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div layout className="p-6">
        <motion.div layout>{title}</motion.div>
        <motion.div layout>{preview}</motion.div>
        
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          whileHover={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t mt-4">
            {content}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}