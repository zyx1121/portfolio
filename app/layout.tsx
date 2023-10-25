import { Breadcrumbs } from '@/components/header/breadcrumbs'
import { ThemeToggle } from '@/components/header/theme'
import { ThemeProvider } from '@/components/providers/theme'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ChevronsUpDown } from 'lucide-react'
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
      <body className={cn("h-[100dvh] bg-background font-mono antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="z-50 sticky top-0 flex h-16 w-[100dvw] dark:bg-[#00000080] bg-[#ffffff80] px-4 font-mono backdrop-blur-sm">
            <Label className="my-auto mx-2 text-base" >
              <Link href="/">
                ~
              </Link>
            </Label>
            <Label className="my-auto mx-1 text-border">
              /
            </Label>
            <Breadcrumbs />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="my-auto w-6 h-8" variant="ghost" size="icon">
                  <ChevronsUpDown size="16" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" >
                <DropdownMenuItem asChild>
                  <Link href="/gomoku">
                    gomoku
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
