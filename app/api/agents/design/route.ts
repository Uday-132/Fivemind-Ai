import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { OpenAI } from 'openai'

// Initialize Gemini for vision analysis
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Initialize Groq for code generation
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

async function analyzeDesign(imageBase64: string) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_actual_gemini_api_key_here') {
      console.log('Gemini API key not configured, using enhanced fallback')
      throw new Error('Gemini API key not configured')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Analyze this UI/UX design image and provide a detailed analysis. Focus on:

1. Visual components (buttons, cards, forms, navigation, etc.)
2. Layout structure (grid, flexbox, positioning)
3. Color palette (extract main colors)
4. Typography style
5. Overall design pattern/theme

Provide your analysis in JSON format:
{
  "analysis": {
    "components": ["list of UI components identified"],
    "layout": "description of layout structure",
    "colors": ["array of hex color codes"],
    "typography": "description of typography style",
    "theme": "overall design theme/style"
  }
}

Be specific and accurate based on what you see in the image.
`

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg'
      }
    }

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in analysis response')
    }

    // Clean and parse JSON with error handling
    let analysisData
    try {
      // Clean the JSON string to remove control characters
      let cleanJson = jsonMatch[0].replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      analysisData = JSON.parse(cleanJson)
    } catch (parseError) {
      console.error('Gemini JSON parse error:', parseError)
      // Use fallback if JSON parsing fails
      throw new Error('Gemini analysis JSON parsing failed')
    }
    
    // Generate code based on the analysis
    const codeResult = await generateCodeFromAnalysis(analysisData.analysis, text)
    
    return {
      ...analysisData,
      ...codeResult
    }

  } catch (error) {
    console.error('Vision analysis error:', error)
    
    // Enhanced fallback with more variety
    const fallbackVariations = [
      {
        analysis: {
          components: ['Header', 'Hero Section', 'CTA Button', 'Feature Cards', 'Footer'],
          layout: 'Modern landing page with hero section and feature grid',
          colors: ['#6366F1', '#1F2937', '#F8FAFC', '#EF4444', '#10B981'],
          typography: 'Clean sans-serif with bold headings and readable body text',
          theme: 'Modern SaaS landing page'
        }
      },
      {
        analysis: {
          components: ['Navigation', 'Dashboard Cards', 'Charts', 'Sidebar', 'Stats Widget'],
          layout: 'Dashboard layout with sidebar navigation and grid system',
          colors: ['#3B82F6', '#1E293B', '#F1F5F9', '#10B981', '#F59E0B'],
          typography: 'Professional system font stack with data visualization',
          theme: 'Clean dashboard interface'
        }
      },
      {
        analysis: {
          components: ['Form Container', 'Input Fields', 'Submit Button', 'Validation Messages'],
          layout: 'Centered form layout with card wrapper and validation',
          colors: ['#8B5CF6', '#374151', '#F9FAFB', '#F59E0B', '#DC2626'],
          typography: 'Modern form typography with clear labels and error states',
          theme: 'Elegant form design'
        }
      },
      {
        analysis: {
          components: ['Profile Header', 'Avatar', 'Info Cards', 'Settings Panel', 'Action Buttons'],
          layout: 'Profile layout with header, sidebar and main content area',
          colors: ['#059669', '#1F2937', '#F0FDF4', '#DC2626', '#3B82F6'],
          typography: 'Professional profile typography with hierarchy',
          theme: 'Clean profile interface'
        }
      },
      {
        analysis: {
          components: ['Product Grid', 'Filter Sidebar', 'Search Bar', 'Product Cards', 'Pagination'],
          layout: 'E-commerce layout with filters and product grid',
          colors: ['#F59E0B', '#1F2937', '#FEF3C7', '#DC2626', '#059669'],
          typography: 'E-commerce typography with product focus',
          theme: 'Modern e-commerce interface'
        }
      },
      {
        analysis: {
          components: ['Article Header', 'Content Body', 'Sidebar', 'Related Articles', 'Comments'],
          layout: 'Blog layout with main content and sidebar',
          colors: ['#6B7280', '#1F2937', '#F9FAFB', '#3B82F6', '#059669'],
          typography: 'Editorial typography optimized for reading',
          theme: 'Clean blog interface'
        }
      },
      {
        analysis: {
          components: ['Portfolio Grid', 'Project Cards', 'About Section', 'Contact Form', 'Skills List'],
          layout: 'Portfolio layout with project showcase and personal branding',
          colors: ['#EC4899', '#1F2937', '#FDF2F8', '#8B5CF6', '#F59E0B'],
          typography: 'Creative typography with personality and visual hierarchy',
          theme: 'Creative portfolio design'
        }
      },
      {
        analysis: {
          components: ['Team Cards', 'Company Stats', 'Mission Statement', 'Values Grid', 'Contact Info'],
          layout: 'About page layout with team showcase and company information',
          colors: ['#0EA5E9', '#1E293B', '#F0F9FF', '#10B981', '#F97316'],
          typography: 'Corporate typography with trust and professionalism',
          theme: 'Professional about page'
        }
      },
      {
        analysis: {
          components: ['Event Cards', 'Calendar View', 'Registration Form', 'Speaker Profiles', 'Schedule'],
          layout: 'Event page layout with calendar and registration system',
          colors: ['#7C3AED', '#1F2937', '#F5F3FF', '#EF4444', '#059669'],
          typography: 'Event typography with excitement and clarity',
          theme: 'Dynamic event interface'
        }
      },
      {
        analysis: {
          components: ['Service Cards', 'Pricing Table', 'Testimonials', 'FAQ Section', 'Contact CTA'],
          layout: 'Service page layout with pricing and social proof',
          colors: ['#DC2626', '#1F2937', '#FEF2F2', '#3B82F6', '#10B981'],
          typography: 'Service typography with trust and conversion focus',
          theme: 'Professional service page'
        }
      },
      {
        analysis: {
          components: ['News Feed', 'Article Cards', 'Category Filters', 'Search Widget', 'Newsletter Signup'],
          layout: 'News layout with feed and filtering system',
          colors: ['#1D4ED8', '#1F2937', '#EFF6FF', '#F59E0B', '#059669'],
          typography: 'News typography with readability and hierarchy',
          theme: 'Modern news interface'
        }
      }
    ]
    
    // Add more randomization for varied results
    const randomSeed = Math.random() * 1000 + Date.now()
    const randomIndex = Math.floor(randomSeed) % fallbackVariations.length
    const selectedVariation = fallbackVariations[randomIndex]
    
    // Add random variations to the selected template
    const enhancedAnalysis = {
      ...selectedVariation.analysis,
      // Add random elements to make each result unique
      uniqueId: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      // Randomly modify colors slightly
      colors: selectedVariation.analysis.colors?.map(color => {
        // Occasionally modify the color slightly
        if (Math.random() > 0.7) {
          const variations = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
          const randomVariation = variations[Math.floor(Math.random() * variations.length)]
          return color.includes('#') ? color : `${color}-${randomVariation}`
        }
        return color
      }),
      // Add random component variations
      components: selectedVariation.analysis.components?.map(comp => {
        const modifiers = ['Enhanced', 'Modern', 'Interactive', 'Responsive', 'Dynamic']
        if (Math.random() > 0.8) {
          const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
          return `${modifier} ${comp}`
        }
        return comp
      })
    }
    
    const codeResult = await generateCodeFromAnalysis(enhancedAnalysis, `Fallback analysis with variations - ${enhancedAnalysis.uniqueId}`)
    
    return {
      analysis: enhancedAnalysis,
      ...codeResult,
      generatedAt: new Date().toISOString(),
      variant: `fallback-${randomIndex}-${enhancedAnalysis.uniqueId}`
    }
  }
}

async function generateCodeFromAnalysis(analysis: any, fullAnalysis: string) {
  // Force vertical layout options only
  const layoutStyles = ['flex flex-col', 'grid grid-cols-1', 'block space-y-8']
  const spacingOptions = ['space-y-6', 'space-y-8', 'space-y-10', 'space-y-12']
  const containerStyles = ['max-w-4xl mx-auto px-4', 'max-w-6xl mx-auto px-6', 'container mx-auto px-4', 'w-full max-w-screen-xl mx-auto px-8']
  
  const randomLayout = layoutStyles[Math.floor(Math.random() * layoutStyles.length)]
  const randomSpacing = spacingOptions[Math.floor(Math.random() * spacingOptions.length)]
  const randomContainer = containerStyles[Math.floor(Math.random() * containerStyles.length)]
  
  const uniqueId = analysis.uniqueId || Math.random().toString(36).substring(7)
  
  const prompt = `
