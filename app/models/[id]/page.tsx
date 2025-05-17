"use client"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  MaximizeIcon as Maximize360,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Palette,
  Camera,
  Lightbulb,
  Gauge,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Spotlight } from "@/components/ui/spotlight"
import dynamic from "next/dynamic"

// Dynamically import the CarViewer component to avoid SSR issues with Three.js
const CarViewer = dynamic(() => import("@/components/car-viewer"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-zinc-900/50">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-red-500 animate-spin"></div>
        <p className="mt-4 text-white">Đang tải mô hình 3D...</p>
      </div>
    </div>
  ),
})

const CarSpecifications = dynamic(() => import("@/components/car-specifications"), {
  ssr: false,
})

interface CarData {
  id: string
  name: string
  description: string
  modelPath: string
  category: string
  colors: {
    name: string
    color: string
    image: string
  }[]
  specifications: {
    engine: string
    dimensions: string
    fuelType: string
    safety: string
    price: string
  }
  features: string[]
}

export default function CarDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [car, setCar] = useState<CarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeColor, setActiveColor] = useState(0)
  const [activeView, setActiveView] = useState("exterior")
  const [showHotspots, setShowHotspots] = useState(true)
  const { toast } = useToast()
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate fetching car data
    const fetchCar = async () => {
      setLoading(true)

      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockCars: Record<string, CarData> = {
        "lux-2-0": {
          id: "lux-2-0",
          name: "VinFast Lux 2.0",
          description:
            "Mẫu sedan cao cấp với thiết kế sang trọng và hiện đại, kết hợp giữa sự tinh tế của thiết kế Ý và công nghệ tiên tiến của Đức. VinFast Lux 2.0 mang đến trải nghiệm lái xe đẳng cấp với động cơ mạnh mẽ và nội thất sang trọng.",
          modelPath: "/models/lux-2-0.glb", // This would be the path to your 3D model
          category: "sedan",
          colors: [
            { name: "Đỏ Mystique", color: "#a51d2d", image: "/images/lux-2-0-red.png" },
            { name: "Đen Brahminy", color: "#1a1a1a", image: "/images/lux-2-0-black.png" },
            { name: "Bạc Neptune", color: "#c0c0c0", image: "/images/lux-2-0-silver.png" },
          ],
          specifications: {
            engine: "2.0L Turbo, 228 mã lực, 350 Nm",
            dimensions: "Dài x Rộng x Cao: 4973 x 1900 x 1500 mm",
            fuelType: "Xăng",
            safety: "8 túi khí, ABS, EBD, BA, ESC, TCS, HSA",
            price: "Từ 999.000.000 VNĐ",
          },
          features: [
            "Hệ thống giải trí màn hình cảm ứng 10.4 inch",
            "Hệ thống âm thanh 13 loa",
            "Cửa sổ trời toàn cảnh",
            "Ghế da cao cấp",
            "Hệ thống điều hòa tự động 2 vùng",
            "Hệ thống hỗ trợ lái ADAS",
          ],
        },
        vf8: {
          id: "vf8",
          name: "VinFast VF8",
          description:
            "SUV điện thông minh với công nghệ tiên tiến, mang đến trải nghiệm lái xe an toàn và thân thiện với môi trường. VinFast VF8 được trang bị hệ thống pin hiện đại và phạm vi hoạt động ấn tượng.",
          modelPath: "/models/vf8.glb",
          category: "suv",
          colors: [
            { name: "Xanh Desat Blue", color: "#2a5298", image: "/images/vf8-blue.png" },
            { name: "Đen Maybach", color: "#1a1a1a", image: "/images/vf8-black.png" },
            { name: "Trắng Brahminy", color: "#f5f5f5", image: "/images/vf8-white.png" },
          ],
          specifications: {
            engine: "Động cơ điện, 402 mã lực, 620 Nm",
            dimensions: "Dài x Rộng x Cao: 4750 x 1900 x 1660 mm",
            fuelType: "Điện",
            safety: "11 túi khí, ABS, EBD, BA, ESC, TCS, HSA",
            price: "Từ 1.057.100.000 VNĐ",
          },
          features: [
            "Màn hình cảm ứng trung tâm 15.6 inch",
            "Hệ thống hỗ trợ lái nâng cao",
            "Cập nhật phần mềm từ xa (OTA)",
            "Hệ thống âm thanh cao cấp",
            "Cửa sổ trời toàn cảnh",
            "Ghế chỉnh điện có sưởi và làm mát",
          ],
        },
        vf9: {
          id: "vf9",
          name: "VinFast VF9",
          description:
            "SUV điện cỡ lớn với không gian rộng rãi, phù hợp cho gia đình. VinFast VF9 kết hợp giữa thiết kế sang trọng và công nghệ hiện đại, mang đến trải nghiệm di chuyển thoải mái và an toàn.",
          modelPath: "/models/vf9.glb",
          category: "suv",
          colors: [
            { name: "Xanh Lục Neptune", color: "#175d4b", image: "/images/vf9-green.png" },
            { name: "Đen Stellar Black", color: "#1a1a1a", image: "/images/vf9-black.png" },
            { name: "Trắng Arctic White", color: "#f5f5f5", image: "/images/vf9-white.png" },
          ],
          specifications: {
            engine: "Động cơ điện, 402 mã lực, 620 Nm",
            dimensions: "Dài x Rộng x Cao: 5120 x 2000 x 1721 mm",
            fuelType: "Điện",
            safety: "11 túi khí, ABS, EBD, BA, ESC, TCS, HSA",
            price: "Từ 1.443.200.000 VNĐ",
          },
          features: [
            "Màn hình cảm ứng trung tâm 15.6 inch",
            "Hệ thống hỗ trợ lái nâng cao",
            "Cập nhật phần mềm từ xa (OTA)",
            "Hệ thống âm thanh cao cấp",
            "Cửa sổ trời toàn cảnh",
            "Ghế chỉnh điện có sưởi và làm mát",
            "Hàng ghế thứ 3 rộng rãi",
          ],
        },
        vf6: {
          id: "vf6",
          name: "VinFast VF6",
          description:
            "SUV điện cỡ nhỏ với thiết kế năng động, phù hợp cho đô thị. VinFast VF6 mang đến sự linh hoạt trong di chuyển và tiết kiệm chi phí vận hành.",
          modelPath: "/models/vf6.glb",
          category: "suv",
          colors: [
            { name: "Đỏ Crimson", color: "#a51d2d", image: "/images/vf6-red.png" },
            { name: "Xanh Cyan", color: "#2a5298", image: "/images/vf6-blue.png" },
            { name: "Trắng Pearl", color: "#f5f5f5", image: "/images/vf6-white.png" },
          ],
          specifications: {
            engine: "Động cơ điện, 201 mã lực, 310 Nm",
            dimensions: "Dài x Rộng x Cao: 4238 x 1820 x 1594 mm",
            fuelType: "Điện",
            safety: "6 túi khí, ABS, EBD, BA, ESC, TCS, HSA",
            price: "Từ 675.000.000 VNĐ",
          },
          features: [
            "Màn hình cảm ứng trung tâm 12.9 inch",
            "Hệ thống hỗ trợ lái cơ bản",
            "Cập nhật phần mềm từ xa (OTA)",
            "Hệ thống âm thanh 8 loa",
            "Cửa sổ trời",
            "Ghế bọc da tổng hợp",
          ],
        },
        president: {
          id: "president",
          name: "VinFast President",
          description:
            "SUV hạng sang với động cơ V8 mạnh mẽ, đại diện cho đẳng cấp và sự sang trọng. VinFast President là mẫu xe cao cấp nhất của VinFast với số lượng giới hạn.",
          modelPath: "/models/president.glb",
          category: "suv",
          colors: [
            { name: "Đen Midnight", color: "#1a1a1a", image: "/images/president-black.png" },
            { name: "Đỏ Burgundy", color: "#800020", image: "/images/president-red.png" },
            { name: "Xám Titanium", color: "#5a5a5a", image: "/images/president-gray.png" },
          ],
          specifications: {
            engine: "V8 6.2L, 420 mã lực, 624 Nm",
            dimensions: "Dài x Rộng x Cao: 5146 x 1987 x 1760 mm",
            fuelType: "Xăng",
            safety: "11 túi khí, ABS, EBD, BA, ESC, TCS, HSA",
            price: "Từ 3.800.000.000 VNĐ",
          },
          features: [
            "Nội thất da cao cấp",
            "Hệ thống giải trí màn hình cảm ứng 12.3 inch",
            "Hệ thống âm thanh 13 loa",
            "Cửa sổ trời toàn cảnh",
            "Ghế massage, sưởi và làm mát",
            "Hệ thống hỗ trợ lái nâng cao",
            "Màn hình giải trí cho hàng ghế sau",
          ],
        },
      }

      // Get car data based on ID
      const carData = mockCars[id as string] || null

      // Simulate network delay
      setTimeout(() => {
        setCar(carData)
        setLoading(false)
      }, 1000)
    }

    fetchCar()
  }, [id])

  const handleColorChange = (index: number) => {
    setActiveColor(index)
    toast({
      title: `Màu: ${car?.colors[index].name}`,
      description: "Màu xe đã được cập nhật",
    })
  }

  const handleViewChange = (view: string) => {
    setActiveView(view)

    // Reset hotspots visibility when changing views
    setShowHotspots(true)

    let viewName = ""
    switch (view) {
      case "exterior":
        viewName = "Ngoại thất"
        break
      case "interior":
        viewName = "Nội thất"
        break
      case "engine":
        viewName = "Động cơ"
        break
    }

    toast({
      title: `Chế độ xem: ${viewName}`,
      description: "Nhấp vào các điểm đỏ để xem thông tin chi tiết",
    })
  }

  const handleHotspotsToggle = () => {
    setShowHotspots(!showHotspots)
    toast({
      title: showHotspots ? "Đã tắt điểm thông tin" : "Đã bật điểm thông tin",
      description: showHotspots ? "Các điểm thông tin đã được ẩn" : "Các điểm thông tin đã được hiển thị",
    })
  }

  const scrollToViewer = () => {
    if (viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-20 bg-gradient-to-b from-black to-zinc-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/models">
              <Button variant="outline" size="icon" className="border-zinc-700 text-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Skeleton className="h-8 w-48 bg-zinc-800" />
          </div>

          <div className="grid gap-8">
            <Skeleton className="h-[500px] w-full rounded-xl bg-zinc-800" />
            <div className="grid gap-4">
              <Skeleton className="h-10 w-full max-w-md bg-zinc-800" />
              <Skeleton className="h-4 w-full max-w-lg bg-zinc-800" />
              <Skeleton className="h-4 w-full max-w-lg bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="pt-24 pb-20 bg-gradient-to-b from-black to-zinc-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-white">Không tìm thấy thông tin xe</h2>
            <p className="text-zinc-400 mb-6">
              Rất tiếc, chúng tôi không thể tìm thấy thông tin về dòng xe bạn đang tìm kiếm.
            </p>
            <Link href="/models">
              <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 rounded-full px-8">
                Quay lại danh sách xe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-black to-zinc-900 min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="red" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Link href="/models">
              <Button variant="outline" size="icon" className="border-zinc-700 text-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{car.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-white hover:bg-red-600 hover:text-white hover:border-red-600"
              onClick={scrollToViewer}
            >
              <Maximize360 className="h-4 w-4 mr-2" />
              Xem 3D
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
            >
              Đặt Lịch Lái Thử
            </Button>
          </div>
        </div>

        {/* Car Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full text-sm font-medium text-white mb-4">
              {car.category === "suv" ? "SUV" : "Sedan"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{car.name}</h2>
            <p className="text-zinc-400 mb-6">{car.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-800/50 backdrop-blur-sm p-4 rounded-xl">
                <Gauge className="h-5 w-5 text-red-500 mb-2" />
                <p className="text-sm text-zinc-400">Động cơ</p>
                <p className="text-white font-medium">{car.specifications.engine.split(",")[0]}</p>
              </div>
              <div className="bg-zinc-800/50 backdrop-blur-sm p-4 rounded-xl">
                <Palette className="h-5 w-5 text-red-500 mb-2" />
                <p className="text-sm text-zinc-400">Màu sắc</p>
                <p className="text-white font-medium">{car.colors.length} màu</p>
              </div>
              <div className="bg-zinc-800/50 backdrop-blur-sm p-4 rounded-xl">
                <Lightbulb className="h-5 w-5 text-red-500 mb-2" />
                <p className="text-sm text-zinc-400">Tính năng</p>
                <p className="text-white font-medium">{car.features.length}+</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {car.colors.map((color, index) => (
                <button
                  key={color.name}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    activeColor === index ? "border-red-500 scale-110" : "border-zinc-700",
                  )}
                  style={{ backgroundColor: color.color }}
                  onClick={() => handleColorChange(index)}
                  title={color.name}
                />
              ))}
              <span className="text-zinc-400 text-sm ml-2 self-center">{car.colors[activeColor].name}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 rounded-full px-6"
                onClick={scrollToViewer}
              >
                Khám Phá Mô Hình 3D
              </Button>
              <Button variant="outline" className="border-zinc-700 text-white hover:bg-white/10 rounded-full px-6">
                Xem Thông Số Kỹ Thuật
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 bg-repeat"></div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeColor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-full"
              >
                <Image
                  src={car.colors[activeColor].image || "/placeholder.svg"}
                  alt={`${car.name} - ${car.colors[activeColor].name}`}
                  fill
                  className="object-contain p-6"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 3D Viewer Section */}
        <div ref={viewerRef} className="mb-16">
          <BackgroundGradient className="rounded-2xl p-1">
            <div className="bg-zinc-900 rounded-xl overflow-hidden">
              <div className="p-4 bg-zinc-800 flex flex-wrap gap-2 justify-between items-center">
                <h3 className="text-xl font-bold text-white">Mô Hình 3D Tương Tác</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeView === "exterior" ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "border-zinc-700",
                      activeView === "exterior"
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                        : "text-white hover:bg-white/10",
                    )}
                    onClick={() => handleViewChange("exterior")}
                  >
                    Ngoại thất
                  </Button>
                  <Button
                    variant={activeView === "interior" ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "border-zinc-700",
                      activeView === "interior"
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                        : "text-white hover:bg-white/10",
                    )}
                    onClick={() => handleViewChange("interior")}
                  >
                    Nội thất
                  </Button>
                  <Button
                    variant={activeView === "engine" ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "border-zinc-700",
                      activeView === "engine"
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                        : "text-white hover:bg-white/10",
                    )}
                    onClick={() => handleViewChange("engine")}
                  >
                    Động cơ
                  </Button>
                </div>
              </div>

              <div className="h-[500px] md:h-[600px] lg:h-[700px]">
                <CarViewer
                  modelPath={car.modelPath}
                  activeView={activeView}
                  activeColor={activeColor}
                  colorData={car.colors[activeColor]}
                  showHotspots={showHotspots}
                />
              </div>

              <div className="p-4 bg-zinc-800/50 flex flex-wrap gap-2 justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="border-zinc-700 text-white hover:bg-white/10">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Xoay 360°
                  </Button>
                  <Button
                    variant={showHotspots ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      showHotspots
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                        : "border-zinc-700 text-white hover:bg-white/10",
                    )}
                    onClick={handleHotspotsToggle}
                  >
                    {showHotspots ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Ẩn Điểm Thông Tin
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Hiện Điểm Thông Tin
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-zinc-700 text-white hover:bg-white/10">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-zinc-700 text-white hover:bg-white/10">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-zinc-700 text-white hover:bg-white/10">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </BackgroundGradient>
        </div>

        {/* Specifications Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-zinc-800 p-1 rounded-full">
            <TabsTrigger
              value="overview"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              Tổng Quan
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              Thông Số Kỹ Thuật
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              Tính Năng
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Giới Thiệu</h3>
                <p className="text-zinc-400 mb-6">{car.description}</p>

                <h3 className="text-xl font-bold text-white mb-4">Điểm Nổi Bật</h3>
                <ul className="space-y-2 mb-6">
                  {car.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-white mb-4">Thông Số Cơ Bản</h3>
                <div className="space-y-3">
                  <div className="flex justify-between pb-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Động cơ:</span>
                    <span className="text-white">{car.specifications.engine.split(",")[0]}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Kích thước:</span>
                    <span className="text-white">{car.specifications.dimensions.split(":")[1].trim()}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Nhiên liệu:</span>
                    <span className="text-white">{car.specifications.fuelType}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Giá dự kiến:</span>
                    <span className="text-white">{car.specifications.price}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="relative h-[300px]">
                  <Image
                    src={car.colors[activeColor].image || "/placeholder.svg"}
                    alt={car.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Màu Sắc</h3>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {car.colors.map((color, index) => (
                      <button
                        key={color.name}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          activeColor === index ? "border-red-500 scale-110" : "border-zinc-700",
                        )}
                        style={{ backgroundColor: color.color }}
                        onClick={() => handleColorChange(index)}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-medium">{car.colors[activeColor].name}</p>
                    <p className="text-zinc-400 text-sm">
                      Màu sắc thực tế có thể khác so với hình ảnh hiển thị. Vui lòng tham khảo tại đại lý.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-0">
            <CarSpecifications specifications={car.specifications} />
          </TabsContent>

          <TabsContent value="features" className="mt-0">
            <div className="bg-zinc-800/30 backdrop-blur-sm p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Tính Năng Nổi Bật</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center shrink-0">
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
                        className="text-white"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Cars */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Các Dòng Xe Khác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["vf8", "vf9", "vf6"]
              .filter((carId) => carId !== id)
              .slice(0, 3)
              .map((carId, index) => {
                const relatedCar = {
                  vf8: {
                    id: "vf8",
                    name: "VinFast VF8",
                    description: "SUV điện thông minh với công nghệ tiên tiến",
                    image: "/images/vf8-thumbnail.png",
                    category: "suv",
                  },
                  vf9: {
                    id: "vf9",
                    name: "VinFast VF9",
                    description: "SUV điện cỡ lớn với không gian rộng rãi",
                    image: "/images/vf9-thumbnail.png",
                    category: "suv",
                  },
                  vf6: {
                    id: "vf6",
                    name: "VinFast VF6",
                    description: "SUV điện cỡ nhỏ với thiết kế năng động",
                    image: "/images/vf6-thumbnail.png",
                    category: "suv",
                  },
                }[carId]

                return (
                  <motion.div
                    key={relatedCar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/models/${relatedCar.id}`}>
                      <Card className="overflow-hidden h-full bg-zinc-800/50 border-zinc-700 backdrop-blur-sm group hover:bg-zinc-800/80 transition-all duration-300">
                        <div className="relative h-40 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
                          <Image
                            src={relatedCar.image || "/placeholder.svg"}
                            alt={relatedCar.name}
                            fill
                            className="object-contain scale-90 group-hover:scale-100 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-white mb-1">{relatedCar.name}</h3>
                          <p className="text-zinc-400 text-sm">{relatedCar.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-zinc-800/30 backdrop-blur-sm border border-zinc-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Trải Nghiệm Thêm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href={`/ar-vr?car=${id}`}>
              <Button className="w-full h-auto py-6 bg-gradient-to-r from-red-600/20 to-red-500/20 hover:from-red-600 hover:to-red-500 text-white border border-red-500/30 hover:border-red-500 rounded-xl flex flex-col items-center gap-3 transition-all duration-300">
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
                  <path d="M2.5 19.5A2.5 2.5 0 0 1 5 17H19a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5H5a2.5 2.5 0 0 1-2.5-2.5v0Z" />
                  <path d="M12 17v-2" />
                  <path d="M7 14h.01" />
                  <path d="M17 14h.01" />
                  <path d="M2 10.5C2 5.25 12 5.25 12 1c0 4.25 10 4.25 10 9.5" />
                </svg>
                <span className="font-medium">Xem Trong AR/VR</span>
                <span className="text-sm text-zinc-300">Trải nghiệm xe trong không gian thực tế ảo</span>
              </Button>
            </Link>

            <Link href={`/payment?car=${id}`}>
              <Button className="w-full h-auto py-6 bg-gradient-to-r from-red-600/20 to-red-500/20 hover:from-red-600 hover:to-red-500 text-white border border-red-500/30 hover:border-red-500 rounded-xl flex flex-col items-center gap-3 transition-all duration-300">
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
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <span className="font-medium">Đặt Cọc Xe</span>
                <span className="text-sm text-zinc-300">Thanh toán đặt cọc để sở hữu xe</span>
              </Button>
            </Link>

            <Link href={`/contract?car=${id}`}>
              <Button className="w-full h-auto py-6 bg-gradient-to-r from-red-600/20 to-red-500/20 hover:from-red-600 hover:to-red-500 text-white border border-red-500/30 hover:border-red-500 rounded-xl flex flex-col items-center gap-3 transition-all duration-300">
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
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
                  <path d="M9 9h1" />
                  <path d="M9 13h6" />
                  <path d="M9 17h6" />
                </svg>
                <span className="font-medium">Ký Hợp Đồng</span>
                <span className="text-sm text-zinc-300">Ký kết hợp đồng mua xe trực tuyến</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
