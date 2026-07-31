'use client'

import { useEffect, useState } from 'react'
import { PhoneOff, Mic, MicOff, Volume2, ShieldCheck, MapPin } from 'lucide-react'
import { mechanic } from '@/lib/lifeos'

export function CallModal({
  isOpen,
  onClose,
  mechanicName = mechanic.name,
  mechanicPhone = mechanic.phone,
}: {
  isOpen: boolean
  onClose: () => void
  mechanicName?: string
  mechanicPhone?: string
}) {
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0)
      return
    }
    const timer = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isOpen])

  if (!isOpen) return null

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-up">
      <div className="surface-card relative w-full max-w-sm rounded-3xl p-6 text-center space-y-6 border border-white/10 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-white/5 pb-3">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Live Call Connected
          </span>
          <span className="font-mono font-bold text-foreground">{formatTime(seconds)}</span>
        </div>

        {/* Tamil Mechanic Avatar & Identity */}
        <div className="space-y-3 py-2">
          <div className="relative mx-auto grid size-20 place-items-center rounded-full bg-primary/20 text-primary text-2xl font-bold border-2 border-primary/40 shadow-xl">
            {mechanicName.split(' ').map((n) => n[0]).join('')}
            <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
              <ShieldCheck className="size-4" />
            </span>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">{mechanicName}</h2>
            <p className="text-xs font-semibold text-accent mt-0.5">{mechanicPhone}</p>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <MapPin className="size-3 text-primary" /> GST Road NH-45 · Chengalpattu, Tamil Nadu
            </p>
          </div>
        </div>

        {/* Live Audio Equalizer Waveform */}
        <div className="flex items-center justify-center gap-1 py-1">
          {[12, 24, 18, 30, 22, 36, 16, 28, 14].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-accent/80 animate-breathe"
              style={{
                height: `${h}px`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>

        {/* Tamil Technician Voice Message Box */}
        <div className="surface-card rounded-2xl p-3.5 text-left border border-white/5 bg-secondary/40 space-y-1">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Tamil Nadu Rescue Dispatcher</p>
          <p className="text-xs font-medium text-foreground leading-relaxed">
            &ldquo;Vanakkam! I&apos;m {mechanicName} from LifeOS Tamil Nadu Rescue Squad. I am driving on NH-45 GST Road near Chengalpattu Toll. Arriving in ~8 mins. Stay inside your vehicle!&rdquo;
          </p>
        </div>

        {/* Call Action Controls */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            onClick={() => setMuted(!muted)}
            className={`grid size-12 place-items-center rounded-full transition-all cursor-pointer ${
              muted ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'surface-card text-foreground hover:bg-secondary'
            }`}
            title={muted ? 'Unmute' : 'Mute Microphone'}
          >
            {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </button>

          <button
            onClick={onClose}
            className="grid size-16 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-2xl hover:bg-destructive/90 active:scale-95 transition-all cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="size-7" />
          </button>

          <button
            className="grid size-12 place-items-center rounded-full surface-card text-accent hover:bg-secondary transition-all cursor-pointer"
            title="Speakerphone Active"
          >
            <Volume2 className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