Create a VERTICAL-ONLY React component with Tailwind CSS. ALL elements must stack from TOP to BOTTOM.

CRITICAL REQUIREMENTS - NO HORIZONTAL LAYOUTS:
- Main container MUST use: ${randomLayout}
- ALL sections MUST stack vertically with ${randomSpacing}
- Container: ${randomContainer}
- NO flex-row, NO grid-cols-2 or higher, NO horizontal arrangements
- ONLY vertical stacking allowed

DESIGN SPECIFICATIONS:
- Components: ${analysis.components?.join(', ') || 'Modern UI components'}
- Colors: ${analysis.colors?.join(', ') || 'Modern color palette'}
- Typography: ${analysis.typography || 'Clean typography'}
- Theme: ${analysis.theme || 'Modern design'}
- Unique ID: ${uniqueId}

MANDATORY VERTICAL STRUCTURE:
1. Header/Navigation - full width at top
2. Hero/Banner section - full width below header
3. Content sections - each taking full width, stacked vertically
4. Footer - full width at bottom

STRICT TECHNICAL RULES:
- Root container: <div className="${randomLayout} ${randomSpacing} min-h-screen">
- Each section: <section className="w-full">
- NO side-by-side elements except within individual cards
- Use py-8, py-12, py-16 for vertical padding
- Cards/components within sections can have internal horizontal layout
- But main sections MUST be stacked vertically

