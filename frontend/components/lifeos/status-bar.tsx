'use client'

import { Signal, Wifi, BatteryFull } from 'lucide-react'
import { useEffect, useState } from 'react'

export function StatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      )
    update()
    const t = setInterval(update, 1000 * 20)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative z-30 flex items-center justify-between px-6 pt-3 pb-1 text-xs font-medium text-foreground/90">
      <span className="font-mono tabular-nums">{time || '--:--'}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="size-3.5" />
        <Wifi className="size-3.5" />
        <BatteryFull className="size-4" />
      </div>
    </div>
  )
}
