import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Analytics } from "@/components/analytics"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import LiveChat from "@/components/live-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "VinFast 3D Showcase | Trải Nghiệm Xe VinFast Trong Không Gian 3D",
  description: "Khám phá các mô hình 3D của dòng xe VinFast với công nghệ tương tác hiện đại",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col min-h-screen bg-black text-white">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <LiveChat />
              <Toaster />
              <Analytics />
            </div>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
