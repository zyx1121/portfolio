import { ThemeToggle } from '@/components/header/theme'
import { ThemeProvider } from '@/components/providers/theme'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"
import Link from 'next/link'
import './globals.css'

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'localhost:3000',
  description: '3000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="sticky top-0 flex h-16 w-[100dvw] bg-transparent px-8 font-mono">
            <Label className="my-auto" >
              <Link href="/">
                localhost:3000
              </Link>
            </Label>
            <Badge className="my-auto ml-2 " variant="secondary">
              demo
            </Badge>
            <ThemeToggle />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
