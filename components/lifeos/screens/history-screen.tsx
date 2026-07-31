'use client'

import { history } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { Wrench, ChevronRight, FileText, CheckCircle2 } from 'lucide-react'

export function HistoryScreen() {
  return (
    <div className="relative h-full overflow-y-auto no-scrollbar px-5 pt-4 pb-32">
      <AmbientBg tone="primary" />

      <div className="relative z-10 space-y-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Service Logs
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
            Dispatch History
          </h1>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="surface-card rounded-2xl p-3 text-center border border-white/5">
            <p className="text-lg font-bold text-primary">{history.length}</p>
            <p className="text-[10px] font-semibold text-muted-foreground">Total Services</p>
          </div>
          <div className="surface-card rounded-2xl p-3 text-center border border-white/5">
            <p className="text-lg font-bold text-amber-400">4.97 ★</p>
            <p className="text-[10px] font-semibold text-muted-foreground">Avg Satisfaction</p>
          </div>
          <div className="surface-card rounded-2xl p-3 text-center border border-white/5">
            <p className="text-lg font-bold text-emerald-400">₹0.00</p>
            <p className="text-[10px] font-semibold text-muted-foreground">Balance Due</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {history.map((h) => (
            <div key={h.id} className="surface-card rounded-2xl p-4 space-y-3 border border-white/5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Wrench className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{h.title}</h3>
                    <p className="text-[11px] text-muted-foreground">{h.date}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="size-3" /> {h.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-white/5">
                <span>{h.vehicle}</span>
                <span>•</span>
                <span>Tech: {h.mechanic}</span>
                <span className="font-bold text-foreground ml-auto">₹{h.amount}</span>
              </div>

              <button className="w-full rounded-xl bg-secondary/60 hover:bg-secondary py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground transition-all cursor-pointer">
                <FileText className="size-3.5 text-primary" />
                <span>View Receipt</span>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
