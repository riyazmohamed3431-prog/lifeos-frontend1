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
    <div className="relative min-h-screen w-full bg-[#0B0B0C] text-[#F8FAFC] font-sans overflow-x-hidden transition-colors duration-300">
      {/* Background Depth & Subtle Radial Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[750px] rounded-full bg-[#F59E0B]/5 blur-[150px] animate-pulse" />
        <div className="absolute top-[35%] -left-32 size-[500px] rounded-full bg-[#0F766E]/5 blur-[130px]" />
        <div className="absolute top-[65%] -right-32 size-[550px] rounded-full bg-[#F59E0B]/5 blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0B0C]/80 backdrop-blur-2xl transition-all"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={onGetStarted}>
            <div className="relative grid size-11 place-items-center rounded-2xl bg-neutral-900 border border-white/10 shadow-lg transition-transform group-hover:scale-105">
              <svg className="size-6 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 7 22 17 12 22 2 17 2 7" />
                <line x1="12" y1="2" x2="12" y2="12" />
                <line x1="12" y1="12" x2="2" y2="7" />
                <line x1="12" y1="12" x2="22" y2="7" />
              </svg>
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-100 to-[#F59E0B] bg-clip-text text-transparent">
                  LifeOS
                </span>
                <span className="hidden sm:inline-block rounded-full bg-[#F59E0B]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#F59E0B] border border-[#F59E0B]/20 uppercase tracking-wider">
                  24/7 Companion
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 hidden sm:block">Emergency Roadside Command Center</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#trust" className="hover:text-white transition-colors">Testimonials</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white px-3.5 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <ScaleButton
              onClick={onGetStarted}
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F3A953] to-[#E2833B] px-5 py-2.5 text-xs font-bold text-neutral-900 shadow-lg shadow-orange-950/20 hover:opacity-95 transition-all cursor-pointer"
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
        <section className="pt-12 pb-20 md:pt-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-8 text-left animate-float-card">
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900 border border-white/5 px-4 py-1.5 text-xs font-bold text-[#F59E0B] shadow-sm">
                  <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>24/7 Tamil Nadu Emergency Rescue Network</span>
                  <Sparkles className="size-3.5 text-[#F59E0B]" />
                </div>
              </FadeIn>

              <SlideUp delay={0.2} className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                  Roadside Emergency?{' '}
                  <span className="block bg-gradient-to-r from-[#F59E0B] via-[#E2833B] to-[#F59E0B] bg-clip-text text-transparent">
                    Help Arrives in Minutes.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-neutral-400 font-medium leading-relaxed max-w-xl">
                  LifeOS instantly connects stranded drivers with verified master technicians across Tamil Nadu highways & cities with sub-second GPS radar tracking.
                </p>
              </SlideUp>

              <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
                <ScaleButton
                  onClick={onGetStarted}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#F3A953] to-[#E2833B] px-8 py-4 text-xs tracking-wider uppercase font-extrabold text-neutral-900 shadow-xl shadow-orange-950/20 cursor-pointer hover:opacity-95"
                >
                  <span>Request Emergency Rescue</span>
                  <ArrowRight className="size-4" />
                </ScaleButton>

                <a
                  href="#features"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-white/10 px-7 py-4 text-xs tracking-wider uppercase font-bold text-neutral-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <span>Learn More</span>
                  <ChevronDown className="size-4 text-neutral-500" />
                </a>
              </FadeIn>

              {/* Key Highlights */}
              <FadeIn delay={0.4} className="pt-6 border-t border-white/5 grid grid-cols-3 gap-6 text-left max-w-md">
                <div>
                  <p className="text-2xl font-black text-white font-mono">&lt; 8 Mins</p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">Avg Dispatch Arrival</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white font-mono">4.98 ★</p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">Verified Driver Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white font-mono">100%</p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">Certified Responders</p>
                </div>
              </FadeIn>
            </div>

            {/* Right Side: Interactive 3D Mock Dashboard */}
            <div className="lg:col-span-5 relative z-10 flex justify-center">
              <FadeIn delay={0.35}>
                <MockDashboard />
              </FadeIn>
            </div>

          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="rounded-full bg-[#0F766E]/10 border border-[#0F766E]/20 px-3.5 py-1 text-xs font-bold text-[#2DD4BF] tracking-wider uppercase">
              Engineered for Driver Safety
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Everything you need during a roadside emergency.
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Built with precision telemetry, certified mechanics, and instant response routing.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon
              return (
                <StaggerItem key={idx}>
                  <HoverScaleCard 
                    className="bg-[#131316]/90 border border-white/5 hover:border-white/10 group relative rounded-[28px] p-6 transition-all duration-300 shadow-2xl h-full flex flex-col justify-between animate-float-card"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="grid size-12 place-items-center rounded-2xl bg-neutral-900 text-[#F59E0B] border border-white/5 group-hover:scale-105 transition-transform">
                          <Icon className="size-5" />
                        </div>
                        <span className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-bold text-[#F59E0B] border border-white/5 uppercase tracking-wide">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#F59E0B] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </HoverScaleCard>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="trust" className="py-20 border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-400 tracking-wider uppercase">
              Driver Reviews
            </span>
            <h2 className="text-3xl font-black text-white">Loved by 50,000+ Tamil Nadu Drivers</h2>
            <p className="text-xs text-neutral-400">Real stories from drivers who broke down and got rescued fast.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <HoverScaleCard 
                key={i} 
                className="bg-[#131316]/90 border border-white/5 hover:border-white/10 rounded-[28px] p-6 space-y-4 shadow-2xl flex flex-col justify-between transition-colors animate-float-card"
                style={{ animationDelay: `${i * 0.25}s` }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="size-6 text-neutral-800" />
                  <p className="text-xs text-neutral-300 leading-relaxed italic">"{t.comment}"</p>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <p className="text-sm font-extrabold text-white">{t.name}</p>
                  <p className="text-[10px] text-neutral-500">{t.location}</p>
                </div>
              </HoverScaleCard>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-black text-white">How LifeOS Works</h2>
            <p className="text-xs text-neutral-400">Four simple steps to get you moving again safely.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <HoverScaleCard 
                key={idx} 
                className="bg-[#131316]/90 border border-white/5 hover:border-white/10 rounded-[28px] p-6 relative space-y-3 shadow-2xl animate-float-card"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <span className="text-4xl font-black text-neutral-800 font-mono block">{s.num}</span>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
              </HoverScaleCard>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-20 mb-12">
          <div 
            className="bg-[#131316]/80 border border-white/5 relative rounded-[32px] p-8 sm:p-14 text-center overflow-hidden shadow-2xl backdrop-blur-md animate-float-card"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[350px] rounded-full bg-[#F59E0B]/5 blur-[90px] pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Never get stranded alone on the highway again.
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
                Join thousands of drivers across Tamil Nadu who rely on LifeOS for 24/7 instant emergency roadside assistance.
              </p>
              <ScaleButton
                onClick={onGetStarted}
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#F3A953] to-[#E2833B] hover:opacity-95 px-9 py-4 text-xs font-extrabold uppercase tracking-wider text-neutral-900 shadow-xl shadow-orange-950/20 transition-all cursor-pointer"
              >
                <span>Launch Emergency Dashboard</span>
                <ArrowRight className="size-4" />
              </ScaleButton>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0B0B0C] py-10 text-xs text-neutral-500 font-medium">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="size-4 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 22 7 22 17 12 22 2 17 2 7" />
            </svg>
            <span className="font-bold text-white">LifeOS Companion</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#trust" className="hover:text-white transition-colors">Safety</a>
            <button onClick={onLoginClick} className="hover:text-white font-bold text-[#F59E0B] cursor-pointer">
              Driver Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* Floating CSS dashboard mockup helper inside landing page */
function MockDashboard() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto p-1.5 rounded-[32px] border border-white/5 bg-neutral-950/40 shadow-2xl backdrop-blur-md [perspective:1000px] select-none animate-float-card">
      <div className="relative rounded-[26px] border border-white/10 bg-[#131316]/95 p-5 shadow-2xl transition-all duration-700 ease-out [transform:rotateX(12deg)_rotateY(-10deg)_rotateZ(1deg)] hover:[transform:rotateX(4deg)_rotateY(-3deg)]">
        {/* Mock Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8.5 rounded-full border border-white/10 bg-neutral-900 flex items-center justify-center">
              <svg className="size-4 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 22 7 22 17 12 22 2 17 2 7" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">COMMAND PORTAL</p>
              <p className="text-xs font-black text-white">Protected: Tesla Model Y</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ACTIVE RADAR</span>
          </div>
        </div>

        {/* Mock Content Layout: Bento Widgets */}
        <div className="grid grid-cols-12 gap-3">
          {/* Telemetry card (colSpan 8) */}
          <div className="col-span-8 rounded-2xl bg-gradient-to-br from-[#0F766E]/20 via-[#131316] to-[#131316] border border-[#0F766E]/20 p-3 flex flex-col justify-between h-[96px] shadow-md">
            <div>
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wide">Connected Range</span>
              <p className="text-sm font-black text-white mt-0.5">384 km</p>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1 p-0.5 border border-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] w-[78%]" />
            </div>
          </div>

          {/* Health circular card (colSpan 4) */}
          <div className="col-span-4 rounded-2xl bg-[#18181C] border border-white/5 p-3 flex flex-col items-center justify-center h-[96px] shadow-md">
            <div className="relative size-10 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-neutral-800" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#0F766E]" strokeWidth="3.5" strokeDasharray="100" strokeDashoffset="5" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white">95%</div>
            </div>
            <span className="text-[8px] font-bold text-neutral-500 uppercase mt-1 truncate">HEAL SCORE</span>
          </div>

          {/* SOS Priority Action (colSpan 12) */}
          <div className="col-span-12 rounded-2xl bg-gradient-to-br from-red-950/15 via-[#18181C] to-[#18181C] border border-red-500/20 p-3.5 flex items-center justify-between shadow-md">
            <div>
              <p className="text-xs font-black text-white">Stranded / Emergency?</p>
              <p className="text-[9px] text-neutral-500 mt-0.5">1-tap connects you to master mechanics.</p>
            </div>
            <div className="size-9 rounded-full bg-gradient-to-tr from-red-500 to-rose-600 border border-white/10 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Zap className="size-4 text-white fill-current animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Status bar */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[8.5px] text-neutral-500 font-bold uppercase tracking-wider">
          <span>Telemetry Secure · 256-bit SSL</span>
          <span>Chennai Hub ETA: ~8m</span>
        </div>
      </div>
    </div>
  )
}
