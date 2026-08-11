'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import type { AuthUser } from '@/lib/firebase'

export function WelcomeScreen({
  user,
  onContinue,
}: {
  user: AuthUser | null
  onContinue: () => void
}) {
  const [progress, setProgress] = useState(0)

  const rawName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User')
  // Format user name cleanly
  const formattedName = rawName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // 5-second progress countdown
  useEffect(() => {
    const duration = 5000
    const intervalTime = 50
    const step = (intervalTime / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + step
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onContinue()
      }, 150)
      return () => clearTimeout(timeout)
    }
  }, [progress, onContinue])

  return (
    <div className="fixed inset-0 z-[100] h-screen w-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#17092B] via-[#0E061E] to-[#06020D] text-white p-6 md:p-12 select-none overflow-hidden font-sans">
      {/* Background Ambient Depths & Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[350px] rounded-full bg-fuchsia-500/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-purple-500/10 blur-[90px] pointer-events-none" />

      {/* Top Header Indicator */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-mono tracking-widest uppercase shadow-lg shadow-purple-950/40">
          <Sparkles className="size-3.5 text-fuchsia-400 animate-spin-slow" />
          <span>System Initialized</span>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-300/70">
          <span className="size-2 rounded-full bg-fuchsia-500 animate-ping" />
          <span>LifeOS Cyber Gateway</span>
        </div>
      </div>

      {/* Center Cyber Glitch Text Display (Matching Reference Image) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-8">
        {/* Main WELCOME Glitch Title */}
        <div className="relative group">
          <h1
            className="glitch-text text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.18em] uppercase font-sans drop-shadow-2xl"
            data-text="WELCOME"
          >
            WELCOME
          </h1>

          {/* User Name Subtitle in Cyber Glitch Typography */}
          <div className="mt-4 md:mt-6">
            <h2
              className="glitch-text text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.15em] uppercase text-fuchsia-300 font-sans"
              data-text={formattedName}
            >
              {formattedName}
            </h2>
          </div>

          {/* Photorealistic Wet Floor Reflection (Matches Magnific Reference) */}
          <div
            className="absolute top-full left-0 w-full pt-2 pointer-events-none select-none opacity-30 blur-[1px] [transform:scaleY(-0.75)] origin-top"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)',
            }}
          >
            <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.18em] uppercase font-sans text-white/70">
              WELCOME
            </div>
            <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.15em] uppercase text-fuchsia-400/70 mt-4 md:mt-6">
              {formattedName}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls & Timer */}
      <div className="relative z-10 w-full max-w-md space-y-4 pt-4 text-center">
        <button
          onClick={onContinue}
          className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-extrabold text-sm py-4 px-8 shadow-xl shadow-purple-900/40 border border-fuchsia-400/30 transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 tracking-wider uppercase"
        >
          <span>Continue to Command Center</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5 text-fuchsia-200" />
        </button>

        {/* Progress Bar */}
        <div className="space-y-1.5 px-2">
          <div className="h-1.5 w-full rounded-full bg-purple-950/80 border border-purple-500/20 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-400 to-cyan-400 transition-all duration-75 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-purple-300/70">
            <span>Entering environment...</span>
            <span className="text-fuchsia-400 font-bold">
              {Math.max(0, Math.ceil((5000 - (progress / 100) * 5000) / 1000))}s
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
