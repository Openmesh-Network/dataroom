import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"

import { Suspense } from "react"
import { ConfigProvider } from "@/components/config-provider"
import { Header } from "@/components/header"
import Sidebar from "@/components/sidebar"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Openmesh Dataroom",
  description:
    "Visual representation of the Openmesh Network under certain circumstances.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} zoom flex font-sans antialiased`}>
        <Suspense>
          <ConfigProvider>
            <main className="grow">
              <Header />
              <div className="flex bg-gray-50 max-md:flex-col">
                <Sidebar />
                <div className="container my-5 grow pl-3 max-md:my-0">
                  {children}
                </div>
              </div>
            </main>
          </ConfigProvider>
        </Suspense>
      </body>
    </html>
  )
}
