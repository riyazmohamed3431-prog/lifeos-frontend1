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
} from 'lucide-react'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
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
  const [error,
    setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [vehicleBrand, setVehicleBrand] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')

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
    <div className="relative h-full w-full overflow-y-auto no-scrollbar px-6 py-8 flex flex-col justify-between select-none font-sans">
      <AmbientBg tone="primary" />

      {/* Header */}
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 text-primary border border-primary/40 shadow-lg">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight gradient-text-primary">LifeOS</h1>
            <p className="text-xs text-muted-foreground font-medium">Roadside Command Portal</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-1 rounded-2xl surface-card p-1 border border-border shadow-inner">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false)
              setError(null)
            }}
            className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${!isSignUp ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true)
              setError(null)
            }}
            className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${isSignUp ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? 'signup' : 'signin'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
          >
            <h2 className="text-2xl font-black text-foreground">
              {isSignUp ? 'Create Driver Account' : 'Welcome Back, Driver'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isSignUp
                ? 'Register for 24/7 priority emergency dispatch across Tamil Nadu.'
                : 'Sign in to access your garage and roadside emergency radar.'}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4 my-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card rounded-2xl p-3 border border-destructive/40 text-destructive text-xs font-bold flex items-center gap-2"
          >
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card rounded-2xl p-3 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {isSignUp && (
          <div className="relative">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="surface-glass w-full rounded-2xl px-4 py-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary border border-border transition-colors shadow-sm"
              placeholder="Full Name"
              required
            />
          </div>
        )}


        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="surface-glass w-full rounded-2xl pl-11 pr-4 py-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary border border-border transition-colors shadow-sm"
            placeholder="Email Address"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="surface-glass w-full rounded-2xl pl-11 pr-11 py-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary border border-border transition-colors shadow-sm"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {/* Password Strength Indicator (Sign Up Mode) */}
          {isSignUp && password.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 px-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                <span>Security Rating</span>
                <span className={passStrength >= 4 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {passStrength <= 2 ? 'Weak' : passStrength <= 3 ? 'Medium' : 'Strong'}
                </span>
              </div>
              <div className="flex gap-1 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-full flex-1 transition-all ${level <= passStrength
                      ? passStrength >= 4
                        ? 'bg-emerald-400'
                        : passStrength >= 3
                          ? 'bg-amber-400'
                          : 'bg-destructive'
                      : 'bg-transparent'
                      }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <ScaleButton
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-extrabold py-4 text-xs tracking-wider uppercase shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Zap className="size-4 fill-white" />
              <span>{isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN NOW'}</span>
            </>
          )}
        </ScaleButton>
      </form>

      {/* Guest Access & Social Auth */}
      <div className="relative z-10 space-y-3 text-center">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full rounded-2xl border border-border surface-glass text-foreground font-bold py-3 text-xs flex items-center justify-center gap-2 hover:bg-secondary transition-all cursor-pointer shadow-sm"
        >
          {googleLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <span className="size-2 rounded-full bg-blue-500" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleGuestSignIn}
          disabled={guestLoading}
          className="w-full surface-glass hover:bg-accent/15 border-accent/30 rounded-2xl py-3.5 text-xs font-extrabold text-accent transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
        >
          {guestLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="size-4 text-accent" />
              <span>Instant Demo Access (No Password Required)</span>
              <ArrowRight className="size-3.5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError(null)
          }}
          className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors pt-1 cursor-pointer"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need a driver account? Register'}
        </button>
      </div>
    </div>
  )
}


