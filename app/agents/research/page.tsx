'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EnhancedLoading } from '@/components/ui/enhanced-loading'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Search, Globe, FileText, Download, AlertCircle, BookOpen, ExternalLink, Clock, ArrowRight } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

interface ResearchResult {
  query: string
  summary: string
  keyFindings: string[]
  sources: Array<{
    title: string
    url: string
    snippet: string
    relevanceScore: number
    domain: string
  }>
  analysis: {
    credibility: string
    consensus: string
    dateRange: string
    topicDepth: string
  }
  report: string
  generatedAt: string
}

export default function ResearchAgentPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'sources' | 'report'>('summary')

  const conductResearch = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch('/api/agents/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to conduct research')
      }
      
      return response.json()
    },
    onSuccess: (data) => {
      setResult(data)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      conductResearch.mutate(query.trim())
    }
  }

  const downloadReport = () => {
    if (!result) return
    
    const content = `# Research Report: ${result.query}

## Summary
${result.summary}

## Key Findings
${result.keyFindings.map((finding, index) => `${index + 1}. ${finding}`).join('\n')}

## Detailed Analysis
${result.report}

## Sources
${result.sources.map((source, index) => 
  `${index + 1}. ${source.title}\n   URL: ${source.url}\n   Snippet: ${source.snippet}\n`
).join('\n')}

---
Generated on: ${new Date(result.generatedAt).toLocaleString()}
`
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `research-report-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center mx-auto">
          <Search className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Research Agent</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Autonomous web research with multi-source analysis and comprehensive reports
        </p>
      </div>

      {/* Input Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Start Research</CardTitle>
          <CardDescription>
            Enter your research question or topic to get comprehensive analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Research Query</label>
              <Textarea
                placeholder="What are the latest developments in artificial intelligence for healthcare?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={conductResearch.isPending}
                rows={3}
                className="resize-none"
              />
            </div>
            
            <EnhancedButton 
              type="submit" 
              variant="gradient"
              className="w-full flex items-center justify-center" 
              disabled={conductResearch.isPending || !query.trim()}
            >
              {conductResearch.isPending ? (
                <>
                  <EnhancedLoading variant="sparkles" size="sm" />
                  <span className="ml-2">Researching...</span>
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Start Research
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </EnhancedButton>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {conductResearch.error && (
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {conductResearch.error.message}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Research Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Research Results</CardTitle>
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={downloadReport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </EnhancedButton>
              </div>
              <CardDescription>
                Query: "{result.query}"
              </CardDescription>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {new Date(result.generatedAt).toLocaleString()}
                </span>
                <span>Sources: {result.sources.length}</span>
                <span>Credibility: {result.analysis.credibility}</span>
              </div>
            </CardHeader>
          </Card>

          {/* Content Tabs */}
          <Card>
            <CardHeader>
              <div className="flex space-x-2">
                <EnhancedButton
                  variant={activeTab === 'summary' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('summary')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Summary
                </EnhancedButton>
                <EnhancedButton
                  variant={activeTab === 'sources' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('sources')}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Sources ({result.sources.length})
                </EnhancedButton>
                <EnhancedButton
                  variant={activeTab === 'report' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('report')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Full Report
                </EnhancedButton>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Executive Summary</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {result.summary}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Key Findings</h4>
                    <ul className="space-y-2">
                      {result.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">Credibility</h4>
                      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        result.analysis.credibility === 'High' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : result.analysis.credibility === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {result.analysis.credibility}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">Consensus</h4>
                      <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {result.analysis.consensus}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">Date Range</h4>
                      <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        {result.analysis.dateRange}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">Depth</h4>
                      <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                        {result.analysis.topicDepth}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'sources' && (
                <div className="space-y-4">
                  {result.sources.map((source, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{source.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {Math.round(source.relevanceScore * 100)}% relevant
                            </span>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {source.snippet}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <span>{source.domain}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {activeTab === 'report' && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {result.report}
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
            <Search className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Web Scraping</h3>
            <p className="text-sm text-muted-foreground">Automated data collection from multiple sources</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Source Analysis</h3>
            <p className="text-sm text-muted-foreground">Credibility assessment and relevance scoring</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Report Generation</h3>
            <p className="text-sm text-muted-foreground">Comprehensive reports with citations</p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card className="max-w-2xl mx-auto bg-muted/50">
        <CardContent className="pt-6 text-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="font-semibold mb-2">Research Agent Coming Soon</h3>
          <p className="text-sm text-muted-foreground">
            The research agent is currently under development. It will provide autonomous web research 
            with multi-source analysis, credibility assessment, and comprehensive report generation.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}