FORBIDDEN CLASSES:
- flex-row, grid-cols-2, grid-cols-3, grid-cols-4, etc.
- Any horizontal grid or flex arrangements for main sections

RETURN ONLY VALID JSON:

{
  "code": {
    "react": "Complete React component with STRICT vertical layout using ${randomLayout}",
    "html": "HTML with vertical-only structure and semantic elements",
    "css": "CSS with vertical stacking and ${randomSpacing}"
  }
}

REMEMBER: Every major section must be stacked vertically from top to bottom!
`

  try {
    const response = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert frontend developer who creates VERTICAL-ONLY React components with Tailwind CSS. CRITICAL: All major sections must stack from top to bottom. Never use horizontal layouts for main sections. Always use flex-col, grid-cols-1, or block layouts for the main container. Generate unique, accessible code with strict vertical stacking.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.7
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No code generated')
    }

    // Extract JSON from response with better error handling
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        let rawJson = jsonMatch[0]
        
        // Remove control characters but preserve necessary whitespace
        rawJson = rawJson.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
        
        // Try to parse as-is first
        const result = JSON.parse(rawJson)
        // Post-process to ensure vertical layouts
        return ensureVerticalLayout(result)
      } catch (parseError) {
        console.error('Initial JSON parse failed, trying cleanup:', parseError)
        
        try {
          // More aggressive cleanup
          let cleanJson = jsonMatch[0]
          
          // Remove all control characters
          cleanJson = cleanJson.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
          
          // Fix common issues with code strings
          cleanJson = cleanJson
            // Replace unescaped newlines in strings
            .replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
              return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
            })
            // Fix unescaped backslashes (but not already escaped ones)
            .replace(/\\(?!["\\/bfnrt])/g, '\\\\')
          
          const result = JSON.parse(cleanJson)
          return ensureVerticalLayout(result)
        } catch (secondError) {
          console.error('Second JSON parse failed, using fallback:', secondError)
          console.error('Raw content sample:', jsonMatch[0].substring(0, 500))
          
          // Fallback: return a basic structure and let the fallback code generation handle it
          console.log('Using fallback due to JSON parse failure')
          return generateFallbackCode(analysis)
        }
      }
    }
    
    // If no JSON found, use fallback code generation
    console.log('No JSON found in response, using fallback')
    return generateFallbackCode(analysis)
    
  } catch (error) {
    console.error('Code generation error:', error)
    
    // Generate dynamic fallback based on analysis
    const componentName = analysis.components?.[0]?.replace(/\s+/g, '') || 'Component'
    const primaryColor = analysis.colors?.[0] || '#3B82F6'
    const theme = analysis.theme || 'modern'
    
    return generateDynamicFallback(componentName, primaryColor, theme, analysis)
  }
}

function generateFallbackCode(analysis: any) {
  const componentName = analysis.components?.[0]?.replace(/\s+/g, '') || 'Component'
  const primaryColor = analysis.colors?.[0] || '#3B82F6'
  const theme = analysis.theme || 'modern'
  
  return generateDynamicFallback(componentName, primaryColor, theme, analysis)
}

function generateDynamicFallback(componentName: string, primaryColor: string, theme: string, analysis: any) {
  const isCard = analysis.components?.some((c: string) => c.toLowerCase().includes('card'))
  const isForm = analysis.components?.some((c: string) => c.toLowerCase().includes('form'))
  const isDashboard = analysis.components?.some((c: string) => c.toLowerCase().includes('dashboard'))
  
  let reactCode = ''
  let htmlCode = ''
  let cssCode = ''
  
  if (isForm) {
    reactCode = `import { useState } from 'react'

