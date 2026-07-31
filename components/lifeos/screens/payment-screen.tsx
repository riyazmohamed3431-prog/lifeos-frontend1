'use client'

import { useState } from 'react'
import { mechanic, type Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { Check, CreditCard, ShieldCheck, FileText, Loader2, Lock, Smartphone, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const paymentMethods = [
  { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)', sub: 'lifeos@okaxis', icon: Smartphone },
  { id: 'card', name: 'Credit / Debit Card', sub: '•••• 4218 (HDFC Visa)', icon: CreditCard },
  { id: 'netbanking', name: 'Net Banking', sub: 'HDFC / ICICI / SBI / Axis', icon: Building2 },
]

export function PaymentScreen({
  emergency,
  vehicleName,
  onDone,
}: {
  emergency?: Emergency | null
  vehicleName?: string
  onDone: () => void
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStep, setProcessStep] = useState(0)
  const [paid, setPaid] = useState(false)

  const fee = emergency?.fee ?? 750
  const title = emergency?.label ?? 'Flat Tyre Replacement'


  const processingSteps = [
    'Encrypting 256-Bit SSL Credentials…',
    'Connecting to Payment Gateway…',
    'Authorizing Transaction with Bank…',
    'Payment Verified Successfully!',
  ]

  const handleStartPayment = () => {
    setIsProcessing(true)
    setProcessStep(0)

    const interval = setInterval(() => {
      setProcessStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval)
          setTimeout(() => {
            setIsProcessing(false)
            setPaid(true)
          }, 800)
          return prev
        }
        return prev + 1
      })
    }, 900)
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar px-6 pt-10 pb-10">
      <AmbientBg tone="calm" />

      {/* Payment Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-up">
          <div className="surface-card relative w-full max-w-sm rounded-3xl p-6 text-center space-y-5 border border-white/10 shadow-2xl">
            <div className="relative mx-auto grid size-20 place-items-center rounded-full bg-primary/20 text-primary border border-primary/30">
              <Loader2 className="size-10 animate-spin" />
              <Lock className="absolute size-4 text-emerald-400 bottom-1 right-1" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Processing Payment</h3>
              <p className="text-xs text-accent font-semibold">₹{fee}.00 · {paymentMethods.find((m) => m.id === selectedMethod)?.name}</p>
            </div>

            {/* Processing Checklist */}
            <div className="space-y-2 text-left pt-2">
              {processingSteps.map((stepText, idx) => {
                const isDone = idx < processStep
                const isCurrent = idx === processStep
                return (
                  <div
                    key={stepText}
                    className={cn(
                      'surface-card rounded-xl p-3 flex items-center gap-3 text-xs transition-all',
                      idx > processStep && 'opacity-30',
                    )}
                  >
                    {isDone ? (
                      <Check className="size-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="size-4 animate-spin text-primary shrink-0" />
                    ) : (
                      <span className="size-4 rounded-full border border-muted-foreground/30 shrink-0" />
                    )}
                    <span className={isDone ? 'text-muted-foreground' : 'text-foreground font-semibold'}>
                      {stepText}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="size-3.5 text-emerald-400" /> 256-Bit Bank Level Encryption
            </div>
          </div>
        </div>
      )}

      {!paid ? (
        <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Service Complete
            </h1>
            <p className="text-xs text-muted-foreground">
              Repair verified by {mechanic.name}. Please select payment method & confirm.
            </p>
          </div>

          {/* Invoice Summary */}
          <div className="surface-card rounded-2xl p-5 space-y-3 shadow-xl border border-white/10">
            <Row label="Emergency Priority Dispatch" value={`₹${Math.max(0, fee > 300 ? fee - 300 : fee)}.00`} />
            <Row label={title} value={`₹${fee > 300 ? 300 : fee}.00`} />
            <Row label="GST (18% Included)" value="₹0.00" />
            <div className="my-2 border-t border-white/10" />
            <Row label="Total Amount Payable" value={`₹${fee}.00`} bold />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              Select Payment Method
            </h2>
            <div className="space-y-2">
              {paymentMethods.map((m) => {
                const Icon = m.icon
                const isSelected = selectedMethod === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    className={cn(
                      'surface-card w-full flex items-center justify-between rounded-2xl p-3.5 transition-all cursor-pointer border',
                      isSelected
                        ? 'border-primary/60 bg-primary/10 text-foreground'
                        : 'border-white/5 hover:bg-secondary/50 text-muted-foreground',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('grid size-10 place-items-center rounded-xl', isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground')}>
                        <Icon className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-foreground">{m.name}</p>
                        <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="size-5 text-primary" />}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleStartPayment}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-xl hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="size-4" />
            <span>Confirm & Pay ₹{fee}.00</span>
          </button>
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col justify-between items-center text-center space-y-6">
          <div className="space-y-4 pt-4">
            <div className="grid size-20 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto border border-emerald-500/40">
              <Check className="size-10" strokeWidth={2.8} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Payment Successful</h1>
              <p className="text-xs text-muted-foreground mt-1">Transaction Ref #TN-PAY-98402</p>
            </div>
          </div>

          {/* Digital Receipt Card */}
          <div className="w-full surface-card rounded-2xl p-5 space-y-4 text-left border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <FileText className="size-4 text-primary" />
                <span>LifeOS Official Receipt</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400">Paid</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Provided</span>
                <span className="font-semibold text-foreground">{title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Responded By</span>
                <span className="font-semibold text-foreground">{mechanic.name} ({mechanic.rating} ★)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-semibold text-foreground">{mechanic.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Mode</span>
                <span className="font-semibold text-foreground">{paymentMethods.find((m) => m.id === selectedMethod)?.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5 font-bold">
                <span className="text-foreground">Total Paid</span>
                <span className="text-primary">₹{fee}.00</span>
              </div>
            </div>
          </div>

          <button
            onClick={onDone}
            className="w-full rounded-2xl surface-card py-4 text-sm font-bold text-foreground hover:bg-secondary transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="size-4 text-emerald-400" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={bold ? 'text-xs font-bold text-foreground' : 'text-xs text-muted-foreground'}>{label}</span>
      <span className={bold ? 'text-base font-extrabold text-foreground' : 'text-xs font-semibold text-foreground'}>{value}</span>
    </div>
  )
}
