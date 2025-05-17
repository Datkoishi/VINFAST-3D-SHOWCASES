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

  const handleARView = () => {
    if (isMobile) {
      setQrCodeVisible(true)
      toast({
        title: "Quét mã QR",
        description: "Quét mã QR để trải nghiệm AR trên thiết bị di động của bạn",
      })
    } else {
      toast({
        title: "Cần thiết bị di động",
        description: "Vui lòng sử dụng thiết bị di động để trải nghiệm AR",
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
    <div className="pt-24 pb-20 bg-gradient-to-b from-black to-zinc-900 min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>
      <BackgroundBeams className="opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/models">
            <Button variant="outline" size="icon" className="border-zinc-700 text-white">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Trải Nghiệm Thực Tế Ảo</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <Tabs defaultValue="ar" className="w-full">
              <TabsList className="mb-6 bg-zinc-800 p-1 rounded-full">
                <TabsTrigger
                  value="ar"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Thực Tế Tăng Cường (AR)
                </TabsTrigger>
                <TabsTrigger
                  value="vr"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  <Headset className="h-4 w-4 mr-2" />
                  Thực Tế Ảo (VR)
                </TabsTrigger>
                <TabsTrigger
                  value="web"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  <Laptop className="h-4 w-4 mr-2" />
                  Web 3D
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ar" className="mt-0">
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Thực Tế Tăng Cường (AR)</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Đặt xe VinFast vào không gian thực của bạn thông qua camera điện thoại
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[300px] md:h-[400px] bg-zinc-900/50 rounded-lg overflow-hidden">
                      {qrCodeVisible ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="bg-white p-4 rounded-lg mb-4">
                            <QrCode size={200} className="text-black" />
                          </div>
                          <p className="text-white text-center">Quét mã QR bằng điện thoại để trải nghiệm AR</p>
                          <Button
                            variant="outline"
                            className="mt-4 border-zinc-700 text-white"
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
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <Smartphone className="h-12 w-12 text-red-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Đặt xe VinFast vào không gian thực</h3>
                            <p className="text-zinc-300 mb-6 max-w-md">
                              Sử dụng camera điện thoại để đặt mô hình 3D của xe VinFast vào không gian thực của bạn
                            </p>
                            <Button
                              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
                              onClick={handleARView}
                            >
                              Bắt Đầu Trải Nghiệm AR
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start">
                    <div className="flex items-start gap-2 text-zinc-400 mb-4">
                      <Info className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm">
                        Để trải nghiệm AR, bạn cần sử dụng thiết bị di động có hỗ trợ AR (iOS 12+ hoặc Android 8.0+) và
                        trình duyệt hỗ trợ WebXR.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                      {cars.map((car) => (
                        <Button
                          key={car.id}
                          variant={selectedCar === car.id ? "default" : "outline"}
                          className={`h-auto p-2 ${
                            selectedCar === car.id
                              ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                              : "border-zinc-700 text-white"
                          }`}
                          onClick={() => setSelectedCar(car.id)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative w-12 h-12 mb-1">
                              <Image
                                src={car.image || "/placeholder.svg"}
                                alt={car.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-xs">{car.name.split(" ")[1]}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="vr" className="mt-0">
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Thực Tế Ảo (VR)</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Trải nghiệm xe VinFast trong môi trường thực tế ảo hoàn toàn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[300px] md:h-[400px] bg-zinc-900/50 rounded-lg overflow-hidden">
                      <Image src="/images/vr-preview.png" alt="VR Preview" fill className="object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <Headset className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          Trải nghiệm xe VinFast trong môi trường VR
                        </h3>
                        <p className="text-zinc-300 mb-6 max-w-md">
                          Sử dụng kính thực tế ảo để trải nghiệm xe VinFast trong không gian 3D hoàn toàn
                        </p>
                        <Button
                          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
                          onClick={handleVRView}
                        >
                          Bắt Đầu Trải Nghiệm VR
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start">
                    <div className="flex items-start gap-2 text-zinc-400 mb-4">
                      <Info className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm">
                        Để trải nghiệm VR, bạn cần sử dụng kính thực tế ảo (Oculus, HTC Vive, v.v.) và trình duyệt hỗ
                        trợ WebXR.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                      {cars.map((car) => (
                        <Button
                          key={car.id}
                          variant={selectedCar === car.id ? "default" : "outline"}
                          className={`h-auto p-2 ${
                            selectedCar === car.id
                              ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                              : "border-zinc-700 text-white"
                          }`}
                          onClick={() => setSelectedCar(car.id)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative w-12 h-12 mb-1">
                              <Image
                                src={car.image || "/placeholder.svg"}
                                alt={car.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-xs">{car.name.split(" ")[1]}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="web" className="mt-0">
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Web 3D</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Trải nghiệm xe VinFast trong không gian 3D trên trình duyệt web
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[300px] md:h-[400px] bg-zinc-900/50 rounded-lg overflow-hidden">
                      <Image
                        src="/images/web3d-preview.png"
                        alt="Web 3D Preview"
                        fill
                        className="object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <Laptop className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Khám phá xe VinFast trong không gian 3D</h3>
                        <p className="text-zinc-300 mb-6 max-w-md">
                          Trải nghiệm mô hình 3D của xe VinFast trực tiếp trên trình duyệt web của bạn
                        </p>
                        <Link href={`/models/${selectedCar}`}>
                          <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0">
                            Xem Mô Hình 3D
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start">
                    <div className="flex items-start gap-2 text-zinc-400 mb-4">
                      <Info className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm">
                        Trải nghiệm Web 3D hoạt động trên hầu hết các trình duyệt hiện đại và không yêu cầu thiết bị đặc
                        biệt.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                      {cars.map((car) => (
                        <Button
                          key={car.id}
                          variant={selectedCar === car.id ? "default" : "outline"}
                          className={`h-auto p-2 ${
                            selectedCar === car.id
                              ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                              : "border-zinc-700 text-white"
                          }`}
                          onClick={() => setSelectedCar(car.id)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative w-12 h-12 mb-1">
                              <Image
                                src={car.image || "/placeholder.svg"}
                                alt={car.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-xs">{car.name.split(" ")[1]}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700 h-full">
              <CardHeader>
                <CardTitle className="text-white">Lợi ích trải nghiệm thực tế ảo</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Trải nghiệm chân thực",
                      description: "Cảm nhận không gian và kích thước thực tế của xe VinFast",
                      icon: (
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
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
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
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
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
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
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                      ),
                    },
                    {
                      title: "Tùy chỉnh theo ý thích",
                      description: "Thay đổi màu sắc, tùy chọn và xem kết quả ngay lập tức",
                      icon: (
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
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
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
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
                      className="flex gap-4"
                    >
                      {item.icon}
                      <div>
                        <h3 className="text-white font-medium mb-1">{item.title}</h3>
                        <p className="text-zinc-400 text-sm">{item.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
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

        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Hướng Dẫn Sử Dụng</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
            Làm theo các bước đơn giản sau để trải nghiệm xe VinFast trong thực tế ảo
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Chọn phương thức",
                description: "Chọn phương thức trải nghiệm: AR, VR hoặc Web 3D",
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                ),
              },
              {
                title: "Chọn mẫu xe",
                description: "Chọn mẫu xe VinFast bạn muốn trải nghiệm",
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
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                ),
              },
              {
                title: "Bắt đầu trải nghiệm",
                description: "Nhấn nút bắt đầu và làm theo hướng dẫn",
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
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                ),
              },
              {
                title: "Tương tác",
                description: "Tương tác với mô hình 3D để khám phá chi tiết",
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
                className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700 rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-700/50 flex items-center justify-center mb-4 mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
