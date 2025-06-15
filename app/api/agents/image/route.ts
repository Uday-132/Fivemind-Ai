import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

interface ImageGenerationResult {
  prompt: string
  enhancedPrompt: string
  imageUrl: string
  style: string
  dimensions: string
  generatedAt: string
  metadata: {
    model: string
    steps: number
    guidance: number
  }
}

async function enhancePrompt(originalPrompt: string): Promise<string> {
  console.log(`Enhancing prompt: ${originalPrompt}`)
  
  const enhancementPrompt = `
You are an expert prompt engineer for AI image generation. Take the user's basic prompt and enhance it to create a detailed, vivid description that will produce a high-quality image.

Guidelines:
- Add artistic style details (lighting, composition, color palette)
- Include quality modifiers (high resolution, detailed, professional)
- Specify camera/artistic techniques if relevant
- Keep the core concept intact
- Make it concise but descriptive
- Avoid NSFW content

Original prompt: "${originalPrompt}"

Return only the enhanced prompt, nothing else.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert prompt engineer who creates detailed, artistic prompts for AI image generation.'
        },
        {
          role: 'user',
          content: enhancementPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    })

    const enhancedPrompt = response.choices[0]?.message?.content?.trim()
    if (!enhancedPrompt) {
      console.log('Failed to enhance prompt, using original')
      return originalPrompt
    }

    console.log(`Enhanced prompt: ${enhancedPrompt}`)
    return enhancedPrompt

  } catch (error) {
    console.error('Prompt enhancement failed:', error)
    return originalPrompt
  }
}

async function generateImageWithPollinations(prompt: string): Promise<string> {
  console.log('Making request to Pollinations.AI (FREE)...')
  console.log('Model: FLUX (via Pollinations)')
  console.log('Prompt:', prompt)

  // Pollinations.AI - completely free, no API key required
  // It generates images on-demand when the URL is accessed
  const encodedPrompt = encodeURIComponent(prompt)
  const seed = Math.floor(Math.random() * 1000000) // Random seed for variety
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true&enhance=true&seed=${seed}`
  
  console.log('Generated image URL:', imageUrl)
  
  // Pollinations generates images on-demand, so we just return the URL
  return imageUrl
}

