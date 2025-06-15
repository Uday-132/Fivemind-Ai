'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Code, Clock, Zap, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

interface CodingResult {
  problem: {
    title: string
    difficulty: string
    description: string
    examples: Array<{
      input: string
      output: string
      explanation?: string
    }>
  }
  solution: {
    code: string
    language: string
    timeComplexity: string
    spaceComplexity: string
    explanation: string
  }
  alternativeSolutions?: Array<{
    code: string
    approach: string
    complexity: string
  }>
}

export default function CodingAgentPage() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<CodingResult | null>(null)

  const solveProblem = useMutation({
    mutationFn: async (leetcodeUrl: string) => {
      const response = await fetch('/api/agents/coding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: leetcodeUrl })
      })
      
      if (!response.ok) {
        throw new Error('Failed to solve problem')
      }
      
      return response.json()
    },
    onSuccess: (data) => {
      setResult(data)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      solveProblem.mutate(url.trim())
    }
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center mx-auto">
          <Code className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">AI Coding Agent</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Paste a LeetCode problem URL and get an optimized solution with detailed explanations
        </p>
      </div>

      {/* Input Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Solve LeetCode Problem</CardTitle>
          <CardDescription>
            Enter a LeetCode problem URL (e.g., https://leetcode.com/problems/two-sum/)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="https://leetcode.com/problems/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={solveProblem.isPending}
            />
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center" 
              disabled={solveProblem.isPending || !url.trim()}
            >
              {solveProblem.isPending ? (
                <>
                  <div className="spinner mr-2" />
                  Analyzing Problem...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Solve Problem
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {solveProblem.error && (
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {solveProblem.error.message}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Problem Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{result.problem.title}</span>
                </CardTitle>
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  result.problem.difficulty === 'Easy' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                  result.problem.difficulty === 'Medium' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                  result.problem.difficulty === 'Hard' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                )}>
                  {result.problem.difficulty}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Problem Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{result.problem.description}</p>
              </div>
              
              {result.problem.examples.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Examples</h4>
                  <div className="space-y-2">
                    {result.problem.examples.map((example, index) => (
                      <div key={index} className="bg-muted p-3 rounded-md">
                        <div><strong>Input:</strong> {example.input}</div>
                        <div><strong>Output:</strong> {example.output}</div>
                        {example.explanation && (
                          <div><strong>Explanation:</strong> {example.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Solution */}
          <Card>
            <CardHeader>
              <CardTitle>Optimized Solution</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Time: {result.solution.timeComplexity}</span>
                <span>Space: {result.solution.spaceComplexity}</span>
                <span>Language: {result.solution.language}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Code</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{result.solution.code}</code>
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Explanation</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{result.solution.explanation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Solutions */}
          {result.alternativeSolutions && result.alternativeSolutions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Alternative Approaches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.alternativeSolutions.map((alt, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{alt.approach}</h4>
                      <span className="text-sm text-muted-foreground">{alt.complexity}</span>
                    </div>
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                      <code>{alt.code}</code>
                    </pre>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Fast Analysis</h3>
            <p className="text-sm text-muted-foreground">Get solutions in under 10 seconds</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Code className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Multiple Solutions</h3>
            <p className="text-sm text-muted-foreground">Compare different approaches</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Detailed Explanations</h3>
            <p className="text-sm text-muted-foreground">Understand the logic step-by-step</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}