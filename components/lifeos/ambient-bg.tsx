export function AmbientBg({ tone = 'primary' }: { tone?: 'primary' | 'emergency' | 'calm' }) {
  const blobs =
    tone === 'emergency'
      ? ['bg-destructive/25', 'bg-primary/15', 'bg-destructive/10']
      : tone === 'calm'
        ? ['bg-accent/20', 'bg-primary/15', 'bg-primary/10']
        : ['bg-primary/25', 'bg-accent/15', 'bg-primary/10']

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute -top-24 -left-16 h-72 w-72 rounded-full blur-3xl animate-drift ${blobs[0]}`} />
      <div
        className={`absolute top-1/3 -right-20 h-64 w-64 rounded-full blur-3xl animate-drift ${blobs[1]}`}
        style={{ animationDelay: '-6s' }}
      />
      <div
        className={`absolute -bottom-24 left-1/4 h-72 w-72 rounded-full blur-3xl animate-drift ${blobs[2]}`}
        style={{ animationDelay: '-12s' }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(oklch(1 0 0 / 40%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 40%) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(90% 70% at 50% 30%, black, transparent)',
        }}
      />
    </div>
  )
}