async function generateImageWithImgGenAI(prompt: string): Promise<string> {
  console.log('Making request to ImgGen.AI (FREE)...')
  console.log('Prompt:', prompt)

  // ImgGen.AI - free alternative
  const response = await fetch('https://api.imggen.ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      width: 1024,
      height: 1024,
      steps: 20,
      guidance_scale: 7.5
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.log('ImgGen.AI API error:', errorText)
    throw new Error(`ImgGen.AI API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  
  if (result.image_url) {
    return result.image_url
  }

  throw new Error('No image URL returned from ImgGen.AI')
}

// Keep the HuggingFace function as fallback but use a working model
async function generateImageWithHuggingFace(prompt: string): Promise<string> {
  const HF_API_KEY = process.env.HUGGING_FACE_API_KEY
  if (!HF_API_KEY) {
    throw new Error('Hugging Face API key not configured')
  }

  console.log('Making request to Hugging Face API (fallback)...')
  console.log('Model: stabilityai/stable-diffusion-xl-base-1.0')
  console.log('Prompt:', prompt)

  const response = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    {
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5
        }
      }),
    }
  )

  console.log('Response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.log('Error response body:', errorText)
    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
  }

  const imageBlob = await response.blob()
  const imageBuffer = await imageBlob.arrayBuffer()
  const base64Image = Buffer.from(imageBuffer).toString('base64')
  
  return `data:image/png;base64,${base64Image}`
}

async function generateImageWithDALLE(prompt: string): Promise<string> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here' || OPENAI_API_KEY.includes('your_ope')) {
    throw new Error('Valid OpenAI API key not configured')
  }

  const dalleClient = new OpenAI({
    apiKey: OPENAI_API_KEY,
  })

  const response = await dalleClient.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: "vivid"
  })

  const imageUrl = response.data?.[0]?.url
  if (!imageUrl) {
    throw new Error('No image URL returned from DALL-E')
  }

  return imageUrl
}

async function generatePlaceholderImage(prompt: string): Promise<string> {
  // Generate a more sophisticated artistic image based on the prompt
  return generateArtisticImage(prompt)
}

function generateArtisticImage(prompt: string): string {
  // Analyze prompt for colors, themes, and elements
  const analysis = analyzePrompt(prompt)
  
  // Create an artistic SVG based on the prompt analysis
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${generateGradients(analysis)}
        ${generatePatterns(analysis)}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#mainGradient)"/>
      
      <!-- Artistic elements based on prompt -->
      ${generateArtisticElements(analysis)}
      
      <!-- Text overlay -->
      <g transform="translate(512, 512)">
        ${generateTextArt(prompt, analysis)}
      </g>
      
      <!-- Decorative border -->
      <rect x="20" y="20" width="984" height="984" 
            fill="none" stroke="rgba(255,255,255,0.3)" 
            stroke-width="2" rx="20"/>
    </svg>
  `
  
  // Convert SVG to base64 data URL
  const base64Svg = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64Svg}`
}

function analyzePrompt(prompt: string) {
  const lowerPrompt = prompt.toLowerCase()
  
  // Color analysis
  const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb'
  }
  
  if (lowerPrompt.includes('sunset') || lowerPrompt.includes('orange') || lowerPrompt.includes('warm')) {
    colors.primary = '#ff7e5f'
    colors.secondary = '#feb47b'
    colors.accent = '#ff6b6b'
  } else if (lowerPrompt.includes('ocean') || lowerPrompt.includes('blue') || lowerPrompt.includes('water')) {
    colors.primary = '#667eea'
    colors.secondary = '#764ba2'
    colors.accent = '#4facfe'
  } else if (lowerPrompt.includes('forest') || lowerPrompt.includes('green') || lowerPrompt.includes('nature')) {
    colors.primary = '#11998e'
    colors.secondary = '#38ef7d'
    colors.accent = '#7ed321'
  } else if (lowerPrompt.includes('fire') || lowerPrompt.includes('red') || lowerPrompt.includes('passion')) {
    colors.primary = '#ff416c'
    colors.secondary = '#ff4b2b'
    colors.accent = '#ff6b6b'
  } else if (lowerPrompt.includes('purple') || lowerPrompt.includes('magic') || lowerPrompt.includes('mystical')) {
    colors.primary = '#667eea'
    colors.secondary = '#764ba2'
    colors.accent = '#a8edea'
  }
  
  // Theme analysis
  const themes = []
  if (lowerPrompt.includes('space') || lowerPrompt.includes('star') || lowerPrompt.includes('galaxy')) themes.push('space')
  if (lowerPrompt.includes('flower') || lowerPrompt.includes('garden') || lowerPrompt.includes('botanical')) themes.push('floral')
  if (lowerPrompt.includes('geometric') || lowerPrompt.includes('pattern') || lowerPrompt.includes('abstract')) themes.push('geometric')
  if (lowerPrompt.includes('mountain') || lowerPrompt.includes('landscape') || lowerPrompt.includes('scenery')) themes.push('landscape')
  if (lowerPrompt.includes('city') || lowerPrompt.includes('urban') || lowerPrompt.includes('building')) themes.push('urban')
  
  return {
    colors,
    themes,
    prompt: prompt.substring(0, 50),
    mood: lowerPrompt.includes('calm') || lowerPrompt.includes('peaceful') ? 'calm' : 
          lowerPrompt.includes('energetic') || lowerPrompt.includes('vibrant') ? 'energetic' : 'balanced'
  }
}

function generateGradients(analysis: any): string {
  return `
    <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${analysis.colors.primary};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${analysis.colors.secondary};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${analysis.colors.accent};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.3);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:0" />
    </radialGradient>
  `
}

function generatePatterns(analysis: any): string {
  if (analysis.themes.includes('geometric')) {
    return `
      <pattern id="geometricPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <polygon points="50,10 90,90 10,90" fill="rgba(255,255,255,0.1)"/>
        <circle cx="25" cy="25" r="15" fill="rgba(255,255,255,0.05)"/>
      </pattern>
    `
  }
  return ''
}

function generateArtisticElements(analysis: any): string {
  let elements = ''
  
  // Add theme-specific elements
  if (analysis.themes.includes('space')) {
    elements += generateStars()
  } else if (analysis.themes.includes('floral')) {
    elements += generateFloralElements(analysis.colors)
  } else if (analysis.themes.includes('geometric')) {
    elements += generateGeometricShapes(analysis.colors)
  } else if (analysis.themes.includes('landscape')) {
    elements += generateLandscapeElements(analysis.colors)
  } else {
    elements += generateAbstractShapes(analysis.colors)
  }
  
  // Add center glow
  elements += '<circle cx="512" cy="512" r="400" fill="url(#centerGlow)"/>'
  
  return elements
}

function generateStars(): string {
  let stars = ''
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 1024
    const y = Math.random() * 1024
    const size = Math.random() * 3 + 1
    const opacity = Math.random() * 0.8 + 0.2
    stars += `<circle cx="${x}" cy="${y}" r="${size}" fill="rgba(255,255,255,${opacity})"/>`
  }
  return stars
}

function generateFloralElements(colors: any): string {
  return `
    <g opacity="0.3">
      <path d="M200,200 Q250,150 300,200 Q250,250 200,200" fill="${colors.accent}"/>
      <path d="M700,300 Q750,250 800,300 Q750,350 700,300" fill="${colors.primary}"/>
      <path d="M150,700 Q200,650 250,700 Q200,750 150,700" fill="${colors.secondary}"/>
      <path d="M800,800 Q850,750 900,800 Q850,850 800,800" fill="${colors.accent}"/>
    </g>
  `
}

function generateGeometricShapes(colors: any): string {
  return `
    <g opacity="0.2">
      <polygon points="200,100 300,100 250,200" fill="${colors.primary}"/>
      <rect x="600" y="200" width="100" height="100" fill="${colors.secondary}" transform="rotate(45 650 250)"/>
      <circle cx="200" cy="600" r="50" fill="${colors.accent}"/>
      <polygon points="700,700 800,700 750,800" fill="${colors.primary}"/>
    </g>
  `
}

function generateLandscapeElements(colors: any): string {
  return `
    <g opacity="0.4">
      <path d="M0,800 Q200,700 400,750 Q600,800 800,720 Q900,700 1024,750 L1024,1024 L0,1024 Z" fill="rgba(0,0,0,0.2)"/>
      <circle cx="150" cy="150" r="80" fill="rgba(255,255,255,0.3)"/>
    </g>
  `
}

function generateAbstractShapes(colors: any): string {
  return `
    <g opacity="0.3">
      <path d="M100,300 Q300,100 500,300 Q300,500 100,300" fill="${colors.primary}"/>
      <path d="M600,200 Q800,400 600,600 Q400,400 600,200" fill="${colors.secondary}"/>
      <circle cx="800" cy="200" r="100" fill="${colors.accent}"/>
      <ellipse cx="200" cy="800" rx="150" ry="80" fill="${colors.primary}"/>
    </g>
  `
}

function generateTextArt(prompt: string, analysis: any): string {
  const words = prompt.split(' ').slice(0, 6) // Take first 6 words
  let textElements = ''
  
  // Main title
  textElements += `
    <text y="-50" text-anchor="middle" fill="white" font-family="Arial, sans-serif" 
          font-size="36" font-weight="bold" filter="url(#glow)">
      AI Generated Art
    </text>
  `
  
  // Prompt words arranged artistically
  words.forEach((word, index) => {
    const angle = (index * 60) - 150 // Spread words in a semi-circle
    const radius = 200
    const x = Math.cos(angle * Math.PI / 180) * radius
    const y = Math.sin(angle * Math.PI / 180) * radius + 50
    
    textElements += `
      <text x="${x}" y="${y}" text-anchor="middle" fill="rgba(255,255,255,0.9)" 
            font-family="Arial, sans-serif" font-size="24" font-weight="300">
        ${word}
      </text>
    `
  })
  
  // Subtitle
  textElements += `
    <text y="150" text-anchor="middle" fill="rgba(255,255,255,0.7)" 
          font-family="Arial, sans-serif" font-size="16">
      Created with AI Text-to-Image Generator
    </text>
  `
  
  return textElements
}

async function generateImage(prompt: string, style: string = 'realistic'): Promise<ImageGenerationResult> {
  console.log(`Generating image for prompt: ${prompt}`)
  
  // Enhance the prompt
  const enhancedPrompt = await enhancePrompt(prompt)
  
  let imageUrl: string
  let model: string = ''
  
  try {
    // Try free services first (no API keys required!)
    console.log('Using FREE Pollinations.AI for image generation')
    imageUrl = await generateImageWithPollinations(enhancedPrompt)
    model = 'FLUX (Pollinations.AI - FREE)'
  } catch (error) {
    console.error('Primary image generation failed:', error)
    
    // Fallback to other free services
    try {
      console.log('Pollinations failed, trying ImgGen.AI (also FREE)')
      imageUrl = await generateImageWithImgGenAI(enhancedPrompt)
      model = 'ImgGen.AI (FREE)'
    } catch (fallbackError) {
      console.error('All free services failed:', fallbackError)
      
      // Check for paid API keys as final fallback
      const hasValidOpenAI = process.env.OPENAI_API_KEY && 
                            process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' && 
                            !process.env.OPENAI_API_KEY.includes('your_ope')
      
      if (hasValidOpenAI) {
        console.log('Falling back to DALL-E 3 (paid service)')
        imageUrl = await generateImageWithDALLE(enhancedPrompt)
        model = 'DALL-E 3'
      } else {
        console.log('All services failed, using placeholder image')
        imageUrl = await generatePlaceholderImage(enhancedPrompt)
        model = 'Placeholder Generator'
      }
    }
  }

  return {
    prompt: prompt,
    enhancedPrompt: enhancedPrompt,
    imageUrl: imageUrl,
    style: style,
    dimensions: '1024x1024',
    generatedAt: new Date().toISOString(),
    metadata: {
      model: model,
      steps: 30,
      guidance: 7.5
    }
  }

  return {
    prompt: prompt,
    enhancedPrompt: enhancedPrompt,
    imageUrl: imageUrl,
    style: style,
    dimensions: '1024x1024',
    generatedAt: new Date().toISOString(),
    metadata: {
      model: model,
      steps: 30,
      guidance: 7.5
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Text-to-Image agent request received')
    
    const { prompt, style = 'realistic' } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      console.log('Invalid request: missing prompt')
      return NextResponse.json(
        { error: 'Text prompt is required' },
        { status: 400 }
      )
    }

    if (prompt.trim().length < 3) {
      console.log('Invalid request: prompt too short')
      return NextResponse.json(
        { error: 'Prompt must be at least 3 characters long' },
        { status: 400 }
      )
    }

    console.log(`Generating image for prompt: "${prompt}" with style: ${style}`)

    // We're using free services, so no API key check needed
    console.log('Using free image generation services - no API keys required')

    // Generate image
    console.log('Starting image generation...')
    const result = await generateImage(prompt, style)

    console.log('Image generation completed successfully')
    console.log('Result:', JSON.stringify(result, null, 2))
    return NextResponse.json(result)

  } catch (error) {
    console.error('Text-to-Image agent error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error'
    let statusCode = 500
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Categorize errors for better user experience
      if (error.message.includes('API key')) {
        statusCode = 500 // Server configuration error
      } else if (error.message.includes('timeout')) {
        statusCode = 408 // Request Timeout
      } else if (error.message.includes('rate limit')) {
        statusCode = 429 // Too Many Requests
      } else if (error.message.includes('content policy')) {
        statusCode = 400 // Bad Request - inappropriate content
        errorMessage = 'Content violates policy. Please try a different prompt.'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}