import './globals.css'
import type { Metadata } from 'next'
import { Playfair_Display, Nunito } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Web Uno P2P',
  description: 'Serverless P2P Uno Game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${nunito.variable} font-sans`}>{children}</body>
    </html>
  )
}
