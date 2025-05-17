"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-black/80 backdrop-blur-md border-b border-zinc-800" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/vinfast-logo.png" alt="VinFast Logo" width={40} height={40} className="object-contain" />
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-xl hidden sm:inline-block text-white"
          >
            VinFast 3D
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-medium text-white hover:text-red-400 transition-colors">
            Trang Chủ
          </Link>
          <Link href="/models" className="font-medium text-white hover:text-red-400 transition-colors">
            Các Dòng Xe
          </Link>
          <Link href="/ar-vr" className="font-medium text-white hover:text-red-400 transition-colors">
            AR/VR
          </Link>
          <Link href="/payment" className="font-medium text-white hover:text-red-400 transition-colors">
            Thanh Toán
          </Link>
          <Link href="/contract" className="font-medium text-white hover:text-red-400 transition-colors">
            Hợp Đồng
          </Link>
          <Link href="/about" className="font-medium text-white hover:text-red-400 transition-colors">
            Giới Thiệu
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-zinc-700 text-white">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Mở menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-8">
                <Image
                  src="/images/vinfast-logo.png"
                  alt="VinFast Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="font-bold text-lg text-white">VinFast 3D</span>
              </div>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="font-medium text-white hover:text-red-400 transition-colors py-2 border-b border-zinc-800"
                  onClick={() => setIsOpen(false)}
                >
                  Trang Chủ
                </Link>
                <Link
                  href="/models"
                  className="font-medium text-white hover:text-red-400 transition-colors py-2 border-b border-zinc-800"
                  onClick={() => setIsOpen(false)}
                >
                  Các Dòng Xe
                </Link>
                <Link
                  href="/ar-vr"
                  className="font-medium text-white hover:text-red-400 transition-colors py-2 border-b border-zinc-800"
                  onClick={() => setIsOpen(false)}
                >
                  AR/VR
                </Link>
                <Link
                  href="/payment"
                  className="font-medium text-white hover:text-red-400 transition-colors py-2 border-b border-zinc-800"
                  onClick={() => setIsOpen(false)}
                >
                  Thanh Toán
                </Link>
                <Link
                  href="/contract"
                  className="font-medium text-white hover:text-red-400 transition-colors py-2 border-b border-zinc-800"
                  onClick={() => setIsOpen(false)}
                >
                  Hợp Đồng
                </Link>
                <Link
                  href="/about"
                  className="font-medium text-white hover:text-red-400 transition-colors py-2 border-b border-zinc-800"
                  onClick={() => setIsOpen(false)}
                >
                  Giới Thiệu
                </Link>
                <Link
                  href="/contact"
                  className="font-medium text-white hover:text-red-400 transition-colors py-2 border-b border-zinc-800"
                  onClick={() => setIsOpen(false)}
                >
                  Liên Hệ
                </Link>
              </nav>
              <div className="mt-8">
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  Đặt Lịch Lái Thử
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
