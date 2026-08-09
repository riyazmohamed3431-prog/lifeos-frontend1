'use client'

import {
  ShieldCheck,
  Zap,
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
  Radio,
  Quote,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverScaleCard, ScaleButton } from '@/components/ui/framer-wrapper'

export function LandingScreen({
  onGetStarted,
  onLoginClick,
}: {
  onGetStarted: () => void
  onLoginClick: () => void
}) {
  const features = [
    {
      icon: Zap,
      title: 'Sub-10m Emergency Dispatch',
      desc: 'Autonomous AI matching connects you to the nearest mobile recovery unit in under 30 seconds.',
      badge: 'Sub-10m Dispatch',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Master Mechanics',
      desc: 'Every technician in our squad is background-checked, certified, and rated 4.8+ stars by Tamil Nadu drivers.',
      badge: '100% Certified',
    },
    {
      icon: Navigation,
      title: 'Sub-Second Live GPS Radar',
      desc: 'Watch your rescue rig approach in real-time with sub-second GPS telemetry and accurate live ETA.',
      badge: 'Real-time Radar',
    },
    {
      icon: Lock,
      title: 'Transparent Flat Pricing',
      desc: 'Upfront clear pricing with instant digital receipts. Zero hidden surge fees during night emergencies.',
      badge: 'Transparent Fees',
    },
    {
      icon: History,
      title: 'Digital Health & Service Logs',
      desc: 'Complete digital logs of all past vehicle rescues, digital diagnostics, and technician notes saved to cloud.',
      badge: 'Cloud Recorded',
    },
    {
      icon: PhoneCall,
      title: 'Automated Emergency Hotline',
      desc: 'Automated SOS broadcasts sending your precise GPS coordinates to trusted emergency contacts and highway patrol.',
      badge: 'Instant SOS',
    },
  ]

  const trustMetrics = [
    { value: '< 8 mins', label: 'Average Arrival Time', icon: Clock },
    { value: '3,000+', label: 'Verified Technicians', icon: Users },
    { value: '24 / 7', label: 'Highway & City Coverage', icon: Radio },
    { value: '99.8%', label: 'Successful Rescues', icon: Award },
  ]

  const testimonials = [
    {
      name: 'Rohan Varma',
      location: 'Chennai • BMW iX Driver',
      rating: 5,
      comment: 'Broke down on GST Road at 1 AM with a dead battery. LifeOS dispatched Karthik in 7 minutes flat. Incredible app experience!',
    },
    {
      name: 'Ananya Ramesh',
      location: 'ECR Corridor • Tesla Model 3',
      rating: 5,
      comment: 'Got a sudden flat tyre near Kovalam. The live tracking map kept me completely calm while the mechanic arrived in 9 mins.',
    },
    {
      name: 'Suresh Kumar',
      location: 'Tambaram • Tata Nexon EV',
      rating: 5,
      comment: 'Transparent pricing with instant UPI payment. No bargaining or surge charges. Every car owner needs LifeOS installed.',
    },
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
    <div className="relative min-h-screen w-full bg-background text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* Background Depth & Subtle Radial Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[750px] rounded-full bg-primary/15 blur-[150px] animate-pulse" />
        <div className="absolute top-[35%] -left-32 size-[500px] rounded-full bg-accent/10 blur-[130px]" />
        <div className="absolute top-[65%] -right-32 size-[550px] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-2xl transition-all"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={onGetStarted}>
            <div className="relative grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 text-primary border border-primary/40 shadow-lg transition-transform group-hover:scale-105">
              <ShieldCheck className="size-6 text-primary" />
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight gradient-text-primary">
                  LifeOS
                </span>
                <span className="hidden sm:inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-accent border border-accent/20 uppercase tracking-wider">
                  24/7 Companion
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">Emergency Roadside Command Center</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#trust" className="hover:text-foreground transition-colors">Testimonials</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="text-xs font-bold text-muted-foreground hover:text-foreground px-3.5 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <ScaleButton
              onClick={onGetStarted}
              className="group flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </ScaleButton>
          </div>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <section className="pt-12 pb-20 md:pt-16 md:pb-24">
          <div className="max-w-3xl mx-auto space-y-8 text-center">
            
            {/* Top Badge */}
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-1.5 border border-border text-xs font-bold text-accent shadow-sm">
                <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>24/7 Tamil Nadu Emergency Rescue Network</span>
                <Sparkles className="size-3.5 text-accent" />
              </div>
            </FadeIn>

            {/* Headline */}
            <SlideUp delay={0.25} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                Roadside Emergency?{' '}
                <span className="block gradient-text-primary">
                  Help Arrives in Minutes.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto">
                LifeOS instantly connects stranded drivers with verified master technicians across Tamil Nadu highways & cities with sub-second GPS radar tracking.
              </p>
            </SlideUp>

            {/* CTAs */}
            <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <ScaleButton
                onClick={onGetStarted}
                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-blue-600 px-8 py-4 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/30 cursor-pointer"
              >
                <span>Request Emergency Rescue</span>
                <ArrowRight className="size-4" />
              </ScaleButton>

              <a
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl surface-card px-7 py-4 text-sm font-bold text-foreground hover:bg-secondary border border-border transition-all cursor-pointer shadow-sm"
              >
                <span>Learn More</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </a>
            </FadeIn>

            {/* Key Highlights */}
            <FadeIn delay={0.55} className="pt-6 border-t border-border grid grid-cols-3 gap-6 text-center max-w-lg mx-auto">
              <div className="hover:translate-y-[-2px] transition-transform">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">&lt; 8 Mins</p>
                <p className="text-xs text-muted-foreground font-medium">Avg Dispatch Arrival</p>
              </div>
              <div className="hover:translate-y-[-2px] transition-transform">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">4.98 ★</p>
                <p className="text-xs text-muted-foreground font-medium">Verified Driver Rating</p>
              </div>
              <div className="hover:translate-y-[-2px] transition-transform">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">100%</p>
                <p className="text-xs text-muted-foreground font-medium">Certified Mechanics</p>
              </div>
            </FadeIn>

          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-16 border-t border-border">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="rounded-full bg-primary/15 border border-primary/30 px-3.5 py-1 text-xs font-bold text-accent tracking-wider uppercase">
              Engineered for Driver Safety
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Everything you need during a roadside emergency.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Built with precision telemetry, certified mechanics, and instant response routing.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon
              return (
                <StaggerItem key={idx}>
                  <HoverScaleCard className="surface-card group relative rounded-3xl p-6 border border-border hover:border-primary/40 transition-all duration-300 shadow-lg h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div className="grid size-12 place-items-center rounded-2xl bg-primary/20 text-primary border border-primary/30 group-hover:scale-110 transition-transform">
                        <Icon className="size-6 text-primary" />
                      </div>
                      <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-accent border border-border">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </HoverScaleCard>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="trust" className="py-16 border-t border-border">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400 tracking-wider uppercase">
              Driver Reviews
            </span>
            <h2 className="text-3xl font-black text-foreground">Loved by 50,000+ Tamil Nadu Drivers</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Real stories from drivers who broke down and got rescued fast.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <HoverScaleCard key={i} className="surface-card rounded-3xl p-6 border border-border space-y-4 shadow-xl flex flex-col justify-between hover:border-primary/30 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="size-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="size-6 text-primary/40" />
                  <p className="text-xs text-foreground/90 leading-relaxed italic">"{t.comment}"</p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-extrabold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.location}</p>
                </div>
              </HoverScaleCard>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-16 border-t border-border">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl font-black text-foreground">How LifeOS Works</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Four simple steps to get you moving again safely.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <HoverScaleCard key={idx} className="surface-card rounded-3xl p-6 border border-border relative space-y-3 hover:border-primary/40 transition-all shadow-md">
                <span className="text-4xl font-black text-primary/40 font-mono">{s.num}</span>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </HoverScaleCard>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-16 mb-12">
          <div className="surface-glass relative rounded-3xl p-8 sm:p-12 text-center border border-border overflow-hidden shadow-2xl backdrop-blur-2xl">
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                Never get stranded alone on the highway again.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join thousands of drivers across Tamil Nadu who rely on LifeOS for 24/7 instant emergency roadside assistance.
              </p>
              <ScaleButton
                onClick={onGetStarted}
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-blue-600 px-9 py-4 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/30 transition-all cursor-pointer"
              >
                <span>Launch Emergency Dashboard</span>
                <ArrowRight className="size-4" />
              </ScaleButton>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-8 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span className="font-bold text-foreground">LifeOS Companion</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#trust" className="hover:text-foreground">Safety</a>
            <button onClick={onLoginClick} className="hover:text-foreground font-semibold text-primary cursor-pointer">
              Driver Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}


