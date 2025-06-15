'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Authentication has been disabled</p>
        </div>

        <Card className="p-6 space-y-6 text-center">
          <div className="space-y-4">
            <Home className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">No Authentication Required</h2>
              <p className="text-muted-foreground mt-2">
                This website no longer requires user authentication. You can access all features directly.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting to home page in a few seconds...
            </p>
            <Link href="/">
              <Button className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}