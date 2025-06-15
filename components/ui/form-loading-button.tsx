'use client'

import { Button } from './button'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface FormLoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function FormLoadingButton({ 
  loading = false, 
  children, 
  disabled,
  variant = 'default',
  size = 'default',
  className,
  ...props 
}: FormLoadingButtonProps) {
  return (
    <Button 
      variant={variant}
      size={size}
      className={`${className} ${loading ? 'cursor-wait' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
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
    </Button>
  )
}