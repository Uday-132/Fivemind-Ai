'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Palette, Upload, Code, AlertCircle, ArrowRight } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

interface DesignResult {
  analysis: {
    components: string[]
    layout: string
    colors: string[]
    typography: string
  }
  code: {
    html: string
    css: string
    react: string
  }
}

export default function DesignAgentPage() {
  const [inputType, setInputType] = useState<'url' | 'upload'>('url')
  const [figmaUrl, setFigmaUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [result, setResult] = useState<DesignResult | null>(null)
  const [activeTab, setActiveTab] = useState<'react' | 'html'>('react')

  const convertDesign = useMutation({
    mutationFn: async (data: { type: 'url' | 'upload', url?: string, file?: File }) => {
      const formData = new FormData()
      formData.append('type', data.type)
      
      if (data.type === 'url' && data.url) {
        formData.append('url', data.url)
      } else if (data.type === 'upload' && data.file) {
        formData.append('file', data.file)
      }

      const response = await fetch('/api/agents/design', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to convert design')
      }
      
      return response.json()
    },
    onSuccess: (data) => {
      setResult(data)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (inputType === 'url' && figmaUrl.trim()) {
      convertDesign.mutate({ type: 'url', url: figmaUrl.trim() })
    } else if (inputType === 'upload' && imageFile) {
      convertDesign.mutate({ type: 'upload', file: imageFile })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-8 px-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center mx-auto">
          <Palette className="h-8 w-8 text-purple-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Design-to-Code Agent</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Convert Figma designs or images into clean, responsive Tailwind CSS + React code
        </p>
        
        {/* AI Disclaimer */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>The AI can make mistakes. Please verify and test the generated code before using in production.</span>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Convert Design to Code</CardTitle>
          <CardDescription>
            Upload an image or provide a Figma design URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Type Selector */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={inputType === 'url' ? 'default' : 'outline'}
              onClick={() => setInputType('url')}
              className="flex-1"
            >
              Figma URL
            </Button>
            <Button
              type="button"
              variant={inputType === 'upload' ? 'default' : 'outline'}
              onClick={() => setInputType('upload')}
              className="flex-1"
            >
              Upload Image
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {inputType === 'url' ? (
              <Input
                placeholder="https://www.figma.com/file/..."
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                disabled={convertDesign.isPending}
              />
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Drop your image here or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={convertDesign.isPending}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={convertDesign.isPending}
                  >
                    Choose File
                  </Button>
                  {imageFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full flex items-center justify-center" 
              disabled={
                convertDesign.isPending || 
                (inputType === 'url' && !figmaUrl.trim()) ||
                (inputType === 'upload' && !imageFile)
              }
            >
              {convertDesign.isPending ? (
                <>
                  <div className="spinner mr-2" />
                  Converting Design...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-4 w-4" />
                  Convert to Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {convertDesign.error && (
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {convertDesign.error.message}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-8 w-full">
          {/* Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Design Analysis</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Components Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.components.map((component, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded text-sm">
                      {component}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Layout</h4>
                <p className="text-muted-foreground text-sm">{result.analysis.layout}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Color Palette</h4>
                <div className="flex space-x-2">
                  {result.analysis.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Typography</h4>
                <p className="text-muted-foreground text-sm">{result.analysis.typography}</p>
              </div>
            </CardContent>
          </Card>

          {/* Code Output */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>
                Choose your preferred format below
              </CardDescription>
              
              {/* AI Disclaimer for Results */}
              <div className="flex items-start space-x-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-md border border-amber-200 dark:border-amber-800 mt-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">AI-Generated Code</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">Please review, test, and modify the code as needed. The AI may not capture all design nuances or accessibility requirements.</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  variant={activeTab === 'react' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('react')}
                >
                  React + Tailwind
                </Button>
                <Button
                  variant={activeTab === 'html' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('html')}
                >
                  HTML + CSS
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 w-full">
              {activeTab === 'react' && (
                <div className="w-full">
                  <div className="w-full">
                    <h4 className="font-semibold mb-3">React Component with Tailwind CSS</h4>
                    <div className="relative w-full">
                      <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto border w-full">
                        <code className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{result.code.react}</code>
                      </pre>
                      <button 
                        className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        onClick={() => navigator.clipboard.writeText(result.code.react)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'html' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  <div className="w-full">
                    <h4 className="font-semibold mb-3">HTML Structure</h4>
                    <div className="relative w-full">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm max-h-80 overflow-y-auto border w-full">
                        <code className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{result.code.html}</code>
                      </pre>
                      <button 
                        className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        onClick={() => navigator.clipboard.writeText(result.code.html)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="w-full">
                    <h4 className="font-semibold mb-3">CSS Styles</h4>
                    <div className="relative w-full">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm max-h-80 overflow-y-auto border w-full">
                        <code className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{result.code.css}</code>
                      </pre>
                      <button 
                        className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        onClick={() => navigator.clipboard.writeText(result.code.css)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Palette className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Smart Analysis</h3>
            <p className="text-sm text-muted-foreground">AI identifies components and layout patterns</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Code className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Clean Code</h3>
            <p className="text-sm text-muted-foreground">Production-ready React + Tailwind CSS</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Multiple Formats</h3>
            <p className="text-sm text-muted-foreground">Get both React + Tailwind and HTML + CSS</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}