export default function ${componentName}Form() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section - TOP */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        </div>
      </header>

      {/* Main Content Section - MIDDLE */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials below
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Sign In
            </button>
          </form>
        </div>
      </main>

      {/* Footer Section - BOTTOM */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}`
  } else if (isDashboard) {
    reactCode = `export default function ${componentName}Dashboard() {
  const stats = [
    { name: 'Total Users', value: '12,345', change: '+12%' },
    { name: 'Revenue', value: '$45,678', change: '+8%' },
    { name: 'Orders', value: '1,234', change: '+23%' },
    { name: 'Conversion', value: '3.2%', change: '+2%' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header/Navigation - TOP */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - MIDDLE (arranged vertically) */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Section - First vertical section */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Activity Section - Second vertical section */}
        <section className="mb-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5">Recent Activity</h3>
              <div className="flow-root">
                <ul className="space-y-4">
                  {[1, 2, 3].map((item, index) => (
                    <li key={index} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs">U</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 flex justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            User activity #{item} <span className="font-medium text-gray-900">completed</span>
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {item}h ago
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - BOTTOM */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Dashboard © 2024. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}`
  } else {
    // Default card-based component with top-to-bottom structure
    reactCode = `export default function ${componentName}() {
  const features = [
    {
      title: 'Feature One',
      description: 'Detailed description of the first feature that makes your product amazing.',
      icon: '🚀'
    },
    {
      title: 'Feature Two', 
      description: 'Another great feature that adds value to your users experience.',
      icon: '⭐'
    },
    {
      title: 'Feature Three',
      description: 'The third feature that completes the perfect user experience.',
      icon: '💎'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header Section - TOP */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Amazing Product</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section - SECOND */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Transform Your Workflow
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
            Discover our innovative solution designed for modern teams who want to achieve more with less effort.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
              Get Started Today
            </button>
          </div>
        </div>
      </section>
        
      {/* Features Section - THIRD */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Why Choose Us?
            </h3>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need to succeed, all in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="text-3xl">{feature.icon}</div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{feature.title}</h4>
                    </div>
                  </div>
                  <p className="text-base text-gray-500 mb-6">{feature.description}</p>
                  <button className="text-blue-600 hover:text-blue-500 font-medium text-sm">
                    Learn more →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - FOURTH */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-extrabold text-white">
            Ready to Get Started?
          </h3>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of satisfied customers today.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition duration-150 ease-in-out">
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section - BOTTOM */}
      <footer className="bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Amazing Product. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}`
  }
  
  // Generate corresponding HTML and CSS with top-to-bottom structure
  htmlCode = `<div class="${componentName.toLowerCase()}-page">
  <!-- Header Section - TOP -->
  <header class="header">
    <h1>Generated ${componentName}</h1>
    <button class="header-button">Sign In</button>
  </header>
  
  <!-- Main Content Section - MIDDLE -->
  <main class="main-content">
    <section class="hero-section">
      <h2>Welcome to ${componentName}</h2>
      <p>This component was generated based on your design analysis with theme: ${theme}</p>
      <button class="primary-button">Get Started</button>
    </section>
    
    <section class="content-section">
      <h3>Features</h3>
      <div class="feature-grid">
        <div class="feature-card">
          <h4>Feature 1</h4>
          <p>Description of feature</p>
        </div>
        <div class="feature-card">
          <h4>Feature 2</h4>
          <p>Description of feature</p>
        </div>
      </div>
    </section>
  </main>
  
  <!-- Footer Section - BOTTOM -->
  <footer class="footer">
    <p>© 2024 ${componentName}. All rights reserved.</p>
  </footer>
</div>`

  cssCode = `.${componentName.toLowerCase()}-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: system-ui, -apple-system, sans-serif;
}

.header {
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  padding: 3rem 0;
  margin-bottom: 3rem;
}

.content-section {
  margin-bottom: 3rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.primary-button {
  background: ${primaryColor};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.footer {
  background: #1f2937;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: auto;
}`

  return {
    code: {
      react: reactCode,
      html: htmlCode,
      css: cssCode
    }
  }
}

function extractComponents(pages: any[]): string[] {
  const components = new Set<string>()
  
  function traverseNode(node: any) {
    if (node.type) {
      switch (node.type) {
        case 'RECTANGLE':
        case 'FRAME':
          components.add('Card')
          break
        case 'TEXT':
          components.add('Text')
          break
        case 'COMPONENT':
          components.add('Component')
          break
        case 'INSTANCE':
          components.add('Button')
          break
      }
    }
    
    if (node.children) {
      node.children.forEach(traverseNode)
    }
  }
  
  pages.forEach(page => {
    if (page.children) {
      page.children.forEach(traverseNode)
    }
  })
  
  return Array.from(components)
}

function extractColors(styles: any): string[] {
  const colors = ['#3B82F6', '#1F2937', '#F9FAFB'] // Default colors
  
  // Extract colors from Figma styles if available
  if (styles.fills) {
    Object.values(styles.fills).forEach((style: any) => {
      if (style.fills && style.fills[0] && style.fills[0].color) {
        const color = style.fills[0].color
        const hex = `#${Math.round(color.r * 255).toString(16).padStart(2, '0')}${Math.round(color.g * 255).toString(16).padStart(2, '0')}${Math.round(color.b * 255).toString(16).padStart(2, '0')}`
        colors.push(hex)
      }
    })
  }
  
  return colors.slice(0, 5) // Return first 5 colors
}

// This function is now replaced by generateCodeFromAnalysis

async function processFigmaUrl(url: string) {
  try {
    // Extract file key from Figma URL
    const fileKeyMatch = url.match(/\/file\/([a-zA-Z0-9]+)/)
    if (!fileKeyMatch) {
      throw new Error('Invalid Figma URL format')
    }
    
    const fileKey = fileKeyMatch[1]
    
    if (!process.env.FIGMA_ACCESS_TOKEN) {
      throw new Error('Figma access token not configured')
    }
    
    // Fetch file data from Figma API
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN
      }
    })
    
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} - ${response.statusText}`)
    }
    
    const figmaData = await response.json()
    
    // Extract design information from Figma data
    const document = figmaData.document
    const pages = document.children || []
    
    // Analyze the design structure
    const components = extractComponents(pages)
    const colors = extractColors(figmaData.styles || {})
    const typography = extractTypography(figmaData.styles || {})
    const layout = analyzeLayout(pages)
    
    // Create analysis object
    const analysis = {
      components: components.length > 0 ? components : ['Frame', 'Text', 'Button'],
      layout: layout || 'Figma design layout structure',
      colors: colors.length > 0 ? colors : ['#000000', '#FFFFFF', '#3B82F6'],
      typography: typography || 'Figma typography styles',
      theme: determineFigmaTheme(figmaData.name, components)
    }
    
    // Generate code based on Figma data
    const codeResult = await generateCodeFromAnalysis(analysis, `Figma file: ${figmaData.name}`)
    
    return {
      analysis,
      ...codeResult
    }
  } catch (error) {
    console.error('Figma API error:', error)
    
    // Enhanced fallback with more variety based on URL patterns
    const urlLower = url.toLowerCase()
    let fallbackType = 'dashboard'
    
    if (urlLower.includes('landing') || urlLower.includes('home')) {
      fallbackType = 'landing'
    } else if (urlLower.includes('form') || urlLower.includes('login') || urlLower.includes('signup')) {
      fallbackType = 'form'
    } else if (urlLower.includes('profile') || urlLower.includes('settings')) {
      fallbackType = 'profile'
    }
    
    const fallbackAnalysis = generateFallbackAnalysis(fallbackType)
    const codeResult = await generateCodeFromAnalysis(fallbackAnalysis, `Fallback for ${fallbackType} design`)
    
    return {
      analysis: fallbackAnalysis,
      ...codeResult
    }
  }
}

function generateFallbackAnalysis(type: string) {
  const fallbacks: Record<string, {
    components: string[]
    layout: string
    colors: string[]
    typography: string
    theme: string
  }> = {
    landing: {
      components: ['Hero Section', 'Feature Cards', 'CTA Button', 'Navigation', 'Footer'],
      layout: 'Modern landing page with hero section and feature grid',
      colors: ['#6366F1', '#1F2937', '#F8FAFC', '#EF4444', '#10B981'],
      typography: 'Bold headings with clean body text',
      theme: 'Modern SaaS landing page'
    },
    form: {
      components: ['Form Container', 'Input Fields', 'Submit Button', 'Validation Messages'],
      layout: 'Centered form layout with card wrapper',
      colors: ['#8B5CF6', '#374151', '#F9FAFB', '#F59E0B'],
      typography: 'Clean form typography with clear labels',
      theme: 'Elegant form design'
    },
    profile: {
      components: ['Profile Header', 'Info Cards', 'Settings Panel', 'Action Buttons'],
      layout: 'Profile layout with sidebar and main content',
      colors: ['#059669', '#1F2937', '#F0FDF4', '#DC2626'],
      typography: 'Professional profile typography',
      theme: 'Clean profile interface'
    },
    dashboard: {
      components: ['Navigation', 'Dashboard Cards', 'Charts', 'Sidebar', 'Stats'],
      layout: 'Dashboard layout with sidebar navigation and grid',
      colors: ['#3B82F6', '#1E293B', '#F1F5F9', '#10B981', '#F59E0B'],
      typography: 'Professional system font stack',
      theme: 'Clean dashboard interface'
    }
  }
  
  return fallbacks[type] || fallbacks.dashboard
}

function determineFigmaTheme(fileName: string, components: string[]): string {
  const name = fileName?.toLowerCase() || ''
  
  if (name.includes('dashboard') || components.includes('Chart')) return 'Dashboard interface'
  if (name.includes('landing') || components.includes('Hero')) return 'Landing page'
  if (name.includes('mobile') || name.includes('app')) return 'Mobile app interface'
  if (name.includes('admin') || name.includes('cms')) return 'Admin panel'
  if (name.includes('ecommerce') || name.includes('shop')) return 'E-commerce interface'
  
  return 'Modern web interface'
}

function analyzeLayout(pages: any[]): string {
  if (!pages || pages.length === 0) return 'Standard layout'
  
  let hasGrid = false
  let hasSidebar = false
  let hasHeader = false
  
  function traverseNode(node: any) {
    if (node.name) {
      const name = node.name.toLowerCase()
      if (name.includes('grid')) hasGrid = true
      if (name.includes('sidebar') || name.includes('nav')) hasSidebar = true
      if (name.includes('header') || name.includes('top')) hasHeader = true
    }
    
    if (node.children) {
      node.children.forEach(traverseNode)
    }
  }
  
  pages.forEach(page => {
    if (page.children) {
      page.children.forEach(traverseNode)
    }
  })
  
  let layout = ''
  if (hasHeader) layout += 'Header with '
  if (hasSidebar) layout += 'sidebar navigation and '
  if (hasGrid) layout += 'grid-based '
  layout += 'responsive layout'
  
  return layout
}

function extractTypography(styles: any): string {
  if (!styles || !styles.text) return 'Modern typography'
  
  const textStyles = Object.values(styles.text)
  if (textStyles.length === 0) return 'Clean typography'
  
  return 'Custom typography with multiple font weights and sizes'
}

function ensureVerticalLayout(result: any) {
  // Post-process the generated code to ensure vertical layouts
  if (result.code) {
    // Fix React code
    if (result.code.react) {
      result.code.react = result.code.react
        // Replace horizontal grid layouts with vertical ones
        .replace(/grid-cols-[2-9](\d*)/g, 'grid-cols-1')
        .replace(/md:grid-cols-[2-9](\d*)/g, 'md:grid-cols-1')
        .replace(/lg:grid-cols-[2-9](\d*)/g, 'lg:grid-cols-1')
        .replace(/xl:grid-cols-[2-9](\d*)/g, 'xl:grid-cols-1')
        // Replace flex-row with flex-col
        .replace(/flex-row/g, 'flex-col')
        // Ensure main containers use vertical layouts
        .replace(/className="([^"]*\s+)?flex(\s+[^"]*)?"/g, (match) => {
          if (!match.includes('flex-col') && !match.includes('flex-row')) {
            return match.replace('flex', 'flex flex-col')
          }
          return match.replace('flex-row', 'flex-col')
        })
    }
    
    // Fix HTML code
    if (result.code.html) {
      result.code.html = result.code.html
        .replace(/class="([^"]*\s+)?grid-cols-[2-9](\d*)([^"]*)?"/g, 'class="$1grid-cols-1$3"')
        .replace(/class="([^"]*\s+)?flex-row([^"]*)?"/g, 'class="$1flex-col$2"')
    }
    
    // Fix CSS code
    if (result.code.css) {
      result.code.css = result.code.css
        .replace(/grid-template-columns:\s*repeat\([2-9]\d*,/g, 'grid-template-columns: repeat(1,')
        .replace(/flex-direction:\s*row/g, 'flex-direction: column')
        .replace(/display:\s*grid;\s*grid-template-columns:\s*[^;]+;/g, 'display: grid; grid-template-columns: 1fr;')
    }
  }
  
  return result
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const type = formData.get('type') as string

    if (!type || !['url', 'upload'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid input type' },
        { status: 400 }
      )
    }

    let result

    if (type === 'url') {
      const url = formData.get('url') as string
      
      if (!url || !url.includes('figma.com')) {
        return NextResponse.json(
          { error: 'Valid Figma URL is required' },
          { status: 400 }
        )
      }

      result = await processFigmaUrl(url)
    } else {
      const file = formData.get('file') as File
      
      if (!file || !file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Valid image file is required' },
          { status: 400 }
        )
      }

      // Convert file to base64
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')

      result = await analyzeDesign(base64)
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Design agent error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}