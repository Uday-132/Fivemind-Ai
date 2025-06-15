'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Image, Palette, Download, Sparkles, Copy, RefreshCw, ArrowRight } from 'lucide-react'


interface ImageResult {
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

const STYLE_OPTIONS = [
  { value: 'realistic', label: 'Realistic', description: 'Photorealistic images' },
  { value: 'artistic', label: 'Artistic', description: 'Painterly and creative' },
  { value: 'anime', label: 'Anime', description: 'Japanese animation style' },
  { value: 'digital-art', label: 'Digital Art', description: 'Modern digital artwork' },
  { value: 'vintage', label: 'Vintage', description: 'Retro and classic style' },
  { value: 'minimalist', label: 'Minimalist', description: 'Clean and simple' }
]

export default function ImageAgentPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [result, setResult] = useState<ImageResult | null>(null)
  const [imageHistory, setImageHistory] = useState<ImageResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      await generateImage()
    }
  }

  const generateImage = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/agents/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newResult: ImageResult = await response.json()
      console.log('Generated image result:', newResult)
      setResult(newResult)
      setImageHistory(prev => [newResult, ...prev.slice(0, 4)])
    } catch (error) {
      console.error('Image generation failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      if (imageUrl.startsWith('data:')) {
        // Base64 image
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = filename
        link.click()
      } else {
        // URL image
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const regenerateImage = async () => {
    if (result) {
      setPrompt(result.prompt)
      await generateImage()
    }
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center mx-auto">
          <Image className="h-8 w-8 text-purple-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          AI Image Generator 
          <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            100% FREE
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your ideas into stunning images using FREE AI - powered by Pollinations.AI & FLUX
        </p>
      </div>

      {/* Input Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generate AI Image</CardTitle>
          <CardDescription>
            Describe what you want to see and our AI will generate a high-quality image using FREE AI services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Prompt</label>
              <Textarea
                placeholder="A serene mountain landscape at sunset with a crystal clear lake reflecting the golden sky..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Style</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {STYLE_OPTIONS.map((style) => (
                  <Button
                    key={style.value}
                    type="button"
                    variant={selectedStyle === style.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStyle(style.value)}
                    disabled={isGenerating}
                    className="h-auto p-3 flex flex-col items-start"
                  >
                    <span className="font-medium">{style.label}</span>
                    <span className="text-xs opacity-70">{style.description}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center" 
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Image
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Image */}
      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Image</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={regenerateImage}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadImage(
                      result.imageUrl, 
                      `generated-image-${Date.now()}.png`
                    )}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={result.imageUrl}
                    alt={result.prompt}
                    className="w-full rounded-lg shadow-lg"
                    style={{ maxHeight: '512px', objectFit: 'contain' }}
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={(e) => {
                      console.error('Image failed to load:', e)
                      console.error('Image URL:', result.imageUrl)
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Original Prompt</h4>
                    <div className="flex items-start gap-2">
                      <p className="text-muted-foreground bg-muted p-2 rounded flex-1">
                        {result.prompt}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPrompt(result.prompt)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Enhanced Prompt</h4>
                    <div className="flex items-start gap-2">
                      <p className="text-muted-foreground bg-muted p-2 rounded flex-1">
                        {result.enhancedPrompt}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPrompt(result.enhancedPrompt)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Model: {result.metadata.model}</span>
                  <span>Style: {result.style}</span>
                  <span>Size: {result.dimensions}</span>
                  <span>Generated: {new Date(result.generatedAt).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Image History */}
      {imageHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Generations</CardTitle>
            <CardDescription>Your last few generated images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageHistory.map((image, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => setResult(image)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full aspect-square object-cover rounded-lg transition-opacity group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm text-center p-2">
                      {image.prompt.substring(0, 50)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">Powered by FREE AI services - no API keys required!</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Palette className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Multiple Styles</h3>
            <p className="text-sm text-muted-foreground">Choose from realistic, artistic, anime, and more</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Download className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Instant Download</h3>
            <p className="text-sm text-muted-foreground">Download your generated images immediately</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}