'use client'

export function AmbientBg({ tone = 'primary' }: { tone?: 'primary' | 'emergency' | 'calm' }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none">
      {/* Warm Soft Ambient Organic Shapes */}
      <div
        className={`absolute -top-40 left-1/4 h-[650px] w-[650px] rounded-full blur-[140px] opacity-20 dark:opacity-30 transition-all duration-1000 ${
          tone === 'emergency'
            ? 'bg-gradient-to-tr from-[#E11D48] via-[#F97316] to-[#FBBF24]'
            : tone === 'calm'
            ? 'bg-gradient-to-tr from-[#0F766E] via-[#14B8A6] to-[#FBBF24]'
            : 'bg-gradient-to-tr from-[#0F766E] via-[#F97316] to-[#4338CA]'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 h-[550px] w-[550px] rounded-full blur-[150px] opacity-15 dark:opacity-25 transition-all duration-1000 ${
          tone === 'emergency'
            ? 'bg-gradient-to-br from-[#F97316] to-[#E11D48]'
            : 'bg-gradient-to-br from-[#FBBF24] via-[#F97316] to-[#0F766E]'
        }`}
      />
      <div
        className={`absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full blur-[160px] opacity-15 dark:opacity-20 transition-all duration-1000 ${
          tone === 'emergency'
            ? 'bg-gradient-to-t from-[#E11D48] to-[#F97316]'
            : 'bg-gradient-to-t from-[#4338CA] via-[#0F766E] to-[#FBBF24]'
        }`}
      />
    </div>
  )
}
