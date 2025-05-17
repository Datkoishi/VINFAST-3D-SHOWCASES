"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, Laptop, Headset, QrCode, Info, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { useToast } from "@/components/ui/use-toast"
import { useMobile } from "@/hooks/use-mobile"

export default function ARVRPage() {
  const { toast } = useToast()
  const isMobile = useMobile()
  const [isVRSupported, setIsVRSupported] = useState(false)
  const [isARSupported, setIsARSupported] = useState(false)
  const [qrCodeVisible, setQrCodeVisible] = useState(false)
  const [selectedCar, setSelectedCar] = useState("lux-2-0")

  // URL của trang web đã triển khai
  const deployedUrl = "https://v0-vinfast-3d-model-website-git-main-datkoishis-projects.vercel.app"

  useEffect(() => {
    // Kiểm tra hỗ trợ WebXR
    if (typeof navigator !== "undefined" && navigator.xr) {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        setIsVRSupported(supported)
      })
      navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
        setIsARSupported(supported)
      })
    }
  }, [])

  const detectiOS = () => {
    if (typeof window === "undefined") return false
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    )
  }

  const isiOS = detectiOS()

  const handleARView = () => {
    if (isMobile) {
      if (isiOS) {
        // Truy cập camera trực tiếp trên iOS
        window.location.href = `ar://?model=${selectedCar}&url=${deployedUrl}/models/${selectedCar}`
      } else {
        // Trên thiết bị Android, hiển thị hướng dẫn
        toast({
          title: "Truy cập AR",
          description: "Đang mở trải nghiệm AR trên thiết bị của bạn",
        })
        // Mở link AR Android
        window.location.href = `intent://${deployedUrl.replace("https://", "")}/models/${selectedCar}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`
      }
    } else {
      // Trên desktop, hiển thị mã QR
      setQrCodeVisible(true)
      toast({
        title: "Quét mã QR",
        description: "Quét mã QR để trải nghiệm AR trên thiết bị di động của bạn",
      })
    }
  }

  const handleVRView = () => {
    if (isVRSupported) {
      toast({
        title: "Đang khởi động VR",
        description: "Vui lòng đeo kính VR của bạn để bắt đầu trải nghiệm",
      })
    } else {
      toast({
        title: "Không hỗ trợ VR",
        description: "Trình duyệt của bạn không hỗ trợ VR. Vui lòng thử trình duyệt khác hoặc thiết bị VR chuyên dụng",
      })
    }
  }

  const cars = [
    {
      id: "lux-2-0",
      name: "VinFast Lux 2.0",
      image: "/images/lux-2-0-thumbnail.png",
    },
    {
      id: "vf8",
      name: "VinFast VF8",
      image: "/images/vf8-thumbnail.png",
    },
    {
      id: "vf9",
      name: "VinFast VF9",
      image: "/images/vf9-thumbnail.png",
    },
    {
      id: "vf6",
      name: "VinFast VF6",
      image: "/images/vf6-thumbnail.png",
    },
  ]

  return (
    <div className="pt-16 md:pt-24 pb-12 md:pb-20 bg-gradient-to-b from-black to-zinc-900 min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>
      <BackgroundBeams className="opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center gap-2 mb-6 md:mb-8">
          <Link href="/models">
            <Button variant="outline" size="icon" className="border-zinc-700 text-white h-8 w-8 md:h-10 md:w-10">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl md:text-3xl font-bold text-white">Trải Nghiệm Thực Tế Ảo</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          <div className="md:col-span-2">
            <Tabs defaultValue="ar" className="w-full">
              <TabsList className="mb-4 md:mb-6 bg-zinc-800 p-1 rounded-full w-full overflow-x-auto flex-nowrap whitespace-nowrap no-scrollbar">
                <TabsTrigger
                  value="ar"
                  className="rounded-full text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  <Smartphone className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden xs:inline">Thực Tế Tăng Cường</span>
                  <span className="xs:hidden">AR</span>
                </TabsTrigger>
                <TabsTrigger
                  value="vr"
                  className="rounded-full text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  <Headset className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden xs:inline">Thực Tế Ảo</span>
                  <span className="xs:hidden">VR</span>
                </TabsTrigger>
                <TabsTrigger
                  value="web"
                  className="rounded-full text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  <Laptop className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden xs:inline">Web 3D</span>
                  <span className="xs:hidden">Web 3D</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ar" className="mt-0">
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl text-white">Thực Tế Tăng Cường (AR)</CardTitle>
                    <CardDescription className="text-xs md:text-sm text-zinc-400">
                      Đặt xe VinFast vào không gian thực của bạn thông qua camera điện thoại
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="relative h-[200px] sm:h-[250px] md:h-[400px] bg-zinc-900/50 rounded-lg overflow-hidden">
                      {qrCodeVisible ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          <div className="bg-white p-3 md:p-4 rounded-lg mb-3 md:mb-4">
                            <QrCode
                              size={isMobile ? 150 : 200}
                              className="text-black"
                              value={`${deployedUrl}/models/${selectedCar}`}
                            />
                          </div>
                          <p className="text-white text-center text-sm md:text-base">
                            Quét mã QR bằng điện thoại để trải nghiệm AR
                          </p>
                          <Button
                            variant="outline"
                            className="mt-3 md:mt-4 border-zinc-700 text-white text-xs md:text-sm h-8 md:h-10"
                            onClick={() => setQrCodeVisible(false)}
                          >
                            Đóng
                          </Button>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src="/images/ar-preview.png"
                            alt="AR Preview"
                            fill
                            className="object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-6">
                            <Smartphone className="h-8 w-8 md:h-12 md:w-12 text-red-500 mb-2 md:mb-4" />
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                              Đặt xe VinFast vào không gian thực
                            </h3>
                            <p className="text-xs md:text-sm text-zinc-300 mb-4 md:mb-6 max-w-md">
                              Sử dụng camera điện thoại để đặt mô hình 3D của xe VinFast vào không gian thực của bạn
                            </p>
                            <Button
                              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 text-xs md:text-sm h-8 md:h-10"
                              onClick={handleARView}
                            >
                              Bắt Đầu Trải Nghiệm AR
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4 md:p-6">
                    <div className="flex items-start gap-2 text-zinc-400 mb-3 md:mb-4">
                      <Info className="h-4 w-4 md:h-5 md:w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm">
                        Để trải nghiệm AR, bạn cần sử dụng thiết bị di động có hỗ trợ AR (iOS 12+ hoặc Android 8.0+) và
                        trình duyệt hỗ trợ WebXR.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 w-full">
                      {cars.map((car) => (
                        <Button
                          key={car.id}
                          variant={selectedCar === car.id ? "default" : "outline"}
                          className={`h-auto p-1 md:p-2 ${
                            selectedCar === car.id
                              ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                              : "border-zinc-700 text-white"
                          }`}
                          onClick={() => setSelectedCar(car.id)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative w-8 h-8 md:w-12 md:h-12 mb-1">
                              <Image
                                src={car.image || "/placeholder.svg"}
                                alt={car.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-[10px] md:text-xs">{car.name.split(" ")[1]}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="vr" className="mt-0">
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl text-white">Thực Tế Ảo (VR)</CardTitle>
                    <CardDescription className="text-xs md:text-sm text-zinc-400">
                      Trải nghiệm xe VinFast trong môi trường thực tế ảo hoàn toàn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="relative h-[200px] sm:h-[250px] md:h-[400px] bg-zinc-900/50 rounded-lg overflow-hidden">
                      <Image src="/images/vr-preview.png" alt="VR Preview" fill className="object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-6">
                        <Headset className="h-8 w-8 md:h-12 md:w-12 text-red-500 mb-2 md:mb-4" />
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                          Trải nghiệm xe VinFast trong môi trường VR
                        </h3>
                        <p className="text-xs md:text-sm text-zinc-300 mb-4 md:mb-6 max-w-md">
                          Sử dụng kính thực tế ảo để trải nghiệm xe VinFast trong không gian 3D hoàn toàn
                        </p>
                        <Button
                          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 text-xs md:text-sm h-8 md:h-10"
                          onClick={handleVRView}
                        >
                          Bắt Đầu Trải Nghiệm VR
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4 md:p-6">
                    <div className="flex items-start gap-2 text-zinc-400 mb-3 md:mb-4">
                      <Info className="h-4 w-4 md:h-5 md:w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm">
                        Để trải nghiệm VR, bạn cần sử dụng kính thực tế ảo (Oculus, HTC Vive, v.v.) và trình duyệt hỗ
                        trợ WebXR.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 w-full">
                      {cars.map((car) => (
                        <Button
                          key={car.id}
                          variant={selectedCar === car.id ? "default" : "outline"}
                          className={`h-auto p-1 md:p-2 ${
                            selectedCar === car.id
                              ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                              : "border-zinc-700 text-white"
                          }`}
                          onClick={() => setSelectedCar(car.id)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative w-8 h-8 md:w-12 md:h-12 mb-1">
                              <Image
                                src={car.image || "/placeholder.svg"}
                                alt={car.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-[10px] md:text-xs">{car.name.split(" ")[1]}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="web" className="mt-0">
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl text-white">Web 3D</CardTitle>
                    <CardDescription className="text-xs md:text-sm text-zinc-400">
                      Trải nghiệm xe VinFast trong không gian 3D trên trình duyệt web
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="relative h-[200px] sm:h-[250px] md:h-[400px] bg-zinc-900/50 rounded-lg overflow-hidden">
                      <Image
                        src="/images/web3d-preview.png"
                        alt="Web 3D Preview"
                        fill
                        className="object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-6">
                        <Laptop className="h-8 w-8 md:h-12 md:w-12 text-red-500 mb-2 md:mb-4" />
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                          Khám phá xe VinFast trong không gian 3D
                        </h3>
                        <p className="text-xs md:text-sm text-zinc-300 mb-4 md:mb-6 max-w-md">
                          Trải nghiệm mô hình 3D của xe VinFast trực tiếp trên trình duyệt web của bạn
                        </p>
                        <Link href={`/models/${selectedCar}`}>
                          <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 text-xs md:text-sm h-8 md:h-10">
                            Xem Mô Hình 3D
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4 md:p-6">
                    <div className="flex items-start gap-2 text-zinc-400 mb-3 md:mb-4">
                      <Info className="h-4 w-4 md:h-5 md:w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm">
                        Trải nghiệm Web 3D hoạt động trên hầu hết các trình duyệt hiện đại và không yêu cầu thiết bị đặc
                        biệt.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 w-full">
                      {cars.map((car) => (
                        <Button
                          key={car.id}
                          variant={selectedCar === car.id ? "default" : "outline"}
                          className={`h-auto p-1 md:p-2 ${
                            selectedCar === car.id
                              ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                              : "border-zinc-700 text-white"
                          }`}
                          onClick={() => setSelectedCar(car.id)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative w-8 h-8 md:w-12 md:h-12 mb-1">
                              <Image
                                src={car.image || "/placeholder.svg"}
                                alt={car.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-[10px] md:text-xs">{car.name.split(" ")[1]}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden md:block">
            <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700 h-full">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl text-white">Lợi ích trải nghiệm thực tế ảo</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <ul className="space-y-4">
                  {[
                    {
                      title: "Trải nghiệm chân thực",
                      description: "Cảm nhận không gian và kích thước thực tế của xe VinFast",
                      icon: (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-500"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                      ),
                    },
                    {
                      title: "Khám phá chi tiết",
                      description: "Xem xét từng chi tiết bên ngoài và bên trong xe",
                      icon: (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
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
                        </div>
                      ),
                    },
                    {
                      title: "Tiết kiệm thời gian",
                      description: "Không cần đến đại lý, vẫn trải nghiệm được xe",
                      icon: (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-500"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                      ),
                    },
                    {
                      title: "Tùy chỉnh theo ý thích",
                      description: "Thay đổi màu sắc, tùy chọn và xem kết quả ngay lập tức",
                      icon: (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
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
                        </div>
                      ),
                    },
                    {
                      title: "Chia sẻ trải nghiệm",
                      description: "Dễ dàng chia sẻ trải nghiệm với bạn bè và gia đình",
                      icon: (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-500"
                          >
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" x2="12" y1="2" y2="15" />
                          </svg>
                        </div>
                      ),
                    },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex gap-3 md:gap-4"
                    >
                      {item.icon}
                      <div>
                        <h3 className="text-sm md:text-base text-white font-medium mb-0.5 md:mb-1">{item.title}</h3>
                        <p className="text-xs md:text-sm text-zinc-400">{item.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-4 md:p-6">
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 text-xs md:text-sm h-8 md:h-10"
                  onClick={() => {
                    toast({
                      title: "Đặt lịch lái thử",
                      description: "Chúng tôi sẽ liên hệ với bạn để sắp xếp lịch lái thử xe VinFast",
                    })
                  }}
                >
                  Đặt Lịch Lái Thử Thực Tế
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Mobile version of benefits */}
        <div className="md:hidden mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Lợi ích trải nghiệm thực tế ảo</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                title: "Trải nghiệm chân thực",
                description: "Cảm nhận không gian thực tế của xe",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
              },
              {
                title: "Khám phá chi tiết",
                description: "Xem xét từng chi tiết của xe",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                title: "Tiết kiệm thời gian",
                description: "Không cần đến đại lý",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
              {
                title: "Tùy chỉnh dễ dàng",
                description: "Thay đổi màu sắc, tùy chọn",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center">{item.icon}</div>
                  <h3 className="text-sm font-medium text-white">{item.title}</h3>
                </div>
                <p className="text-xs text-zinc-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
          <Button
            className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 text-xs h-9"
            onClick={() => {
              toast({
                title: "Đặt lịch lái thử",
                description: "Chúng tôi sẽ liên hệ với bạn để sắp xếp lịch lái thử xe VinFast",
              })
            }}
          >
            Đặt Lịch Lái Thử Thực Tế
          </Button>
        </div>

        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-4">Hướng Dẫn Sử Dụng</h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mx-auto mb-6 md:mb-8">
            Làm theo các bước đơn giản sau để trải nghiệm xe VinFast trong thực tế ảo
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              {
                title: "Chọn phương thức",
                description: "Chọn AR, VR hoặc Web 3D",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                ),
              },
              {
                title: "Chọn mẫu xe",
                description: "Chọn mẫu xe yêu thích",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                ),
              },
              {
                title: "Bắt đầu",
                description: "Nhấn nút bắt đầu",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                ),
              },
              {
                title: "Tương tác",
                description: "Khám phá chi tiết",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                ),
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700 rounded-xl p-3 md:p-6"
              >
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-zinc-700/50 flex items-center justify-center mb-2 md:mb-4 mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2">{step.title}</h3>
                <p className="text-xs md:text-sm text-zinc-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
