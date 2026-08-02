'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Award,
  Navigation,
  Star,
  Users,
  Lock,
  History,
  AlertTriangle,
  ChevronDown,
  Car,
  Gauge,
  Battery,
  Radio,
} from 'lucide-react'

export function LandingScreen({
  onGetStarted,
  onLoginClick,
}: {
  onGetStarted: () => void
  onLoginClick: () => void
}) {
  const [activeTab, setActiveTab] = useState<'all' | 'speed' | 'trust'>('all')

  const features = [
    {
      icon: Zap,
      title: 'Instant Roadside Assistance',
      desc: 'One-tap dispatch for battery jump starts, flat tyres, fuel delivery, towing, and engine emergencies.',
      badge: 'Sub-10m Dispatch',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Mechanics',
      desc: 'Every technician in our squad is background-checked, certified, and rated 4.8+ stars by local drivers.',
      badge: '100% Certified',
    },
    {
      icon: Navigation,
      title: 'Live Tracking',
      desc: 'Watch your rescue rig en route in real-time with sub-second GPS telemetry and accurate live ETA.',
      badge: 'Real-time Radar',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      desc: 'Upfront transparent pricing with instant digital receipts. Zero hidden surge fees during emergencies.',
      badge: 'Transparent Fees',
    },
    {
      icon: History,
      title: 'Service History',
      desc: 'Complete digital logs of all past vehicle rescues, digital diagnostics, and technician notes.',
      badge: 'Cloud Recorded',
    },
    {
      icon: PhoneCall,
      title: 'Emergency Contacts',
      desc: 'Automated SOS broadcasts sending your precise GPS coordinates to trusted emergency contacts and highway patrol.',
      badge: 'Instant SOS',
    },
  ]

  const trustMetrics = [
    { value: '< 10 mins', label: 'Average Arrival Time', icon: Clock },
    { value: '3,000+', label: 'Verified Technicians', icon: Users },
    { value: '24 / 7', label: 'Highway & City Coverage', icon: Radio },
    { value: '99.8%', label: 'Successful Rescues', icon: Award },
  ]

  const steps = [
    {
      num: '01',
      title: 'Tap to Request',
      desc: 'Select your vehicle issue or hit one-tap Emergency SOS with auto-detected GPS.',
    },
    {
      num: '02',
      title: 'Instant Dispatch',
      desc: 'Our autonomous radar matches the nearest certified master technician.',
    },
    {
      num: '03',
      title: 'Live GPS Radar',
      desc: 'Track your mechanic approaching in real-time on your live interactive map.',
    },
    {
      num: '04',
      title: 'Back on the Road',
      desc: 'On-site resolution with transparent cashless payment and digital log.',
    },
  ]

  return (
    <div className="relative min-h-screen w-full bg-[oklch(0.13_0.005_260)] text-foreground font-sans overflow-x-hidden">
      {/* Background Depth & Subtle Radial Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-primary/10 blur-[130px] animate-pulse" />
        <div className="absolute top-[35%] -left-32 size-[450px] rounded-full bg-accent/8 blur-[110px]" />
        <div className="absolute top-[65%] -right-32 size-[500px] rounded-full bg-primary/8 blur-[120px]" />
        {/* Architectural Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Navbar with Entrance Animation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[oklch(0.14_0.005_260)]/85 backdrop-blur-xl transition-all animate-nav-entrance">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/20 text-primary border border-primary/30 shadow-md transition-transform group-hover:scale-105">
              <ShieldCheck className="size-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-foreground">
                  Life<span className="text-primary">OS</span>
                </span>
                <span className="hidden sm:inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent border border-accent/20 uppercase tracking-wider">
                  24/7 Companion
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">Emergency Roadside Network</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#illustration" className="hover:text-foreground transition-colors">Radar Platform</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#trust" className="hover:text-foreground transition-colors">Trust & Safety</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="text-xs font-bold text-muted-foreground hover:text-foreground px-3.5 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <section className="pt-14 pb-20 md:pt-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Column (Staggered Entrance Animation) */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
              
              {/* Top Badge */}
              <div className="animate-hero-badge inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 border border-white/10 text-xs font-semibold text-accent shadow-sm">
                <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>24/7 Autonomous Roadside Rescue Squad</span>
                <Sparkles className="size-3.5 text-accent" />
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="animate-hero-title text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                  Roadside Help.{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                    Anytime.
                  </span>
                  <span className="block">Anywhere.</span>
                </h1>
                <p className="animate-hero-desc text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                  LifeOS instantly connects stranded drivers with trusted nearby mechanics, helping them get back on the road quickly and safely.
                </p>
              </div>

              {/* CTAs */}
              <div className="animate-hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-4" />
                </button>

                <a
                  href="#features"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl surface-card px-7 py-4 text-sm font-semibold text-foreground hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                >
                  <span>Learn More</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </a>
              </div>

              {/* Key Highlights */}
              <div className="animate-hero-highlights pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                <div className="hover:translate-y-[-2px] transition-transform">
                  <p className="text-xl font-bold text-foreground">8 Mins</p>
                  <p className="text-xs text-muted-foreground">Fastest Dispatch</p>
                </div>
                <div className="hover:translate-y-[-2px] transition-transform">
                  <p className="text-xl font-bold text-foreground">4.98 ★</p>
                  <p className="text-xs text-muted-foreground">Squad Rating</p>
                </div>
                <div className="hover:translate-y-[-2px] transition-transform">
                  <p className="text-xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground">Verified Techs</p>
                </div>
              </div>
            </div>

            {/* Hero Right Column: 3D Layered Vector Illustration (Scale & Fade Entrance) */}
            <div id="illustration" className="lg:col-span-6 relative animate-hero-visual">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Ambient Glow behind Illustration */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 via-accent/15 to-emerald-500/10 blur-2xl opacity-80 animate-pulse" />

                {/* Main Illustration Surface Container */}
                <div className="surface-card relative rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-2xl">
                  {/* Top Header Card Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Live Dispatch Radar
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-[11px] font-bold text-emerald-400">
                      GPS Signal Active
                    </span>
                  </div>

                  {/* 3D Road & Vehicle Connection Canvas */}
                  <div className="relative h-72 w-full rounded-2xl bg-[oklch(0.11_0.005_260)] border border-white/10 overflow-hidden flex items-center justify-center p-4">
                    {/* Stylized Curved Highway Road Line */}
                    <svg className="absolute inset-0 size-full" viewBox="0 0 400 240" fill="none">
                      <path
                        d="M -20 220 C 100 180, 180 120, 220 80 C 260 40, 340 30, 420 20"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="24"
                        strokeLinecap="round"
                      />
                      <path
                        d="M -20 220 C 100 180, 180 120, 220 80 C 260 40, 340 30, 420 20"
                        stroke="rgba(56,189,248,0.4)"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                      />
                      {/* Connection Signal Wave Rings */}
                      <circle cx="220" cy="80" r="45" stroke="rgba(56,189,248,0.25)" strokeWidth="1.5" className="animate-ping" />
                      <circle cx="220" cy="80" r="28" stroke="rgba(29,78,216,0.5)" strokeWidth="2" />
                    </svg>

                    {/* Modern Vehicle Graphic Container */}
                    <div className="absolute left-[28%] bottom-[25%] group cursor-pointer animate-float-card">
                      <div className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-white shadow-xl shadow-primary/40 border border-white/20 transition-transform group-hover:scale-110">
                        <Car className="size-7 text-white" />
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/10">
                        Tesla Model 3
                      </div>
                    </div>

                    {/* Nearby Mechanic Marker Pin */}
                    <div className="absolute right-[22%] top-[20%] group cursor-pointer animate-float-card" style={{ animationDelay: '1.5s' }}>
                      <div className="relative grid size-12 place-items-center rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 border border-white/20 transition-transform group-hover:scale-110">
                        <MapPin className="size-6 text-white" />
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-950/90 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        Karthik (~8m ETA)
                      </div>
                    </div>
                  </div>

                  {/* Minimal Floating UI Telemetry Cards */}
                  <div className="grid grid-cols-2 gap-3 pt-6">
                    {/* Floating Card 1 */}
                    <div className="surface-glass rounded-2xl p-3.5 border border-white/10 flex items-center gap-3 hover:border-primary/40 transition-colors">
                      <div className="grid size-9 place-items-center rounded-xl bg-primary/20 text-primary shrink-0">
                        <Gauge className="size-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Nearby Squad</p>
                        <p className="text-xs font-bold text-foreground">Karthik S. · 2.1 km</p>
                      </div>
                    </div>

                    {/* Floating Card 2 */}
                    <div className="surface-glass rounded-2xl p-3.5 border border-white/10 flex items-center gap-3 hover:border-accent/40 transition-colors">
                      <div className="grid size-9 place-items-center rounded-xl bg-accent/20 text-accent shrink-0">
                        <Battery className="size-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Diagnostic</p>
                        <p className="text-xs font-bold text-emerald-400">Battery Jump Needed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="rounded-full bg-primary/15 border border-primary/30 px-3.5 py-1 text-xs font-bold text-accent tracking-wider uppercase">
              Engineered for Peace of Mind
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Everything you need during a roadside emergency.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Built with precision telemetry, certified mechanics, and instant response routing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="surface-card group relative rounded-3xl p-6 border border-white/10 hover:border-primary/40 hover:bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-accent border border-white/10">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* TRUST SECTION */}
        <section id="trust" className="py-16 border-t border-white/10">
          <div className="surface-card relative rounded-3xl p-8 sm:p-12 border border-white/10 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 size-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-5 space-y-4">
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                  Trusted Highway Companion
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  Built for total reliability when seconds count.
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Our network operates 24/7 with zero downtime. Whether you are stuck on a highway at 2 AM or in city traffic, LifeOS guarantees verified help.
                </p>

                <div className="pt-2 space-y-2">
                  {['Fastest 8-minute average dispatch', 'Transparent cashless digital receipts', '24/7 dedicated rescue operator desk'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Metric Cards Grid */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                {trustMetrics.map((m, idx) => {
                  const Icon = m.icon
                  return (
                    <div key={idx} className="surface-glass rounded-2xl p-5 border border-white/10 space-y-2 hover:border-white/20 transition-colors">
                      <Icon className="size-6 text-accent" />
                      <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{m.value}</p>
                      <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl font-extrabold text-foreground">How LifeOS Works</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Four simple steps to get you moving again safely.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="surface-card rounded-2xl p-6 border border-white/10 relative space-y-3 hover:border-primary/40 transition-colors">
                <span className="text-3xl font-black text-primary/40 font-mono">{s.num}</span>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-16 mb-12">
          <div className="surface-card relative rounded-3xl p-8 sm:p-12 text-center border border-white/15 overflow-hidden shadow-2xl bg-gradient-to-b from-surface-card to-[oklch(0.16_0.008_260)]">
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                Never get stranded alone on the road again.
              </h2>
              <p className="text-sm text-muted-foreground">
                Join thousands of drivers who trust LifeOS for instant, verified emergency roadside assistance.
              </p>
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[oklch(0.12_0.005_260)] py-8 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span className="font-bold text-foreground">LifeOS Companion</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#trust" className="hover:text-foreground">Safety</a>
            <button onClick={onLoginClick} className="hover:text-foreground font-semibold text-primary">
              Driver Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
