'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface LoadingLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
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
    
    if (onClick) {
      onClick()
    }
    
    // Add a small delay to show loading state
    setTimeout(() => {
      router.push(href)
    }, 100)
  }

  return (
    <a
      href={href}
      className={`${className} ${isLoading ? 'cursor-wait' : ''} inline-flex items-center`}
      onClick={handleClick}
    >
      {isLoading && (
        <motion.div 
          className="mr-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="h-3 w-3 animate-spin" />
        </motion.div>
      )}
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>
    </a>
  )
}