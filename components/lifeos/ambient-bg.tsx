'use client'

export function AmbientBg({ tone = 'primary' }: { tone?: 'primary' | 'emergency' | 'calm' }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Calm, quiet layered background ambient highlights */}
      <div
        className={`absolute -top-32 -left-20 h-96 w-96 rounded-full blur-[100px] opacity-20 transition-all duration-700 ${
          tone === 'emergency'
            ? 'bg-destructive/30'
            : tone === 'calm'
              ? 'bg-accent/20'
              : 'bg-primary/25'
        }`}
      />
      <div
        className={`absolute top-1/2 -right-32 h-80 w-80 rounded-full blur-[90px] opacity-15 transition-all duration-700 ${
          tone === 'emergency' ? 'bg-amber-600/20' : 'bg-primary/20'
        }`}
      />
      
      {/* Ultra subtle fine structural noise/grid layer */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, oklch(1 0 0 / 15%) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  )
}
