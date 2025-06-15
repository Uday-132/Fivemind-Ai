'use client'

import { motion } from 'framer-motion'
import { Loader2, Sparkles, Zap, Brain } from 'lucide-react'

interface EnhancedLoadingProps {
  variant?: 'default' | 'dots' | 'pulse' | 'brain' | 'sparkles'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function EnhancedLoading({ 
  variant = 'default', 
  size = 'md', 
  text,
  className = ""
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        {text && <span className={`ml-3 ${textSizes[size]} text-muted-foreground`}>{text}</span>}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {text && <span className={`${textSizes[size]} text-muted-foreground`}>{text}</span>}
      </div>
    )
  }

  if (variant === 'brain') {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Brain className={`${sizeClasses[size]} text-primary`} />
        </motion.div>
        {text && <span className={`${textSizes[size]} text-muted-foreground`}>{text}</span>}
      </div>
    )
  }

  if (variant === 'sparkles') {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className={`${sizeClasses[size]} text-primary`} />
          </motion.div>
          
          {/* Floating particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * Math.PI / 2) * 20],
                y: [0, Math.sin(i * Math.PI / 2) * 20],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        {text && <span className={`${textSizes[size]} text-muted-foreground`}>{text}</span>}
      </div>
    )
  }

  // Default spinner
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} text-primary`} />
      </motion.div>
      {text && <span className={`${textSizes[size]} text-muted-foreground`}>{text}</span>}
    </div>
  )
}

// Full screen loading overlay
export function LoadingOverlay({ 
  isVisible, 
  text = "Loading...",
  variant = 'sparkles'
}: {
  isVisible: boolean
  text?: string
  variant?: EnhancedLoadingProps['variant']
}) {
  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-card p-8 rounded-lg shadow-2xl border"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <EnhancedLoading variant={variant} size="lg" text={text} />
      </motion.div>
    </motion.div>
  )
}

// Progress bar loading
export function ProgressLoading({ 
  progress, 
  text,
  className = ""
}: {
  progress: number
  text?: string
  className?: string
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {text && <p className="text-sm text-muted-foreground text-center">{text}</p>}
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="text-center">
        <motion.span
          className="text-xs text-muted-foreground"
          key={progress}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {progress}%
        </motion.span>
      </div>
    </div>
  )
}

// Skeleton loading
export function SkeletonLoading({ 
  lines = 3, 
  className = "" 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{ width: `${100 - (i * 10)}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
    </div>
  )
}