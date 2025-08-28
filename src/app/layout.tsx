import { Inter, Poppins } from 'next/font/google'
import { Metadata } from 'next'
import StyledComponentsRegistry from './registry'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pokémon Card Scanner',
  description: 'Scansiona e traccia i prezzi delle tue carte Pokémon preferite',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${poppins.variable}`}>
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
