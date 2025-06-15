import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { verifyToken } from './auth'

const prisma = new PrismaClient()

/**
 * Get the current authenticated user from the request
 */
export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return null
    }
    
    const payload = verifyToken(token)
    if (!payload) {
      return null
    }
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        avatar: true,
        emailVerified: true,
        createdAt: true
      }
    })
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Link agent execution to the current user
 */
export async function linkExecutionToUser(executionId: string, userId: string) {
  try {
    await prisma.agentExecution.update({
      where: { id: executionId },
      data: { userId }
    })
  } catch (error) {
    console.error('Error linking execution to user:', error)
  }
}

/**
 * Link usage record to the current user
 */
export async function linkUsageToUser(usageId: string, userId: string) {
  try {
    await prisma.usage.update({
      where: { id: usageId },
      data: { userId }
    })
  } catch (error) {
    console.error('Error linking usage to user:', error)
  }
}

/**
 * Get user's agent executions
 */
export async function getUserExecutions(userId: string, limit = 10) {
  try {
    const executions = await prisma.agentExecution.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        agentType: true,
        status: true,
        tokensUsed: true,
        duration: true,
        createdAt: true,
        error: true
      }
    })
    
    return executions
  } catch (error) {
    console.error('Error getting user executions:', error)
    return []
  }
}

/**
 * Get user's usage statistics
 */
export async function getUserUsageStats(userId: string) {
  try {
    const stats = await prisma.usage.groupBy({
      by: ['agentType'],
      where: { userId },
      _sum: {
        tokens: true,
        cost: true
      },
      _count: {
        id: true
      }
    })
    
    const totalStats = await prisma.usage.aggregate({
      where: { userId },
      _sum: {
        tokens: true,
        cost: true
      },
      _count: {
        id: true
      }
    })
    
    return {
      byAgent: stats,
      total: totalStats
    }
  } catch (error) {
    console.error('Error getting user usage stats:', error)
    return {
      byAgent: [],
      total: {
        _sum: { tokens: 0, cost: 0 },
        _count: { id: 0 }
      }
    }
  }
}