'use client'

import { useState } from 'react'
import { mechanic, type Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { WarmBadge, WarmButton, WarmCard } from '@/components/ui/warm-components'
import { Check, CreditCard, ShieldCheck, FileText, Loader2, Lock, Smartphone, Building2, Star, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

const paymentMethods = [
  { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)', sub: 'lifeos@okaxis', icon: Smartphone },
  { id: 'card', name: 'Credit / Debit Card', sub: '•••• 4218 (HDFC Visa)', icon: CreditCard },
  { id: 'netbanking', name: 'Net Banking', sub: 'HDFC / ICICI / SBI / Axis', icon: Building2 },
]

export function PaymentScreen({
  emergency,
  emergencies,
  vehicleName,
  onDone,
}: {
  emergency?: Emergency | null
  emergencies?: Emergency[] | null
  vehicleName?: string
  onDone: () => void
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [tipAmount, setTipAmount] = useState(50)
  const [rating, setRating] = useState(5)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStep, setProcessStep] = useState(0)
  const [paid, setPaid] = useState(false)

  const issueList = emergencies && emergencies.length > 0
    ? emergencies
    : emergency
    ? [emergency]
    : []

  const baseFee = issueList.length > 0
    ? issueList.reduce((acc, item) => acc + item.fee, 0)
    : (emergency?.fee ?? 750)

  const totalFee = baseFee + tipAmount
  const title = issueList.length > 0
    ? issueList.map((item) => item.label).join(' + ')
    : (emergency?.label ?? 'Flat Tyre Replacement')

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
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar px-6 pt-8 pb-10 font-sans text-foreground">
      <AmbientBg tone="calm" />

      {/* Payment Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <WarmCard className="relative w-full max-w-sm p-6 text-center space-y-5 border border-border shadow-2xl">
            <div className="relative mx-auto grid size-20 place-items-center rounded-full bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/30 shadow-xl">
              <Loader2 className="size-10 animate-spin text-[#F97316]" />
              <Lock className="absolute size-4 text-[#0F766E] bottom-1 right-1" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">Processing Cashless Payment</h3>
              <p className="text-xs text-[#F97316] font-black font-mono">₹{totalFee}.00 · {paymentMethods.find((m) => m.id === selectedMethod)?.name}</p>
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
                      'rounded-2xl p-3 flex items-center gap-3 text-xs transition-all border bg-card',
                      isDone ? 'border-[#0F766E]/30 bg-[#0F766E]/10' : isCurrent ? 'border-[#0F766E] bg-[#0F766E]/20' : 'border-border opacity-40',
                    )}
                  >
                    {isDone ? (
                      <Check className="size-4 text-[#0F766E] shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="size-4 animate-spin text-[#F97316] shrink-0" />
                    ) : (
                      <span className="size-4 rounded-full border border-muted-foreground/30 shrink-0" />
                    )}
                    <span className={isDone ? 'text-muted-foreground font-semibold' : 'text-foreground font-extrabold'}>
                      {stepText}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-bold pt-1">
              <ShieldCheck className="size-3.5 text-[#0F766E]" /> 256-Bit Bank Level Security
            </div>
          </WarmCard>
        </div>
      )}

      {!paid ? (
        <div className="relative z-10 flex h-full flex-col justify-between space-y-6 max-w-xl mx-auto w-full">
          <div className="space-y-2">
            <WarmBadge variant="emerald">On-Site Repair Complete</WarmBadge>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Settlement & Review
            </h1>
            <p className="text-xs text-muted-foreground">
              Repair verified by <span className="text-foreground font-bold">{mechanic.name}</span>. Confirm payment below.
            </p>
          </div>

          {/* Invoice Summary Card */}
          <WarmCard className="p-5 space-y-3 border border-border">
            <Row label="Emergency Priority Dispatch Base" value="₹0.00" />
            {issueList.length > 0 ? (
              issueList.map((item) => (
                <Row key={item.id} label={item.label} value={`₹${item.fee}.00`} />
              ))
            ) : (
              <Row label={title} value={`₹${baseFee}.00`} />
            )}
            {tipAmount > 0 && <Row label="Technician Support Tip" value={`+₹${tipAmount}.00`} highlight />}
            <Row label="GST (18% Included)" value="₹0.00" />
            <div className="my-2 border-t border-border" />
            <Row label="Total Amount Payable" value={`₹${totalFee}.00`} bold />
          </WarmCard>

          {/* Optional Tip Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Heart className="size-3.5 text-[#E11D48] fill-[#E11D48]" /> Tip Technician ({mechanic.name.split(' ')[0]})
              </h2>
              <span className="text-[10px] text-[#0F766E] font-bold">100% goes to driver</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 50, 100, 200].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTipAmount(amt)}
                  className={cn(
                    'py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border',
                    tipAmount === amt
                      ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
                      : 'bg-card text-muted-foreground border-border hover:bg-muted',
                  )}
                >
                  {amt === 0 ? 'No Tip' : `+₹${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              Select Cashless Payment Method
            </h2>
            <div className="space-y-2">
              {paymentMethods.map((m) => {
                const Icon = m.icon
                const isSelected = selectedMethod === m.id
                return (
                  <WarmCard
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    className={cn(
                      'flex items-center justify-between p-3.5 cursor-pointer border min-w-0',
                      isSelected ? 'border-[#0F766E] bg-[#0F766E]/10' : 'border-border hover:bg-muted/40'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                      <div className={cn('grid size-10 place-items-center rounded-xl font-bold shrink-0', isSelected ? 'bg-[#0F766E] text-white' : 'bg-muted text-muted-foreground')}>
                        <Icon className="size-5" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground truncate">{m.name}</p>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">{m.sub}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="size-5 text-[#0F766E] shrink-0" />}
                  </WarmCard>
                )
              })}
            </div>
          </div>

          <WarmButton variant="primary" size="lg" className="w-full shadow-lg" onClick={handleStartPayment}>
            <Lock className="size-4" /> Confirm & Pay ₹{totalFee}.00
          </WarmButton>
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col justify-between items-center text-center space-y-6 max-w-xl mx-auto w-full">
          <div className="space-y-4 pt-4">
            <div className="grid size-20 place-items-center rounded-full bg-[#0F766E]/10 text-[#0F766E] mx-auto border border-[#0F766E]/30 shadow-lg">
              <Check className="size-10 text-[#0F766E]" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">Payment Successful</h1>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Transaction Ref #TN-PAY-98402</p>
            </div>
          </div>

          {/* Rate Technician Widget */}
          <WarmCard className="w-full p-4 space-y-2">
            <p className="text-xs font-black text-foreground">Rate Technician Service</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star className={cn('size-6', star <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-muted-foreground')} />
                </button>
              ))}
            </div>
          </WarmCard>

          {/* Digital Receipt Card */}
          <WarmCard className="w-full p-5 space-y-4 text-left border border-border shadow-xl min-w-0">
            <div className="flex items-center justify-between gap-2 border-b border-border pb-3 min-w-0">
              <div className="flex items-center gap-2 text-xs font-black text-foreground min-w-0">
                <FileText className="size-4 text-[#0F766E] shrink-0" />
                <span className="truncate">LifeOS Official Receipt</span>
              </div>
              <WarmBadge variant="emerald" className="shrink-0">Paid In Full</WarmBadge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center gap-2 min-w-0">
                <span className="text-muted-foreground font-semibold shrink-0">Service Provided</span>
                <span className="font-bold text-foreground truncate text-right">{title}</span>
              </div>
              <div className="flex justify-between items-center gap-2 min-w-0">
                <span className="text-muted-foreground font-semibold shrink-0">Responded By</span>
                <span className="font-bold text-foreground truncate text-right">{mechanic.name} ({mechanic.rating} ★)</span>
              </div>
              <div className="flex justify-between items-center gap-2 min-w-0">
                <span className="text-muted-foreground font-semibold shrink-0">Location</span>
                <span className="font-bold text-foreground truncate text-right">{mechanic.location}</span>
              </div>
              <div className="flex justify-between items-center gap-2 min-w-0">
                <span className="text-muted-foreground font-semibold shrink-0">Payment Mode</span>
                <span className="font-bold text-foreground truncate text-right">{paymentMethods.find((m) => m.id === selectedMethod)?.name}</span>
              </div>
              <div className="flex justify-between items-center gap-2 pt-2 border-t border-border font-black min-w-0">
                <span className="text-foreground shrink-0">Total Paid</span>
                <span className="text-[#0F766E] font-mono text-sm shrink-0">₹{totalFee}.00</span>
              </div>
            </div>
          </WarmCard>

          <WarmButton variant="primary" size="lg" className="w-full shadow-lg" onClick={onDone}>
            <ShieldCheck className="size-4 text-emerald-300" /> Return to Command Center
          </WarmButton>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 min-w-0">
      <span className={cn('min-w-0 flex-1 truncate', bold ? 'text-xs font-black text-foreground' : 'text-xs text-muted-foreground font-semibold')}>{label}</span>
      <span className={cn('shrink-0', bold ? 'text-base font-black font-mono text-foreground' : 'text-xs font-bold font-mono', highlight ? 'text-[#F97316]' : 'text-foreground')}>{value}</span>
    </div>
  )
}
