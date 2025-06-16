import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Simple database connectivity check
    await prisma.$queryRaw`SELECT 1`
    
    const dbHealth = {
      status: 'connected',
      timestamp: new Date().toISOString(),
      database: 'operational'
    }

    return NextResponse.json(dbHealth, { status: 200 })
  } catch (error) {
    console.error('Database health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'disconnected', 
        error: error instanceof Error ? error.message : 'Database connection failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}