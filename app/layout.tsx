import type React from "react"
import type { Metadata } from "next"
import { Inter, Bebas_Neue } from "next/font/google"
import "./globals.css"
import { GameProvider } from "@/lib/game-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

export const metadata: Metadata = {
  title: "Baseball Game Tracker",
  description: "Real-time baseball game tracker for children's games",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebas.variable} font-sans`}>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  )
}


import './globals.css'