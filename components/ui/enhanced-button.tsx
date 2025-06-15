'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface EnhancedButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow' | 'gradient'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden"
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      glow: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
      gradient: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:from-pink-600 hover:via-red-600 hover:to-yellow-600"
    }
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    }

    const buttonVariants = {
      initial: { scale: 1 },
      hover: { 
        scale: 1.05,
        transition: { type: "spring" as const, stiffness: 400, damping: 10 }
      },
      tap: { 
        scale: 0.95,
        transition: { type: "spring" as const, stiffness: 400, damping: 10 }
      }
    }

    const rippleVariants = {
      initial: { scale: 0, opacity: 0.5 },
      animate: { 
        scale: 4, 
        opacity: 0,
        transition: { duration: 0.6, ease: "easeOut" as const }
      }
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {/* Ripple effect */}
        <motion.span
          className="absolute inset-0 bg-white/20 rounded-full"
          variants={rippleVariants}
          initial="initial"
          whileTap="animate"
        />
        
        {/* Glow effect for glow variant */}
        {variant === 'glow' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur-md -z-10"
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Shimmer effect for gradient variant */}
        {variant === 'gradient' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
        
        <span className="relative z-10">{children}</span>
      </motion.button>
    )
  }
)

EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton }

// Floating Action Button
export function FloatingActionButton({ 
  children, 
  className = "",
  ...props 
}: EnhancedButtonProps) {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <EnhancedButton
        variant="glow"
        size="lg"
        className={cn("rounded-full w-14 h-14 shadow-2xl", className)}
        {...props}
      >
        {children}
      </EnhancedButton>
    </motion.div>
  )
}

// Magnetic Button
export function MagneticButton({ 
  children, 
  className = "",
  ...props 
}: EnhancedButtonProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        
        e.currentTarget.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)'
      }}
      className="transition-transform duration-200 ease-out"
    >
      <EnhancedButton className={className} {...props}>
        {children}
      </EnhancedButton>
    </motion.div>
  )
}