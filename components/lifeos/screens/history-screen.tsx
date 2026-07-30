'use client'

import { history } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { Wrench, ChevronRight, Receipt } from 'lucide-react'

export function HistoryScreen() {
  return (
    <div className="relative h-full overflow-y-auto no-scrollbar px-6 pt-4 pb-28">
      <AmbientBg tone="primary" />

      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your journey</p>
        <h1 className="mt-1 text-3xl font-bold">Service timeline</h1>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { v: '14', l: 'Rescues' },
            { v: '4.9', l: 'Avg rating' },
            { v: '₹0', l: 'Owed' },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl px-3 py-3 text-center">
              <p className="text-xl font-bold text-primary">{s.v}</p>
              <p className="text-[10px] text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* timeline */}
        <div className="relative mt-7 pl-6">
          <div className="absolute left-[7px] top-1 bottom-6 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
          {history.map((h, i) => (
            <div
              key={h.id}
              className="relative mb-4 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="absolute -left-[22px] top-4 size-3.5 rounded-full bg-primary ring-4 ring-primary/20" />
              <div className="grad-border rounded-3xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-2xl bg-primary/15">
                      <Wrench className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{h.title}</p>
                      <p className="text-[11px] text-muted-foreground">{h.date}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                    {h.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-muted-foreground">
                  <span>{h.vehicle}</span>
                  <span>·</span>
                  <span>{h.mechanic}</span>
                  <span className="ml-auto font-semibold text-foreground">₹{h.amount.toLocaleString('en-IN')}</span>
                </div>

                <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/5 py-2 text-[11px] font-medium text-foreground/80">
                  <Receipt className="size-3.5" /> View receipt
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
