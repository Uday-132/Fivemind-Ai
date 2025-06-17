'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface CursorProps {
  children?: React.ReactNode
}

export function AdvancedCursor({ children }: CursorProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState('')
  type CursorVariantType = 'default' | 'hover' | 'button' | 'link' | 'text';
  const [cursorVariant, setCursorVariant] = useState<CursorVariantType>('default')
  const [isVisible, setIsVisible] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Check if we're in the browser and on a desktop device
    if (typeof window === 'undefined') return
    
    // Only enable custom cursor on desktop devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) return

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Handle interactive elements
    const handleElementHover = () => {
      setIsHovering(true)
      setCursorVariant('hover')
    }

    const handleElementLeave = () => {
      setIsHovering(false)
      setCursorVariant('default')
      setCursorText('')
    }

    const handleButtonHover = (e: Event) => {
      const target = e.target as HTMLElement
      setIsHovering(true)
      setCursorVariant('button')
      setCursorText(target.textContent?.slice(0, 20) || 'Click')
    }

    const handleLinkHover = (e: Event) => {
      const target = e.target as HTMLElement
      setIsHovering(true)
      setCursorVariant('link')
      setCursorText('View')
    }

    const handleTextHover = () => {
      setIsHovering(true)
      setCursorVariant('text')
    }

    // Add event listeners to interactive elements
    const buttons = document.querySelectorAll('button, [role="button"]')
    const links = document.querySelectorAll('a')
    const textElements = document.querySelectorAll('input, textarea')
    const interactiveElements = document.querySelectorAll('[data-cursor="hover"]')

    buttons.forEach(button => {
      button.addEventListener('mouseenter', handleButtonHover)
      button.addEventListener('mouseleave', handleElementLeave)
    })

    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover)
      link.addEventListener('mouseleave', handleElementLeave)
    })

    textElements.forEach(element => {
      element.addEventListener('mouseenter', handleTextHover)
      element.addEventListener('mouseleave', handleElementLeave)
    })

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleElementHover)
      element.addEventListener('mouseleave', handleElementLeave)
    })

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', moveCursor)
        window.removeEventListener('mouseenter', handleMouseEnter)
        window.removeEventListener('mouseleave', handleMouseLeave)
      }
      
      buttons.forEach(button => {
        button.removeEventListener('mouseenter', handleButtonHover)
        button.removeEventListener('mouseleave', handleElementLeave)
      })

      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHover)
        link.removeEventListener('mouseleave', handleElementLeave)
      })

      textElements.forEach(element => {
        element.removeEventListener('mouseenter', handleTextHover)
        element.removeEventListener('mouseleave', handleElementLeave)
      })

      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleElementHover)
        element.removeEventListener('mouseleave', handleElementLeave)
      })
    }
  }, [cursorX, cursorY])

  const cursorVariants = {
    default: {
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      border: '2px solid rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
    },
    hover: {
      scale: 1.5,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      border: '2px solid rgba(59, 130, 246, 0.3)',
      backdropFilter: 'blur(15px)',
    },
    button: {
      scale: 2,
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      border: '2px solid rgba(34, 197, 94, 0.3)',
      backdropFilter: 'blur(20px)',
    },
    link: {
      scale: 1.8,
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      border: '2px solid rgba(168, 85, 247, 0.3)',
      backdropFilter: 'blur(15px)',
    },
    text: {
      scale: 0.5,
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      border: '2px solid rgba(239, 68, 68, 0.3)',
      backdropFilter: 'blur(10px)',
    }
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        variants={cursorVariants}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28
        }}
        initial={{ opacity: 0 }}
        animate={{
          ...cursorVariants[cursorVariant],
          opacity: isVisible ? 1 : 0
        }}
      />
      
      {/* Cursor Text */}
      {cursorText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998] text-xs font-medium text-white bg-black/80 px-2 py-1 rounded-md"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: -40 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {cursorText}
        </motion.div>
      )}

      {/* Cursor Trail */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 rounded-full pointer-events-none z-[9997] bg-gradient-to-r from-blue-500 to-purple-500"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 0.6 : 0 }}
      />

      {children}
    </>
  )
}

// Hook for cursor interactions
export function useCursor() {
  const setCursorVariant = (variant: string) => {
    document.body.setAttribute('data-cursor', variant)
  }

  const setCursorText = (text: string) => {
    document.body.setAttribute('data-cursor-text', text)
  }

  return { setCursorVariant, setCursorText }
}