'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginAsGuest,
  type AuthUser,
} from '@/lib/firebase'

export function LoginScreen({
  onLoginSuccess,
}: {
  onLoginSuccess: (user: AuthUser) => void
}) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      let user: AuthUser
      if (isSignUp) {
        user = await registerWithEmail(identifier.trim(), password)
        setSuccessMsg('Account created successfully!')
      } else {
        user = await loginWithEmail(identifier.trim(), password)
      }
      setTimeout(() => {
        onLoginSuccess(user)
      }, 400)
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      const user = await loginWithGoogle()
      onLoginSuccess(user)
    } catch (err: any) {
      setError('Google Sign-In failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGuestSignIn = async () => {
    setGuestLoading(true)
    setError(null)
    try {
      const user = await loginAsGuest()
      onLoginSuccess(user)
    } catch (err: any) {
      setError('Could not start guest session.')
    } finally {
      setGuestLoading(false)
    }
  }

  return (
    <div className="relative h-full w-full overflow-y-auto no-scrollbar px-6 py-8 flex flex-col justify-between select-none">
      <AmbientBg tone="primary" />

      {/* Header */}
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary/20 text-primary border border-primary/30">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">LifeOS</h1>
            <p className="text-xs text-muted-foreground">Roadside Assistance Platform</p>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isSignUp
              ? 'Register for 24/7 priority emergency dispatch.'
              : 'Sign in to access your garage and roadside safety hub.'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4 my-6">
        {error && (
          <div className="surface-card rounded-xl p-3 border border-destructive/40 text-destructive text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="surface-card rounded-xl p-3 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="surface-card w-full rounded-2xl pl-11 pr-4 py-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
            placeholder="Email Address"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="surface-card w-full rounded-2xl pl-11 pr-11 py-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
            placeholder="Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-4 text-xs tracking-wider uppercase shadow-xl hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Zap className="size-4" />
              <span>{isSignUp ? 'REGISTER ACCOUNT' : 'SIGN IN'}</span>
            </>
          )}
        </button>
      </form>

      {/* Guest Access & Toggle */}
      <div className="relative z-10 space-y-3 text-center">
        <button
          type="button"
          onClick={handleGuestSignIn}
          disabled={guestLoading}
          className="w-full surface-card hover:bg-secondary/70 rounded-2xl py-3 text-xs font-semibold text-primary transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          {guestLoading ? <Loader2 className="size-4 animate-spin" /> : <span>Instant Demo Access</span>}
          <ArrowRight className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError(null)
          }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignUp ? 'Already registered? Sign In' : 'Need an account? Create one'}
        </button>
      </div>
    </div>
  )
}
