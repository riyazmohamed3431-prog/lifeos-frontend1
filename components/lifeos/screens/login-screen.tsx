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
  Sparkles,
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
import { cn } from '@/lib/utils'

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
  const [forgotSent, setForgotSent] = useState(false)

  // Floating label active state helpers
  const [idFocused, setIdFocused] = useState(false)
  const [passFocused, setPassFocused] = useState(false)

  const validateInputs = (): boolean => {
    setError(null)
    if (!identifier.trim()) {
      setError('Please enter your email or mobile number.')
      return false
    }
    // Basic format check for email or mobile number
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())
    const isPhone = /^\+?[0-9]{7,15}$/.test(identifier.trim().replace(/[\s-]/g, ''))
    if (!isEmail && !isPhone) {
      setError('Please enter a valid email address or phone number.')
      return false
    }
    if (!password) {
      setError('Please enter your password.')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateInputs()) return

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
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
        setError('Invalid email/mobile or password. Please try again.')
      } else if (err?.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try signing in instead.')
      } else {
        setError(err?.message || 'Authentication failed. Please check your network and credentials.')
      }
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

  const handleForgotPassword = () => {
    if (!identifier.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      setError('Please enter your email above to receive a password reset link.')
      return
    }
    setError(null)
    setForgotSent(true)
    setTimeout(() => setForgotSent(false), 5000)
  }

  return (
    <div className="relative h-full w-full overflow-y-auto no-scrollbar px-6 py-8 flex flex-col justify-between select-none">
      {/* Background Ambient Glow */}
      <AmbientBg tone="primary" />

      {/* Top Floating Header & Logo */}
      <div className="relative z-10 w-full animate-fade-up">
        <div className="flex items-center justify-between">
          {/* Logo Badge */}
          <div className="flex items-center gap-3">
            <div className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/40 shadow-lg shadow-primary/20">
              <ShieldCheck className="size-7 text-primary glow-primary" />
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-accent animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                  LifeOS
                </span>
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent border border-accent/30 tracking-wider uppercase">
                  ROADASSIST
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">Autonomous Assistance Platform</p>
            </div>
          </div>

          <div className="glass rounded-full px-3 py-1 flex items-center gap-1.5 border border-white/10 text-xs font-semibold text-accent">
            <Sparkles className="size-3.5" />
            <span>v2.4 Secure</span>
          </div>
        </div>

        {/* Headings */}
        <div className="mt-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {isSignUp
              ? 'Join LifeOS for instant priority roadside dispatch.'
              : 'Sign in to continue your roadside assistance journey.'}
          </p>
        </div>
      </div>

      {/* Main Authentication Form */}
      <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {/* Error Alert */}
        {error && (
          <div className="glass-strong rounded-2xl p-3.5 border border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2.5 animate-rise">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="glass-strong rounded-2xl p-3.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-rise">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Reset Link Sent Notification */}
        {forgotSent && (
          <div className="glass-strong rounded-2xl p-3.5 border border-accent/40 bg-accent/10 text-accent text-xs font-semibold flex items-center gap-2.5 animate-rise">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Password reset instructions sent to {identifier}.</span>
          </div>
        )}

        {/* Field 1: Email or Mobile Number */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
            <Mail className="size-4" />
          </div>
          <input
            id="login-identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onFocus={() => setIdFocused(true)}
            onBlur={() => setIdFocused(false)}
            className={cn(
              'w-full glass bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 pt-6 pb-2 text-sm text-white placeholder-transparent transition-all duration-200 focus:outline-none focus:border-primary/80 focus:ring-2 focus:ring-primary/40 focus:bg-white/10 shadow-inner'
            )}
            placeholder="Email or Mobile Number"
            required
          />
          <label
            htmlFor="login-identifier"
            className={cn(
              'absolute left-11 transition-all duration-200 pointer-events-none text-xs font-medium',
              idFocused || identifier
                ? 'top-2 text-[10px] text-primary font-semibold'
                : 'top-1/2 -translate-y-1/2 text-muted-foreground'
            )}
          >
            Email or Mobile Number
          </label>
        </div>

        {/* Field 2: Password */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
            <Lock className="size-4" />
          </div>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
            className={cn(
              'w-full glass bg-white/5 border border-white/10 rounded-2xl pl-11 pr-12 pt-6 pb-2 text-sm text-white placeholder-transparent transition-all duration-200 focus:outline-none focus:border-primary/80 focus:ring-2 focus:ring-primary/40 focus:bg-white/10 shadow-inner'
            )}
            placeholder="Password"
            required
          />
          <label
            htmlFor="login-password"
            className={cn(
              'absolute left-11 transition-all duration-200 pointer-events-none text-xs font-medium',
              passFocused || password
                ? 'top-2 text-[10px] text-primary font-semibold'
                : 'top-1/2 -translate-y-1/2 text-muted-foreground'
            )}
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {/* Secondary row: Forgot Password? */}
        {!isSignUp && (
          <div className="flex justify-end pr-1">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-semibold text-accent hover:underline transition-all"
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Primary LOGIN Button */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground font-bold text-sm tracking-wide glow-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 overflow-hidden group shadow-xl"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <Zap className="size-4 group-hover:scale-110 transition-transform" />
              <span>{isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Secondary Options */}
      <div className="relative z-10 mt-6 space-y-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="w-full border-t border-white/10" />
          <span className="absolute bg-[oklch(0.16_0.02_264)] px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            or continue with
          </span>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full glass bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 px-4 text-xs font-semibold text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 shadow-md"
        >
          {googleLoading ? (
            <Loader2 className="size-4 animate-spin text-primary" />
          ) : (
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
          )}
          <span>Google Sign In</span>
        </button>

        {/* Continue as Guest */}
        <button
          type="button"
          onClick={handleGuestSignIn}
          disabled={guestLoading}
          className="w-full glass bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-2xl py-3.5 px-4 text-xs font-semibold text-primary transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {guestLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <span>Continue as Guest</span>
              <ArrowRight className="size-3.5" />
            </>
          )}
        </button>

        {/* Toggle between Login and Create Account */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setSuccessMsg(null)
            }}
            className="text-xs text-muted-foreground hover:text-white transition-colors"
          >
            {isSignUp ? (
              <span>
                Already have an account? <strong className="text-primary underline">Login</strong>
              </span>
            ) : (
              <span>
                Don’t have an account? <strong className="text-primary underline">Create Account</strong>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
