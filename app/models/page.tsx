"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "react-intersection-observer"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

export default function ModelsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const cars = [
    {
      id: "lux-2-0",
      name: "VinFast Lux 2.0",
      description: "Mẫu sedan cao cấp với thiết kế sang trọng và hiện đại",
      image: "/images/lux-2-0-thumbnail.png",
      featured: true,
      category: "sedan",
      specs: {
        engine: "2.0L Turbo, 228 mã lực",
        acceleration: "0-100 km/h: 7.1 giây",
        topSpeed: "235 km/h",
      },
    },
    {
      id: "vf8",
      name: "VinFast VF8",
      description: "SUV điện thông minh với công nghệ tiên tiến",
      image: "/images/vf8-thumbnail.png",
      featured: false,
      category: "suv",
      specs: {
        engine: "Điện, 402 mã lực",
        acceleration: "0-100 km/h: 5.9 giây",
        topSpeed: "200 km/h",
      },
    },
    {
      id: "vf9",
      name: "VinFast VF9",
      description: "SUV điện cỡ lớn với không gian rộng rãi",
      image: "/images/vf9-thumbnail.png",
      featured: false,
      category: "suv",
      specs: {
        engine: "Điện, 402 mã lực",
        acceleration: "0-100 km/h: 6.3 giây",
        topSpeed: "200 km/h",
      },
    },
    {
      id: "vf6",
      name: "VinFast VF6",
      description: "SUV điện cỡ nhỏ với thiết kế năng động",
      image: "/images/vf6-thumbnail.png",
      featured: false,
      category: "suv",
      specs: {
        engine: "Điện, 201 mã lực",
        acceleration: "0-100 km/h: 6.8 giây",
        topSpeed: "175 km/h",
      },
    },
    {
      id: "president",
      name: "VinFast President",
      description: "SUV hạng sang với động cơ V8 mạnh mẽ",
      image: "/images/president-thumbnail.png",
      featured: false,
      category: "suv",
      specs: {
        engine: "V8 6.2L, 420 mã lực",
        acceleration: "0-100 km/h: 6.8 giây",
        topSpeed: "300 km/h",
      },
    },
    {
      id: "vf5",
      name: "VinFast VF5",
      description: "SUV điện cỡ nhỏ với giá thành hợp lý",
      image: "/images/vf5-thumbnail.png",
      featured: false,
      category: "suv",
      specs: {
        engine: "Điện, 134 mã lực",
        acceleration: "0-100 km/h: 8.9 giây",
        topSpeed: "135 km/h",
      },
    },
  ]

  const filteredCars = activeTab === "all" ? cars : cars.filter((car) => car.category === activeTab)

  const words = "Khám Phá Tất Cả Các Dòng Xe VinFast"

  return (
    <div className="relative pt-24 pb-20 bg-gradient-to-b from-black to-zinc-900 min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>
      <BackgroundBeams className="opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            <TextGenerateEffect words={words} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Trải nghiệm mô hình 3D tương tác của tất cả các dòng xe VinFast
          </motion.p>
        </div>

        {/* Car Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex justify-center space-x-2 mb-10 overflow-x-auto pb-2">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-full px-6",
                activeTab === "all"
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                  : "text-white hover:text-white hover:bg-white/10",
              )}
            >
              Tất Cả
            </Button>
            <Button
              variant={activeTab === "suv" ? "default" : "ghost"}
              onClick={() => setActiveTab("suv")}
              className={cn(
                "rounded-full px-6",
                activeTab === "suv"
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                  : "text-white hover:text-white hover:bg-white/10",
              )}
            >
              SUV
            </Button>
            <Button
              variant={activeTab === "sedan" ? "default" : "ghost"}
              onClick={() => setActiveTab("sedan")}
              className={cn(
                "rounded-full px-6",
                activeTab === "sedan"
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                  : "text-white hover:text-white hover:bg-white/10",
              )}
            >
              Sedan
            </Button>
          </div>

          {/* Car Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <Card className="overflow-hidden h-full bg-zinc-800/50 border-zinc-700 backdrop-blur-sm group hover:bg-zinc-800/80 transition-all duration-300">
                  <div className="relative h-56 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
                    <Image
                      src={car.image || "/placeholder.svg"}
                      alt={car.name}
                      fill
                      className="object-contain scale-90 group-hover:scale-100 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-50"></div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>
                    <p className="text-zinc-400 mb-4">{car.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-block px-2 py-1 bg-zinc-700 rounded-md text-xs text-zinc-300">
                        {car.category === "suv" ? "SUV" : "Sedan"}
                      </span>
                      {car.id === "lux-2-0" && (
                        <span className="inline-block px-2 py-1 bg-gradient-to-r from-red-600 to-red-500 rounded-md text-xs text-white">
                          Nổi bật
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-sm">Động cơ:</span>
                        <span className="text-white text-sm">{car.specs.engine}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-sm">Tăng tốc:</span>
                        <span className="text-white text-sm">{car.specs.acceleration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-sm">Tốc độ tối đa:</span>
                        <span className="text-white text-sm">{car.specs.topSpeed}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Link href={`/models/${car.id}`} className="w-full">
                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 rounded-full group">
                        Xem Mô Hình 3D
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
