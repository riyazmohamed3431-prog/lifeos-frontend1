'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, Zap, Sparkles, Navigation } from 'lucide-react'

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0)
  const [tagline, setTagline] = useState('Initializing LifeOS platform...')

  useEffect(() => {
    // Smooth progress bar animation over 2.4s
    const startTime = Date.now()
    const duration = 2400

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(currentProgress)

      if (currentProgress > 70) {
        setTagline('Preparing your roadside assistant...')
      } else if (currentProgress > 35) {
        setTagline('Connecting with nearby verified rescue squad...')
      } else {
        setTagline('Locating roadside assistance network...')
      }

      if (elapsed >= duration) {
        clearInterval(interval)
        // Finish splash animation and navigate to login
        setTimeout(() => {
          onFinish()
        }, 150)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [onFinish])

  return (
    <div className="relative min-h-[600px] h-full w-full flex flex-col items-center justify-center bg-[oklch(0.12_0.005_260)] text-foreground overflow-hidden rounded-3xl p-6 select-none">
      {/* Background Soft Ambient Depths */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full bg-accent/10 blur-[70px] pointer-events-none" />

      {/* Center Branding & Animated Aura */}
      <div className="relative flex flex-col items-center z-10 space-y-6 text-center max-w-sm">
        {/* Glowing Logo Icon Container */}
        <div className="relative group">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/40 blur-xl opacity-80 animate-pulse" />
          
          <div className="relative grid size-20 place-items-center rounded-3xl bg-[oklch(0.18_0.008_260)] border border-white/15 shadow-2xl shadow-primary/20">
            <ShieldCheck className="size-10 text-primary animate-bounce" />
          </div>

          <div className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-accent text-accent-foreground shadow-md animate-ping" />
          <div className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-accent text-accent-foreground shadow-md">
            <Zap className="size-3.5 fill-current" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Life<span className="text-primary">OS</span>
            </h1>
            <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-accent tracking-wider uppercase">
              Pro Rescue
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium tracking-wide">
            Autonomous Emergency Roadside Platform
          </p>
        </div>

        {/* Dynamic Loading Bar */}
        <div className="w-full space-y-3 pt-2">
          <div className="h-2 w-full rounded-full bg-white/10 p-0.5 overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-75 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Animated Status Tagline */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground px-1">
            <span className="flex items-center gap-1.5 text-foreground animate-fade-in">
              <Sparkles className="size-3 text-accent animate-spin" />
              {tagline}
            </span>
            <span className="text-accent font-mono font-bold">{progress}%</span>
          </div>
        </div>

        {/* Subtle Indicator */}
        <div className="pt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/70">
          <Navigation className="size-3 text-primary animate-pulse" />
          <span>Securing GPS & Roadside Dispatch Grid</span>
        </div>
      </div>
    </div>
  )
}
