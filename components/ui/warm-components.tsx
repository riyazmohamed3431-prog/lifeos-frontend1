'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * BentoGrid Component
 * Executive Bento Layout System for multi-column dashboard sections
 */
export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-12 gap-4.5', className)}>
      {children}
    </div>
  )
}

/**
 * BentoCard Component
 * Flexible Bento tile with responsive column spans and section theme variants
 */
export function BentoCard({
  children,
  colSpan = 12,
  variant = 'white',
  hover = true,
  onClick,
  className,
}: {
  children: React.ReactNode
  colSpan?: 3 | 4 | 6 | 8 | 9 | 12
  variant?: 'white' | 'slate' | 'emerald' | 'indigo' | 'amber' | 'coral' | 'rose' | 'purple' | 'blue' | 'orange' | 'red'
  hover?: boolean
  onClick?: () => void
  className?: string
}) {
  const colSpanClasses = {
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    6: 'md:col-span-6',
    8: 'md:col-span-8',
    9: 'md:col-span-9',
    12: 'md:col-span-12',
  }

  const cardVariants = {
    white: 'bg-card border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-[#0F172A] dark:text-[#F8FAFC]',
    slate: 'bg-[#F1F5F9] dark:bg-[#27272A] border-[#E2E8F0] dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] shadow-sm',
    emerald: 'bg-gradient-to-br from-[#0F766E] via-[#0D655E] to-[#115E59] text-white border-[#0F766E]/30 shadow-lg shadow-[#0F766E]/20',
    indigo: 'bg-gradient-to-br from-[#4338CA]/10 via-[#4338CA]/5 to-transparent border-[#4338CA]/25 text-[#0F172A] dark:text-[#F8FAFC] shadow-sm',
    amber: 'bg-gradient-to-br from-[#F59E0B]/12 via-[#F59E0B]/5 to-transparent border-[#F59E0B]/30 text-[#0F172A] dark:text-[#F8FAFC] shadow-sm',
    coral: 'bg-gradient-to-br from-[#F97316]/12 via-[#F97316]/5 to-transparent border-[#F97316]/30 text-[#0F172A] dark:text-[#F8FAFC] shadow-sm',
    rose: 'bg-gradient-to-br from-[#E11D48]/10 via-[#E11D48]/5 to-transparent border-[#E11D48]/25 text-[#0F172A] dark:text-[#F8FAFC] shadow-sm',
    purple: 'bg-gradient-to-br from-[#8B5CF6]/12 via-[#8B5CF6]/5 to-transparent border-[#8B5CF6]/30 text-[#0F172A] dark:text-[#F8FAFC] shadow-sm',
    blue: 'bg-gradient-to-br from-[#2563EB]/10 via-[#2563EB]/5 to-transparent border-[#2563EB]/25 text-[#0F172A] dark:text-[#F8FAFC] shadow-sm',
    orange: 'bg-gradient-to-br from-[#F97316]/10 via-[#F97316]/5 to-transparent border-[#F97316]/25 text-[#0F172A] dark:text-[#F8FAFC] shadow-sm',
    red: 'bg-gradient-to-br from-[#EF4444]/10 via-[#EF4444]/5 to-transparent border-[#EF4444]/25 text-[#0F172A] dark:text-[#F8FAFC] shadow-sm',
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'relative rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between overflow-hidden',
        colSpanClasses[colSpan],
        cardVariants[variant],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

/**
 * WarmButton Component
 */
export interface WarmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'emerald' | 'indigo' | 'coral' | 'amber' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function WarmButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: WarmButtonProps) {
  const variantStyles = {
    primary: 'bg-[#0F766E] text-white hover:bg-[#0D655E] shadow-md shadow-[#0F766E]/20',
    secondary: 'bg-[#4338CA] text-white hover:bg-[#3730A3] shadow-md shadow-[#4338CA]/20',
    accent: 'bg-[#F59E0B] text-[#0F172A] font-bold hover:bg-[#D97706] shadow-md shadow-[#F59E0B]/20',
    danger: 'bg-[#E11D48] text-white hover:bg-[#BE123C] shadow-md shadow-[#E11D48]/25',
    emerald: 'bg-gradient-to-r from-[#0F766E] to-[#14B8A6] text-white hover:opacity-95 shadow-md shadow-[#0F766E]/25',
    indigo: 'bg-gradient-to-r from-[#4338CA] to-[#6366F1] text-white hover:opacity-95 shadow-md shadow-[#4338CA]/25',
    coral: 'bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white hover:opacity-95 shadow-md shadow-[#F97316]/25',
    amber: 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#0F172A] font-bold hover:opacity-95 shadow-md shadow-[#F59E0B]/25',
    gold: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold hover:opacity-95 shadow-md shadow-[#F59E0B]/25',
    ghost: 'bg-transparent text-foreground hover:bg-muted/80 border border-border',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl font-semibold',
    md: 'px-4 py-2 text-xs font-bold rounded-2xl',
    lg: 'px-6 py-3 text-sm font-extrabold rounded-2xl tracking-wide',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40 disabled:opacity-50 disabled:pointer-events-none select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}

/**
 * WarmCard Component
 */
export function WarmCard({
  children,
  className,
  variant = 'white',
  hover = true,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  variant?: 'white' | 'slate' | 'emerald' | 'indigo' | 'amber' | 'coral' | 'rose' | 'purple' | 'blue' | 'orange' | 'red'
  hover?: boolean
  onClick?: () => void
}) {
  return (
    <BentoCard colSpan={12} variant={variant} hover={hover} onClick={onClick} className={className}>
      {children}
    </BentoCard>
  )
}

/**
 * WarmBadge Component
 */
export function WarmBadge({
  children,
  variant = 'emerald',
  className,
}: {
  children: React.ReactNode
  variant?: 'emerald' | 'indigo' | 'amber' | 'coral' | 'green' | 'rose' | 'purple' | 'slate' | 'blue' | 'orange' | 'red'
  className?: string
}) {
  const badgeStyles = {
    emerald: 'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/20 dark:bg-[#0F766E]/20 dark:text-[#2DD4BF]',
    indigo: 'bg-[#4338CA]/10 text-[#4338CA] border-[#4338CA]/20 dark:bg-[#4338CA]/20 dark:text-[#818CF8]',
    amber: 'bg-[#F59E0B]/15 text-[#D97706] border-[#F59E0B]/30 dark:bg-[#F59E0B]/20 dark:text-[#FBBF24]',
    coral: 'bg-[#F97316]/10 text-[#EA580C] border-[#F97316]/20 dark:bg-[#F97316]/20 dark:text-[#FB923C]',
    green: 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20 dark:bg-[#16A34A]/20 dark:text-[#4ADE80]',
    rose: 'bg-[#E11D48]/10 text-[#E11D48] border-[#E11D48]/20 dark:bg-[#E11D48]/20 dark:text-[#FB7185]',
    purple: 'bg-[#8B5CF6]/12 text-[#7C3AED] border-[#8B5CF6]/25 dark:bg-[#8B5CF6]/20 dark:text-[#C4B5FD]',
    slate: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0] dark:bg-[#27272A] dark:text-[#94A3B8]',
    blue: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20 dark:bg-[#2563EB]/20 dark:text-[#60A5FA]',
    orange: 'bg-[#F97316]/10 text-[#EA580C] border-[#F97316]/20 dark:bg-[#F97316]/20 dark:text-[#FB923C]',
    red: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 dark:bg-[#EF4444]/20 dark:text-[#F87171]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-tight select-none',
        badgeStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

/**
 * CategoryIconBox Component
 */
export function CategoryIconBox({
  icon: Icon,
  color = 'emerald',
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  color?: 'indigo' | 'amber' | 'emerald' | 'coral' | 'rose' | 'purple' | 'blue' | 'orange' | 'red'
  className?: string
}) {
  const colorStyles = {
    indigo: 'bg-[#4338CA]/10 text-[#4338CA] border-[#4338CA]/20',
    amber: 'bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20',
    emerald: 'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/20',
    coral: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
    rose: 'bg-[#E11D48]/10 text-[#E11D48] border-[#E11D48]/20',
    purple: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
    blue: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20',
    orange: 'bg-[#F97316]/10 text-[#EA580C] border-[#F97316]/20',
    red: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  }

  return (
    <div className={cn('grid size-11 place-items-center rounded-2xl border shadow-sm shrink-0', colorStyles[color], className)}>
      <Icon className="size-5" />
    </div>
  )
}

/**
 * WarmProgress Component
 */
export function WarmProgress({
  value,
  max = 100,
  variant = 'emerald',
  className,
}: {
  value: number
  max?: number
  variant?: 'emerald' | 'indigo' | 'amber' | 'coral' | 'rose' | 'purple'
  className?: string
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const fillGradients = {
    emerald: 'bg-gradient-to-r from-[#0F766E] to-[#14B8A6]',
    indigo: 'bg-gradient-to-r from-[#4338CA] to-[#6366F1]',
    amber: 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]',
    coral: 'bg-gradient-to-r from-[#F97316] to-[#FB923C]',
    rose: 'bg-gradient-to-r from-[#E11D48] to-[#FB7185]',
    purple: 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]',
  }

  return (
    <div className={cn('w-full bg-[#E2E8F0] dark:bg-[#27272A] rounded-full h-2 overflow-hidden p-0.5 border border-border/40', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn('h-full rounded-full', fillGradients[variant])}
      />
    </div>
  )
}

/**
 * WarmTabGroup Component
 */
export function WarmTabGroup<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: {
  tabs: { id: T; label: string; icon?: React.ComponentType<{ className?: string }> }[]
  activeTab: T
  onChange: (id: T) => void
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1 bg-[#F1F5F9] dark:bg-[#27272A] p-1.5 rounded-2xl border border-[#E2E8F0] dark:border-white/10 min-w-0 overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-colors cursor-pointer select-none',
              isActive ? 'text-[#0F172A] dark:text-[#F8FAFC]' : 'text-[#475569] dark:text-[#94A3B8] hover:text-foreground'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeBentoTab"
                className="absolute inset-0 bg-white dark:bg-[#18181B] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-white/10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5 min-w-0 truncate">
              {Icon && <Icon className={cn('size-3.5 sm:size-4 shrink-0', isActive ? 'text-[#0F766E]' : 'text-muted-foreground')} />}
              <span className="truncate">{tab.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * HealthRadialGauge Component
 */
export function HealthRadialGauge({
  score = 98,
  size = 120,
  strokeWidth = 10,
  label = 'Vehicle Health',
}: {
  score?: number
  size?: number
  strokeWidth?: number
  label?: string
}) {
  const [displayScore, setDisplayScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  useEffect(() => {
    let current = 0
    const step = Math.ceil(score / 30)
    const timer = setInterval(() => {
      current += step
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(current)
      }
    }, 25)
    return () => clearInterval(timer)
  }, [score])

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="size-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-[#E2E8F0] dark:stroke-[#27272A]"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#emeraldGaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
          <defs>
            <linearGradient id="emeraldGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F766E" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">{displayScore}%</span>
          <span className="text-[10px] font-extrabold text-[#0F766E] uppercase tracking-wider">Optimal</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-bold text-[#475569] dark:text-[#94A3B8]">{label}</p>
    </div>
  )
}
