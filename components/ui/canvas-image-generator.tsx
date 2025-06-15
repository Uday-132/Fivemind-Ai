'use client'

import { useEffect, useRef } from 'react'

interface CanvasImageGeneratorProps {
  prompt: string
  onImageGenerated: (imageDataUrl: string) => void
  width?: number
  height?: number
}

export function CanvasImageGenerator({ 
  prompt, 
  onImageGenerated, 
  width = 1024, 
  height = 1024 
}: CanvasImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !prompt) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Generate image based on prompt
    generateCanvasImage(ctx, prompt, width, height)
      .then(() => {
        const imageDataUrl = canvas.toDataURL('image/png')
        onImageGenerated(imageDataUrl)
      })
      .catch(console.error)
  }, [prompt, width, height, onImageGenerated])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'none' }}
      width={width}
      height={height}
    />
  )
}

async function generateCanvasImage(
  ctx: CanvasRenderingContext2D,
  prompt: string,
  width: number,
  height: number
) {
  // Analyze prompt for visual elements
  const analysis = analyzePromptForCanvas(prompt)
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Create background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, analysis.colors.primary)
  gradient.addColorStop(0.5, analysis.colors.secondary)
  gradient.addColorStop(1, analysis.colors.accent)
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Add artistic elements based on prompt analysis
  await drawArtisticElements(ctx, analysis, width, height)
  
  // Add text elements
  drawTextElements(ctx, prompt, analysis, width, height)
  
  // Add finishing touches
  addFinishingTouches(ctx, width, height)
}

function analyzePromptForCanvas(prompt: string) {
  const lowerPrompt = prompt.toLowerCase()
  
  // Enhanced color analysis
  let colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    text: '#ffffff'
  }
  
  // Color keywords mapping
  if (lowerPrompt.includes('sunset') || lowerPrompt.includes('orange') || lowerPrompt.includes('warm')) {
    colors = { primary: '#ff7e5f', secondary: '#feb47b', accent: '#ff6b6b', text: '#ffffff' }
  } else if (lowerPrompt.includes('ocean') || lowerPrompt.includes('blue') || lowerPrompt.includes('water')) {
    colors = { primary: '#4facfe', secondary: '#00f2fe', accent: '#667eea', text: '#ffffff' }
  } else if (lowerPrompt.includes('forest') || lowerPrompt.includes('green') || lowerPrompt.includes('nature')) {
    colors = { primary: '#11998e', secondary: '#38ef7d', accent: '#7ed321', text: '#ffffff' }
  } else if (lowerPrompt.includes('fire') || lowerPrompt.includes('red') || lowerPrompt.includes('passion')) {
    colors = { primary: '#ff416c', secondary: '#ff4b2b', accent: '#ff6b6b', text: '#ffffff' }
  } else if (lowerPrompt.includes('night') || lowerPrompt.includes('dark') || lowerPrompt.includes('moon')) {
    colors = { primary: '#2c3e50', secondary: '#34495e', accent: '#9b59b6', text: '#ecf0f1' }
  } else if (lowerPrompt.includes('gold') || lowerPrompt.includes('luxury') || lowerPrompt.includes('elegant')) {
    colors = { primary: '#f7971e', secondary: '#ffd200', accent: '#ffb347', text: '#2c3e50' }
  }
  
  // Theme analysis
  const themes = []
  if (lowerPrompt.includes('space') || lowerPrompt.includes('star') || lowerPrompt.includes('galaxy')) themes.push('space')
  if (lowerPrompt.includes('flower') || lowerPrompt.includes('garden') || lowerPrompt.includes('botanical')) themes.push('floral')
  if (lowerPrompt.includes('geometric') || lowerPrompt.includes('pattern') || lowerPrompt.includes('abstract')) themes.push('geometric')
  if (lowerPrompt.includes('mountain') || lowerPrompt.includes('landscape') || lowerPrompt.includes('scenery')) themes.push('landscape')
  if (lowerPrompt.includes('city') || lowerPrompt.includes('urban') || lowerPrompt.includes('building')) themes.push('urban')
  if (lowerPrompt.includes('wave') || lowerPrompt.includes('flow') || lowerPrompt.includes('fluid')) themes.push('fluid')
  
  // Mood analysis
  let mood = 'balanced'
  if (lowerPrompt.includes('calm') || lowerPrompt.includes('peaceful') || lowerPrompt.includes('serene')) mood = 'calm'
  else if (lowerPrompt.includes('energetic') || lowerPrompt.includes('vibrant') || lowerPrompt.includes('dynamic')) mood = 'energetic'
  else if (lowerPrompt.includes('mysterious') || lowerPrompt.includes('dark') || lowerPrompt.includes('gothic')) mood = 'mysterious'
  
  return {
    colors,
    themes,
    mood,
    words: prompt.split(' ').filter(word => word.length > 2).slice(0, 8)
  }
}

