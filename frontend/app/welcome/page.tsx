'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WelcomeScreen } from '@/components/lifeos/screens/welcome-screen'
import { getSavedSession, type AuthUser } from '@/lib/firebase'

export default function WelcomePage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = getSavedSession()
    if (saved) {
      setUser(saved)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="h-screen w-screen bg-[#0B0B0C]">
      <WelcomeScreen
        user={user}
        onContinue={() => router.push('/')}
      />
    </div>
  )
}
