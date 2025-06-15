'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Code, Palette, Image, Search, X, Sparkles } from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  {
    icon: Code,
    label: 'Coding Agent',
    href: '/agents/coding',
    color: 'bg-blue-500 hover:bg-blue-600',
    delay: 0.1
  },
  {
    icon: Palette,
    label: 'Design Agent',
    href: '/agents/design',
    color: 'bg-purple-500 hover:bg-purple-600',
    delay: 0.2
  },
  {
    icon: Image,
    label: 'Image Agent',
    href: '/agents/image',
    color: 'bg-green-500 hover:bg-green-600',
    delay: 0.3
  },
  {
    icon: Search,
    label: 'Research Agent',
    href: '/agents/research',
    color: 'bg-orange-500 hover:bg-orange-600',
    delay: 0.4
  }
]

export function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: 20,
                    y: 20
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: 0,
                    y: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0,
                    x: 20,
                    y: 20
                  }}
                  transition={{ 
                    delay: item.delay,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="flex items-center space-x-3"
                >
                  {/* Label */}
                  <motion.div
                    className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.label}
                  </motion.div>
                  
                  {/* Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Link
                      href={item.href}
                      className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white shadow-lg transition-colors`}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={toggleMenu}
        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl relative overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          animate={{
            scale: isOpen ? 1 : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md -z-10"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Icon */}
        <motion.div
          className="relative z-10"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
          )}
        </motion.div>
        
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: isOpen ? 2 : 0, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </div>
  )
}

// Quick access toolbar
export function QuickAccessToolbar() {
  return (
    <motion.div
      className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 space-y-2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            whileHover={{ scale: 1.1, x: -5 }}
            className="group relative"
          >
            <Link
              href={item.href}
              className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white shadow-lg transition-all opacity-70 hover:opacity-100`}
            >
              <Icon className="h-4 w-4" />
            </Link>
            
            {/* Tooltip */}
            <motion.div
              className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
            >
              {item.label}
            </motion.div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}