async function drawArtisticElements(
  ctx: CanvasRenderingContext2D,
  analysis: any,
  width: number,
  height: number
) {
  ctx.globalAlpha = 0.6
  
  if (analysis.themes.includes('space')) {
    drawStars(ctx, width, height)
    drawPlanets(ctx, analysis.colors, width, height)
  } else if (analysis.themes.includes('floral')) {
    drawFloralPatterns(ctx, analysis.colors, width, height)
  } else if (analysis.themes.includes('geometric')) {
    drawGeometricPatterns(ctx, analysis.colors, width, height)
  } else if (analysis.themes.includes('landscape')) {
    drawLandscape(ctx, analysis.colors, width, height)
  } else if (analysis.themes.includes('fluid')) {
    drawFluidShapes(ctx, analysis.colors, width, height)
  } else {
    drawAbstractArt(ctx, analysis.colors, width, height)
  }
  
  ctx.globalAlpha = 1.0
}

function drawStars(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 3 + 1
    
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    
    // Add sparkle effect
    if (Math.random() > 0.7) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x - radius * 2, y)
      ctx.lineTo(x + radius * 2, y)
      ctx.moveTo(x, y - radius * 2)
      ctx.lineTo(x, y + radius * 2)
      ctx.stroke()
    }
  }
}

function drawPlanets(ctx: CanvasRenderingContext2D, colors: any, width: number, height: number) {
  // Draw a few planets
  const planets = [
    { x: width * 0.2, y: height * 0.3, radius: 60, color: colors.accent },
    { x: width * 0.8, y: height * 0.7, radius: 40, color: colors.secondary },
    { x: width * 0.7, y: height * 0.2, radius: 30, color: colors.primary }
  ]
  
  planets.forEach(planet => {
    // Planet body
    const gradient = ctx.createRadialGradient(
      planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.3, 0,
      planet.x, planet.y, planet.radius
    )
    gradient.addColorStop(0, planet.color)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawFloralPatterns(ctx: CanvasRenderingContext2D, colors: any, width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2
  
  // Draw flower petals
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8
    const petalX = centerX + Math.cos(angle) * 200
    const petalY = centerY + Math.sin(angle) * 200
    
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.ellipse(petalX, petalY, 80, 40, angle, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Center of flower
  ctx.fillStyle = colors.primary
  ctx.beginPath()
  ctx.arc(centerX, centerY, 50, 0, Math.PI * 2)
  ctx.fill()
}

function drawGeometricPatterns(ctx: CanvasRenderingContext2D, colors: any, width: number, height: number) {
  // Draw triangular patterns
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 100 + 50
    
    ctx.fillStyle = i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent
    ctx.beginPath()
    ctx.moveTo(x, y - size / 2)
    ctx.lineTo(x - size / 2, y + size / 2)
    ctx.lineTo(x + size / 2, y + size / 2)
    ctx.closePath()
    ctx.fill()
  }
}

function drawLandscape(ctx: CanvasRenderingContext2D, colors: any, width: number, height: number) {
  // Draw mountains
  ctx.fillStyle = colors.primary
  ctx.beginPath()
  ctx.moveTo(0, height)
  ctx.lineTo(width * 0.2, height * 0.4)
  ctx.lineTo(width * 0.4, height * 0.6)
  ctx.lineTo(width * 0.6, height * 0.3)
  ctx.lineTo(width * 0.8, height * 0.5)
  ctx.lineTo(width, height * 0.4)
  ctx.lineTo(width, height)
  ctx.closePath()
  ctx.fill()
  
  // Draw sun/moon
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(width * 0.8, height * 0.2, 60, 0, Math.PI * 2)
  ctx.fill()
}

function drawFluidShapes(ctx: CanvasRenderingContext2D, colors: any, width: number, height: number) {
  // Draw flowing curves
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = i % 2 === 0 ? colors.primary : colors.secondary
    ctx.lineWidth = 20
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    const startX = Math.random() * width
    const startY = Math.random() * height
    ctx.moveTo(startX, startY)
    
    for (let j = 0; j < 3; j++) {
      const cpX = Math.random() * width
      const cpY = Math.random() * height
      const endX = Math.random() * width
      const endY = Math.random() * height
      ctx.quadraticCurveTo(cpX, cpY, endX, endY)
    }
    
    ctx.stroke()
  }
}

function drawAbstractArt(ctx: CanvasRenderingContext2D, colors: any, width: number, height: number) {
  // Draw abstract shapes
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 150 + 50
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, colors.primary + '80')
    gradient.addColorStop(1, colors.secondary + '20')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawTextElements(
  ctx: CanvasRenderingContext2D,
  prompt: string,
  analysis: any,
  width: number,
  height: number
) {
  const centerX = width / 2
  const centerY = height / 2
  
  // Main title
  ctx.fillStyle = analysis.colors.text
  ctx.font = 'bold 48px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Add text shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  
  ctx.fillText('AI Generated Art', centerX, centerY - 100)
  
  // Reset shadow
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  
  // Prompt words arranged in a circle
  ctx.font = '24px Arial, sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  
  analysis.words.forEach((word: string, index: number) => {
    const angle = (index * Math.PI * 2) / analysis.words.length
    const radius = 250
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle + Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.fillText(word, 0, 0)
    ctx.restore()
  })
  
  // Subtitle
  ctx.font = '18px Arial, sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.textAlign = 'center'
  ctx.fillText('Created with Canvas Text-to-Image Generator', centerX, centerY + 150)
}

function addFinishingTouches(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Add a subtle vignette effect
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Add border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 4
  ctx.strokeRect(10, 10, width - 20, height - 20)
}