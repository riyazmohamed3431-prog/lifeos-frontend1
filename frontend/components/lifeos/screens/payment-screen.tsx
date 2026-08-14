'use client'

import { useState } from 'react'
import { mechanic, type Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import {
  Check,
  CreditCard,
  ShieldCheck,
  FileText,
  Loader2,
  Lock,
  Smartphone,
  Building2,
  Star,
  Heart,
  Wrench,
  CheckCircle2,
  Phone,
  Wallet,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CallModal } from '@/components/lifeos/call-modal'

const paymentMethods = [
  { id: 'upi', name: 'UPI', sub: 'GPay / PhonePe / Paytm', badge: 'Recommended', icon: Smartphone },
  { id: 'card', name: 'Credit / Debit Card', sub: '•••• 4218 (HDFC Visa)', icon: CreditCard },
  { id: 'netbanking', name: 'Net Banking', sub: 'HDFC / ICICI / SBI / Axis', icon: Building2 },
  { id: 'wallet', name: 'Other Wallets', sub: 'Amazon Pay / MobiKwik / Freecharge', icon: Wallet },
]

export function PaymentScreen({
  emergency,
  emergencies,
  vehicleName,
  onDone,
  onBack,
}: {
  emergency?: Emergency | null
  emergencies?: Emergency[] | null
  vehicleName?: string
  onDone: () => void
  onBack?: () => void
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [tipAmount, setTipAmount] = useState<number>(50)
  const [customTip, setCustomTip] = useState<string>('')
  const [isCustom, setIsCustom] = useState(false)

  const [rating, setRating] = useState(5)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStep, setProcessStep] = useState(0)
  const [paid, setPaid] = useState(false)
  const [calling, setCalling] = useState(false)

  const issueList = emergencies && emergencies.length > 0
    ? emergencies
    : emergency
    ? [emergency]
    : []

  const baseFee = issueList.length > 0
    ? issueList.reduce((acc, item) => acc + item.fee, 0)
    : (emergency?.fee ?? 750)

  const activeTip = isCustom ? (parseInt(customTip) || 0) : tipAmount
  const totalFee = baseFee + activeTip

  const issueTitle = issueList.length > 0
    ? issueList.map((item) => item.label).join(' + ')
    : (emergency?.label ?? 'Flat Tyre Service')

  const processingSteps = [
    'Encrypting 256-Bit SSL Credentials…',
    'Connecting to Payment Gateway…',
    'Authorizing Transaction with Bank…',
    'Payment Verified Successfully!',
  ]

  const handlePresetTip = (amt: number) => {
    setIsCustom(false)
    setCustomTip('')
    setTipAmount(amt)
  }

  const handleCustomTipChange = (val: string) => {
    setIsCustom(true)
    setCustomTip(val)
  }

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
    }, 850)
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar px-4 sm:px-8 pt-6 pb-36 font-sans text-foreground select-none w-full">
      <AmbientBg tone="calm" />

      {/* 1. PAYMENT PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm p-6 text-center space-y-5 bg-white dark:bg-[#131316] rounded-3xl border border-neutral-200 dark:border-white/10 shadow-2xl">
            <div className="relative mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800/40 shadow-xl">
              <Loader2 className="size-10 animate-spin text-orange-500" />
              <Lock className="absolute size-4 text-emerald-600 bottom-1 right-1" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-neutral-900 dark:text-white">Processing Cashless Payment</h3>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-mono font-black">
                ₹{totalFee}.00 · {paymentMethods.find((m) => m.id === selectedMethod)?.name}
              </p>
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
                      'rounded-2xl p-3 flex items-center gap-3 text-xs transition-all border',
                      isDone
                        ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-200'
                        : isCurrent
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 dark:border-indigo-500/50 dark:bg-indigo-950/40 dark:text-indigo-200'
                        : 'border-neutral-200 dark:border-white/5 opacity-40 text-neutral-400'
                    )}
                  >
                    {isDone ? (
                      <Check className="size-4 text-emerald-600 shrink-0 stroke-[3]" />
                    ) : isCurrent ? (
                      <Loader2 className="size-4 animate-spin text-orange-500 shrink-0" />
                    ) : (
                      <span className="size-4 rounded-full border border-neutral-300 dark:border-white/20 shrink-0" />
                    )}
                    <span className={isDone || isCurrent ? 'font-extrabold' : 'font-medium'}>
                      {stepText}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-bold pt-1">
              <ShieldCheck className="size-3.5 text-emerald-600" /> 256-Bit Bank Level Security
            </div>
          </div>
        </div>
      )}

      {!paid ? (
        <div className="relative z-10 space-y-6 w-full max-w-none">
          {/* HEADER BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-neutral-200/80 dark:border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  On-Site Repair Complete
                </span>
                <span className="text-xs text-neutral-400 font-medium hidden sm:inline">• ACTIVE PORTAL: PAYMENT</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                Settlement & Review
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Repair verified by <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{mechanic.name}</span>. Please review your charges and confirm payment.
              </p>
            </div>

            {/* SECURITY BADGE */}
            <div className="bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xs shrink-0 self-start sm:self-auto">
              <ShieldCheck className="size-5 text-emerald-600" />
              <div>
                <span className="text-xs font-black text-neutral-900 dark:text-white block">
                  100% Cashless
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">
                  Verified Settlement Portal
                </span>
              </div>
            </div>
          </div>

          {/* 2. TOP INFORMATION CARDS GRID (TECHNICIAN & REPAIR SUMMARY) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* CARD 1 — TECHNICIAN */}
            <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-4 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="size-14 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 dark:border-white/10 shrink-0 shadow-2xs">
                  <img src="/mechanic.png" alt={mechanic.name} className="h-full w-full object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                      {mechanic.name}
                    </h3>
                    <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                    {mechanic.specialty}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5 truncate">
                    ★ {mechanic.rating} Rating · Verified Technician
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2 — REPAIR SUMMARY */}
            <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-4 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Wrench className="size-4 text-emerald-600" />
                  <h3 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                    Repair Summary
                  </h3>
                </div>
                <div className="space-y-0.5 text-[11px] font-bold text-emerald-600">
                  <div className="flex items-center gap-1">
                    <Check className="size-3 stroke-[3]" /> Issue Resolved
                  </div>
                  <div className="flex items-center gap-1 text-neutral-500 font-medium">
                    <span>Repair Time: ~18 mins</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400 font-mono text-[10px]">
                    <span>Completed At: Just now</span>
                  </div>
                </div>
              </div>

              <div className="size-14 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 dark:border-white/10 shrink-0 p-1 flex items-center justify-center">
                <img
                  src="/images/squad/standard-rescue-suv.jpg"
                  alt="Repair Vehicle"
                  className="max-h-full max-w-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* MAIN 2-COLUMN SETTLEMENT CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            {/* LEFT COLUMN: PAYMENT BREAKDOWN + WHAT YOU PAID FOR (7 COLS ON LG) */}
            <div className="lg:col-span-7 space-y-6 w-full">
              
              {/* 3. PAYMENT BREAKDOWN CARD */}
              <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-black text-sm">
                      <CreditCard className="size-4.5" />
                    </div>
                    <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                      Payment Breakdown
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
                    Transparent Itemization
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300 font-medium">
                    <span>Emergency Priority Dispatch Base</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">₹0.00</span>
                  </div>

                  {issueList.length > 0 ? (
                    issueList.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-neutral-600 dark:text-neutral-300 font-medium">
                        <span>{item.label} Service</span>
                        <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">₹{item.fee}.00</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300 font-medium">
                      <span>{issueTitle}</span>
                      <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">₹{baseFee}.00</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300 font-medium">
                    <span>GST (18% Included)</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">₹0.00</span>
                  </div>

                  <div className="pt-3 border-t-2 border-neutral-200 dark:border-white/10 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                      TOTAL AMOUNT (CASHLESS)
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-indigo-600">
                      ₹{totalFee}.00
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SELECT CASHLESS PAYMENT METHOD (5 COLS ON LG) */}
            <div className="lg:col-span-5 space-y-6 w-full">

              {/* 7. SELECT CASHLESS PAYMENT METHOD */}
              <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                  <h3 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                    Select Cashless Payment Method
                  </h3>
                  <span className="text-[10px] font-bold text-neutral-400">4 Options</span>
                </div>

                <div className="space-y-2.5">
                  {paymentMethods.map((m) => {
                    const Icon = m.icon
                    const isSelected = selectedMethod === m.id
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={cn(
                          'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                          isSelected
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                            : 'bg-neutral-50/70 dark:bg-white/5 border-neutral-200/80 dark:border-white/5 hover:border-neutral-300'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                            )}
                          >
                            <Icon className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-extrabold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                                {m.name}
                              </h4>
                              {m.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-600 text-white uppercase">
                                  {m.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">
                              {m.sub}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="size-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* 9. BOTTOM ACTION AREA */}
          <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            {/* Left: Back */}
            <button
              onClick={() => {
                if (onBack) onBack()
                else onDone()
              }}
              className="py-3 px-5 rounded-2xl bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="size-4" /> Back
            </button>

            {/* Middle: Contact Support */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div>
                <span className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] block">Need Help?</span>
                <span className="text-[10px] text-neutral-400">Support team available 24/7</span>
              </div>
              <button
                onClick={() => setCalling(true)}
                className="py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                Contact Support
              </button>
            </div>

            {/* Right: Confirm & Pay CTA */}
            <button
              onClick={handleStartPayment}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm font-extrabold shadow-xl shadow-indigo-500/25 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-[0.99] w-full sm:w-auto"
            >
              <div className="flex items-center gap-2">
                <Lock className="size-4" />
                <span>Confirm & Pay ₹{totalFee}.00</span>
              </div>
              <span className="text-[10px] font-normal text-indigo-100 opacity-90 mt-0.5">
                Secure · Fast · Cashless
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* PAID SUCCESS RECEIPT SCREEN */
        <div className="relative z-10 flex h-full flex-col justify-between items-center text-center space-y-6 w-full max-w-xl mx-auto pt-4">
          <div className="space-y-4">
            <div className="grid size-20 place-items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 mx-auto border border-emerald-200 dark:border-emerald-800/40 shadow-xl">
              <Check className="size-10 text-emerald-600" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                Payment Successful
              </h1>
              <p className="text-xs text-neutral-400 font-mono mt-1">Transaction Ref #TN-PAY-98402</p>
            </div>
          </div>

          {/* Rate Technician Widget */}
          <div className="w-full bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 space-y-3 shadow-sm">
            <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
              Rate Technician Service ({mechanic.name})
            </p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star className={cn('size-7', star <= rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300 dark:text-neutral-700')} />
                </button>
              ))}
            </div>
          </div>

          {/* Digital Receipt Card */}
          <div className="w-full bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-6 space-y-4 text-left shadow-xl">
            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
                <FileText className="size-4.5 text-emerald-600 shrink-0" />
                <span>LifeOS Official Receipt</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                Paid In Full
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center gap-2">
                <span className="text-neutral-500 font-semibold">Service Provided</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{issueTitle}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-neutral-500 font-semibold">Responded By</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{mechanic.name} ({mechanic.rating} ★)</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-neutral-500 font-semibold">Payment Mode</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2 pt-3 border-t border-neutral-100 dark:border-white/5 font-black text-sm">
                <span className="text-[#0F172A] dark:text-[#F8FAFC]">Total Cashless Paid</span>
                <span className="text-indigo-600 font-mono text-lg">₹{totalFee}.00</span>
              </div>
            </div>
          </div>

          <button
            onClick={onDone}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-extrabold shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="size-5 text-emerald-300" />
            <span>Return to Command Center</span>
          </button>
        </div>
      )}

      {/* CALL MODAL */}
      <CallModal
        isOpen={calling}
        onClose={() => setCalling(false)}
        mechanicName={mechanic.name}
        mechanicPhone={mechanic.phone}
      />
    </div>
  )
}
