import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cinqa Tracker',
  description: 'AI Workflows & Creative Automation — Internal Content Tracker',
  icons: {
    icon: '/favicon.ico',           // standard browsers
    shortcut: '/favicon.ico',       // legacy shortcut icon
    apple: '/apple-touch-icon.png', // iOS home screen
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#060B18] text-white antialiased">{children}</body>
    </html>
  )
}