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
  Sparkles,
  Check,
  ArrowLeft,
} from 'lucide-react'
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginAsGuest,
  type AuthUser,
} from '@/lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import { ScaleButton } from '@/components/ui/framer-wrapper'

export function LoginScreen({
  onLoginSuccess,
  onBack,
}: {
  onLoginSuccess: (user: AuthUser) => void
  onBack?: () => void
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

  const [fullName, setFullName] = useState('')

  // Password Strength Calculator
  const calculatePasswordStrength = (pass: string) => {
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 10) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1
    return score
  }

  const passStrength = calculatePasswordStrength(password)

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
      setError(err?.message || 'Google Sign-In failed. Please try again.')
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
    <div className="flex h-screen w-full select-none font-sans overflow-hidden bg-[#0B0B0C]">
      {/* Centered Login Panel */}
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0B0B0C] relative overflow-y-auto no-scrollbar">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[450px] rounded-full bg-[#F59E0B]/5 blur-[120px] pointer-events-none" />

        {/* Back Button to Landing */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-6 right-6 z-50 flex items-center gap-2 rounded-full bg-neutral-900/60 hover:bg-neutral-800/80 px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white border border-white/5 transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </button>
        )}

        {/* Centered Login Card */}
        <div className="w-full max-w-[420px] bg-[#131316]/95 border border-white/5 p-8 rounded-[28px] shadow-2xl flex flex-col justify-between relative backdrop-blur-md z-10 animate-fade-up">
          <div>
            {/* Nexora Geometric Circle Logo */}
            <div className="mx-auto size-16 rounded-full border border-white/10 bg-neutral-900/85 flex items-center justify-center mb-6 shadow-inner">
              <svg className="size-7 text-[#F59E0B] animate-float-card" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 7 22 17 12 22 2 17 2 7" />
                <line x1="12" y1="2" x2="12" y2="12" />
                <line x1="12" y1="12" x2="2" y2="7" />
                <line x1="12" y1="12" x2="22" y2="7" />
              </svg>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {isSignUp ? 'Create Account' : 'Login'}
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                {isSignUp ? 'Sign up to your account to continue' : 'Login to your account to continue'}
              </p>
            </div>

            {/* Status messages */}
            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#18181C] border border-white/5 rounded-2xl px-4 py-3.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F59E0B]/50 transition-colors shadow-inner"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-neutral-600" />
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-[#18181C] border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F59E0B]/50 transition-colors shadow-inner"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-neutral-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#18181C] border border-white/5 rounded-2xl pl-11 pr-11 py-3.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F59E0B]/50 transition-colors shadow-inner"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength for registration */}
              {isSignUp && password.length > 0 && (
                <div className="space-y-1 px-1 mt-1">
                  <div className="flex items-center justify-between text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                    <span>Security Rating</span>
                    <span className={passStrength >= 4 ? 'text-emerald-400 font-bold' : 'text-amber-500 font-bold'}>
                      {passStrength <= 2 ? 'Weak' : passStrength <= 3 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-full flex-1 transition-all ${level <= passStrength
                          ? passStrength >= 4
                            ? 'bg-emerald-400'
                            : passStrength >= 3
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Forgot Password */}
              {!isSignUp && (
                <div className="flex justify-end pt-1">
                  <a href="#" className="text-xs text-[#F59E0B] hover:text-[#D97706] font-semibold transition-colors">
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Submit button */}
              <ScaleButton
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#F3A953] to-[#E2833B] hover:opacity-95 text-neutral-900 font-bold py-3.5 mt-5 text-xs tracking-wider uppercase shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Register' : 'Login'}</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </ScaleButton>
            </form>
          </div>

          <div className="mt-6 border-t border-white/5 pt-5 text-center">
            {/* Divider */}
            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <span className="relative bg-[#131316] px-3 text-[10px] uppercase tracking-wider text-neutral-600 font-bold">
                or continue with
              </span>
            </div>

            {/* Social Logins */}
            <div className="flex items-center justify-center gap-4">
              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="size-11 rounded-full border border-white/5 bg-[#18181C] flex items-center justify-center hover:bg-neutral-800 hover:border-white/10 active:scale-95 transition-all cursor-pointer shadow-md"
                title="Continue with Google"
              >
                {googleLoading ? (
                  <Loader2 className="size-4 text-neutral-400 animate-spin" />
                ) : (
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                )}
              </button>

              {/* Apple */}
              <button
                type="button"
                className="size-11 rounded-full border border-white/5 bg-[#18181C] flex items-center justify-center hover:bg-neutral-800 hover:border-white/10 active:scale-95 transition-all cursor-pointer shadow-md"
                title="Continue with Apple"
              >
                <svg className="size-5 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39" />
                </svg>
              </button>

              {/* GitHub */}
              <button
                type="button"
                className="size-11 rounded-full border border-white/5 bg-[#18181C] flex items-center justify-center hover:bg-neutral-800 hover:border-white/10 active:scale-95 transition-all cursor-pointer shadow-md"
                title="Continue with GitHub"
              >
                <svg className="size-5 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </button>
            </div>

            {/* Instant Demo Access (Cashless guest login) */}
            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={handleGuestSignIn}
                disabled={guestLoading}
                className="text-[11px] text-neutral-400 hover:text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer bg-neutral-900/40 hover:bg-neutral-900/90 border border-white/5 rounded-full px-3.5 py-1.5 shadow-sm"
              >
                {guestLoading ? (
                  <Loader2 className="size-3.5 animate-spin text-neutral-400" />
                ) : (
                  <>
                    <Sparkles className="size-3.5 text-[#F59E0B]" />
                    <span>Instant Demo Guest Access</span>
                  </>
                )}
              </button>
            </div>

            {/* Sign Up Toggle Link */}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer mt-5 block w-full font-medium"
            >
              {isSignUp ? (
                <>
                  Already have an account? <span className="text-[#F59E0B] font-bold">Sign In</span>
                </>
              ) : (
                <>
                  Don't have an account? <span className="text-[#F59E0B] font-bold">Sign up</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secure Badge Under Card */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-600 mt-6 z-10">
          <ShieldCheck className="size-4 text-neutral-600" />
          <span>Your data is secure with us</span>
        </div>
      </div>
    </div>
  )
}
