import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'LifeOS — Roadside Operating System',
  description:
    'The premier operating system for roadside emergencies. Intelligent, instant, effortlessly designed.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0b0d13',
  colorScheme: 'dark light',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jakartaSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body className="antialiased font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider defaultTheme="dark" storageKey="lifeos-theme">
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

