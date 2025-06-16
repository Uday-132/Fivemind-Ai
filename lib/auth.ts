import * as jwt from 'jsonwebtoken'

// JWT secret - in production, this should be from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface TokenPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

/**
 * Verify a JWT token and return the payload
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    return payload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Sign a JWT token with user data
 */
export function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d' // Token expires in 7 days
  })
}

/**
 * Decode a JWT token without verification (useful for expired tokens)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.decode(token) as TokenPayload
    return payload
  } catch (error) {
    console.error('Token decode failed:', error)
    return null
  }
}