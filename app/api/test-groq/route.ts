import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

export async function GET() {
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        status: 'error',
        message: 'GROQ_API_KEY not configured'
      }, { status: 500 })
    }

    // Test the API key with a simple request
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })

    const response = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: 'Say "API test successful" if you can read this.'
        }
      ],
      max_tokens: 10,
      temperature: 0
    })

    return NextResponse.json({
      status: 'success',
      message: 'Groq API is working correctly',
      response: response.choices[0]?.message?.content || 'No response'
    })

  } catch (error) {
    console.error('Groq API test error:', error)
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check if GROQ_API_KEY is valid and has sufficient credits'
    }, { status: 500 })
  }
}