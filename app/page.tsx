"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, ArrowRight } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const cars = [
    {
      id: "lux-2-0",
      name: "VinFast Lux 2.0",
      description: "Mẫu sedan cao cấp với thiết kế sang trọng và hiện đại",
      image: "/images/lux-2-0-thumbnail.png",
      featured: true,
    },
    {
      id: "vf8",
      name: "VinFast VF8",
      description: "SUV điện thông minh với công nghệ tiên tiến",
      image: "/images/vf8-thumbnail.png",
      featured: false,
    },
    {
      id: "vf9",
      name: "VinFast VF9",
      description: "SUV điện cỡ lớn với không gian rộng rãi",
      image: "/images/vf9-thumbnail.png",
      featured: false,
    },
    {
      id: "vf6",
      name: "VinFast VF6",
      description: "SUV điện cỡ nhỏ với thiết kế năng động",
      image: "/images/vf6-thumbnail.png",
      featured: false,
    },
  ]

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <BackgroundBeams className="opacity-30" />
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Image
                src="/images/vinfast-logo-large.png"
                alt="VinFast Logo"
                width={180}
                height={180}
                className="mx-auto"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              <TextGenerateEffect words="Trải Nghiệm Xe VinFast Trong Không Gian 3D" />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-zinc-400 max-w-3xl mb-10"
            >
              Khám phá các mẫu xe VinFast với công nghệ 3D tương tác hiện đại. Xoay, phóng to và tìm hiểu chi tiết về
              từng bộ phận của xe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/models">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 rounded-full px-8 py-6 text-lg"
                >
                  Khám Phá Ngay
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-zinc-700 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
                >
                  Tìm Hiểu Thêm
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-sm mb-2">Cuộn xuống</span>
                <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center p-1">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    className="w-1 h-1 bg-white rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Car Banner */}
      <div className="relative py-24 bg-gradient-to-b from-black to-zinc-900">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-800"
          >
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full text-sm font-medium text-white mb-6">
                  Nổi Bật
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">VinFast Lux 2.0</h2>
                <p className="mb-8 text-zinc-400 text-lg">
                  Trải nghiệm đẳng cấp với thiết kế sang trọng và công nghệ tiên tiến. Mẫu sedan cao cấp nhất của
                  VinFast với động cơ mạnh mẽ và nội thất sang trọng.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/models/lux-2-0">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 rounded-full px-6"
                    >
                      Xem Mô Hình 3D
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-zinc-700 text-white hover:bg-white/10 rounded-full px-6"
                  >
                    Thông Số Kỹ Thuật
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-zinc-900 to-zinc-800">
                <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 bg-repeat"></div>
                <Image
                  src="/images/lux-2-0-hero.png"
                  alt="VinFast Lux 2.0"
                  fill
                  className="object-contain p-6"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="relative py-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Khám Phá Các Dòng Xe
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              Trải nghiệm các mẫu xe VinFast với công nghệ 3D tương tác hiện đại
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -10 }}
              >
                <Card className="overflow-hidden h-full bg-zinc-800/50 border-zinc-700 backdrop-blur-sm group hover:bg-zinc-800/80 transition-all duration-300">
                  <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
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

          <div className="mt-12 text-center">
            <Link href="/models">
              <Button
                variant="outline"
                size="lg"
                className="border-zinc-700 text-white hover:bg-white/10 rounded-full px-8"
              >
                Xem Tất Cả Các Dòng Xe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-gradient-to-b from-black to-zinc-900">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Tính Năng Nổi Bật
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              Khám phá các tính năng hiện đại của nền tảng 3D VinFast
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Xoay 360 Độ",
                description: "Xoay mô hình xe theo mọi góc độ để xem chi tiết từng bộ phận",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                ),
              },
              {
                title: "Phóng To Chi Tiết",
                description: "Phóng to để xem chi tiết các bộ phận nhỏ nhất của xe",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                    <path d="M11 8v6" />
                    <path d="M8 11h6" />
                  </svg>
                ),
              },
              {
                title: "Thay Đổi Màu Sắc",
                description: "Thử nghiệm các màu sắc khác nhau để tìm màu xe phù hợp nhất",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <circle cx="13.5" cy="6.5" r="2.5" />
                    <circle cx="17.5" cy="10.5" r="2.5" />
                    <circle cx="8.5" cy="7.5" r="2.5" />
                    <circle cx="6.5" cy="12.5" r="2.5" />
                    <path d="M12 22v-6" />
                    <path d="M12 13V7.5" />
                  </svg>
                ),
              },
              {
                title: "Xem Nội Thất",
                description: "Khám phá không gian nội thất sang trọng của các dòng xe VinFast",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                    <path d="M12 3v6" />
                  </svg>
                ),
              },
              {
                title: "Thông Số Kỹ Thuật",
                description: "Xem đầy đủ thông số kỹ thuật chi tiết của từng dòng xe",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                ),
              },
              {
                title: "Đặt Lịch Lái Thử",
                description: "Đặt lịch lái thử xe VinFast tại đại lý gần nhất",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-6 hover:bg-zinc-800/80 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-zinc-700/50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Sẵn Sàng Trải Nghiệm VinFast?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-zinc-400 mb-8"
            >
              Khám phá các mẫu xe VinFast với công nghệ 3D tương tác hoặc đặt lịch lái thử ngay hôm nay
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/models">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 rounded-full px-8"
                >
                  Khám Phá Các Mẫu Xe
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-zinc-700 text-white hover:bg-white/10 rounded-full px-8"
              >
                Đặt Lịch Lái Thử
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
