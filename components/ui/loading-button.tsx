'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { EnhancedButton } from './enhanced-button'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface LoadingButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'gradient' | 'outline'
  className?: string
}

export function LoadingButton({ href, children, variant = 'gradient', className }: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Reset loading state when pathname changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Don't show loading if we're already on this page
    if (pathname === href) {
      return
    }
    
    setIsLoading(true)
    
    // Add a small delay to show loading state
    setTimeout(() => {
      router.push(href)
    }, 100)
  }

  return (
    <EnhancedButton 
      variant={variant}
      className={`${className} ${isLoading ? 'cursor-wait' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <motion.div 
          className="flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </motion.div>
      ) : (
        children
      )}
    </EnhancedButton>
  )
}