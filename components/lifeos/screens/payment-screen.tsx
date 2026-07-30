'use client'

import { useState } from 'react'
import { mechanic } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { Check, CreditCard, Plane, Star } from 'lucide-react'

export function PaymentScreen({ onDone }: { onDone: () => void }) {
  const [paid, setPaid] = useState(false)

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar px-6 pt-10 pb-8">
      <AmbientBg tone="calm" />

      {!paid ? (
        <div className="relative z-10 flex h-full flex-col">
          <h1 className="text-balance text-3xl font-bold">Service complete</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Repair verified. Review and confirm payment.</p>

          <div className="mt-7 grad-border rounded-3xl p-5">
            <Row label="Inspection" value="₹250" />
            <Row label="Flat tyre repair" value="₹850" />
            <Row label="Priority dispatch" value="₹150" />
            <div className="my-3 border-t border-dashed border-white/15" />
            <Row label="Total" value="₹1,250" bold />
          </div>

          <div className="mt-5 space-y-2.5">
            <p className="text-sm font-medium">Payment method</p>
            <button className="glass flex w-full items-center gap-3 rounded-2xl px-4 py-3.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/15">
                <CreditCard className="size-4.5 text-primary" />
              </span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">LifeOS Card</p>
                <p className="text-[11px] text-muted-foreground">•••• 2032</p>
              </div>
              <Check className="size-5 text-accent" />
            </button>
          </div>

          <button
            onClick={() => setPaid(true)}
            className="mt-auto w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground glow-primary transition-transform active:scale-[0.98]"
          >
            Pay ₹1,250
          </button>
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col items-center">
          {/* success */}
          <div className="mt-6 grid place-items-center">
            <div className="relative grid size-24 place-items-center">
              <span className="absolute inset-0 rounded-full bg-accent/30 animate-pulse-ring" />
              <span className="grid size-24 place-items-center rounded-full bg-accent text-accent-foreground glow-accent animate-breathe">
                <Check className="size-11" strokeWidth={3} />
              </span>
            </div>
            <h1 className="mt-5 text-2xl font-bold">Payment successful</h1>
            <p className="text-sm text-muted-foreground">Your digital receipt is ready.</p>
          </div>

          {/* boarding-pass receipt */}
          <div className="mt-7 w-full animate-rise">
            <div className="glass-strong overflow-hidden rounded-3xl">
              <div className="flex items-center justify-between bg-primary/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Plane className="size-4 text-primary" />
                  <span className="text-sm font-semibold tracking-wide">LIFEOS RECEIPT</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">#LX-4218</span>
              </div>

              <div className="relative px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Service</p>
                    <p className="text-sm font-semibold">Flat Tyre Repair</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Paid</p>
                    <p className="text-sm font-semibold">₹1,250</p>
                  </div>
                </div>

                <div className="my-4 flex items-center gap-2">
                  <span className="size-4 rounded-full bg-background" />
                  <div className="h-px flex-1 border-t border-dashed border-white/20" />
                  <span className="size-4 rounded-full bg-background" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="size-3.5 fill-accent text-accent" />
                    {mechanic.name} · {mechanic.rating}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">Route 9 · 02:14</p>
                </div>

                {/* barcode */}
                <div className="mt-4 flex h-9 items-end gap-[3px]">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-full bg-foreground/70"
                      style={{ height: `${20 + ((i * 37) % 80)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onDone}
            className="mt-auto w-full rounded-2xl glass py-4 text-sm font-semibold transition-transform active:scale-[0.98]"
          >
            Back to home
          </button>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={bold ? 'text-sm font-semibold' : 'text-sm text-muted-foreground'}>{label}</span>
      <span className={bold ? 'text-lg font-bold' : 'text-sm font-medium'}>{value}</span>
    </div>
  )
}
