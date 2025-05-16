"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Palette, Lightbulb, Gauge, Share2, Download, Info, Bookmark } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Spotlight } from "@/components/ui/spotlight"
import dynamic from "next/dynamic"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Dynamically import the CarViewer component to avoid SSR issues with Three.js
const EnhancedCarViewer = dynamic(() => import("@/components/enhanced-car-viewer"), {
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
  technicalSpecs?: {
    category: string
    items: {
      name: string
      value: string
    }[]
  }[]
  comparisons?: {
    model: string
    image: string
    pros: string[]
    cons: string[]
  }[]
}

export default function CarDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [car, setCar] = useState<CarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeColor, setActiveColor] = useState(0)
  const [activeView, setActiveView] = useState("exterior")
  const [showHotspots, setShowHotspots] = useState(true)
  const [viewMode, setViewMode] = useState<"basic" | "advanced">("basic")
  const [compareMode, setCompareMode] = useState(false)
  const [selectedComparison, setSelectedComparison] = useState<string | null>(null)
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
            "Hệ thống hỗ trợ lái ADAS",
            "Hệ thống đèn pha LED Matrix",
            "Hệ thống treo thích ứng",
          ],
          technicalSpecs: [
            {
              category: "Hiệu suất",
              items: [
                { name: "Tăng tốc", value: "0-100 km/h: 7.1 giây" },
                { name: "Tốc độ tối đa", value: "235 km/h" },
                { name: "Tiêu thụ nhiên liệu", value: "7.8L/100km (hỗn hợp)" },
                { name: "Phạm vi hoạt động", value: "Khoảng 750 km (bình đầy)" },
              ],
            },
            {
              category: "Thiết kế",
              items: [{ name: "Dài x Rộng x Cao", value: "4973 x 1900 x 1500 mm" }],
            },
            {
              category: "Công nghệ",
              items: [
                {
                  name: "Hệ thống giải trí màn hình cảm ứng 10.4 inch",
                  value:
                    "Màn hình cảm ứng độ phân giải cao với hệ thống giải trí thông minh, hỗ trợ Apple CarPlay và Android Auto không dây.",
                },
                {
                  name: "Hệ thống âm thanh 13 loa",
                  value: "Hệ thống âm thanh vòm 13 loa công suất 560W, tích hợp công nghệ khử tiếng ồn chủ động.",
                },
              ],
            },
            {
              category: "An toàn",
              items: [
                {
                  name: "Hệ thống hỗ trợ lái ADAS",
                  value:
                    "Hệ thống hỗ trợ lái nâng cao với các tính năng như cảnh báo điểm mù, hỗ trợ giữ làn, cảnh báo va chạm và phanh tự động khẩn cấp.",
                },
                {
                  name: "Hệ thống đèn pha LED Matrix",
                  value:
                    "Đèn pha LED Matrix thông minh tự động điều chỉnh ánh sáng theo điều kiện giao thông, tăng tầm nhìn ban đêm.",
                },
              ],
            },
            {
              category: "Nội thất",
              items: [
                {
                  name: "Cửa sổ trời toàn cảnh",
                  value: "Cửa sổ trời toàn cảnh với kính cách nhiệt và chống tia UV, điều khiển bằng nút bấm một chạm.",
                },
                {
                  name: "Ghế da cao cấp",
                  value: "Ghế bọc da Nappa cao cấp với chức năng chỉnh điện 12 hướng, nhớ vị trí, sưởi và làm mát.",
                },
              ],
            },
          ],
          comparisons: [
            {
              model: "Mercedes C-Class",
              image: "/images/comparisons/mercedes-c-class.png",
              pros: ["Động cơ mạnh mẽ", "Nội thất sang trọng"],
              cons: ["Hơi tốn xăng"],
            },
            {
              model: "BMW 3-Series",
              image: "/images/comparisons/bmw-3-series.png",
              pros: ["Thiết kế đẹp"],
              cons: ["Hơi tốn xăng"],
            },
            {
              model: "Audi A4",
              image: "/images/comparisons/audi-a4.png",
              pros: ["Động cơ mạnh mẽ"],
              cons: ["Hơi tốn xăng"],
            },
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
            { name: "Xám Titanium", color: "#5a5a5a", image: "/images/vf8-gray.png" },
            { name: "Đỏ Crimson", color: "#a51d2d", image: "/images/vf8-red.png" },
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
            "Hệ thống pin tiên tiến",
            "Trợ lý ảo thông minh",
          ],
          technicalSpecs: [
            {
              category: "Hiệu suất",
              items: [
                { name: "Tăng tốc", value: "0-100 km/h: 5.9 giây" },
                { name: "Tốc độ tối đa", value: "200 km/h" },
                { name: "Phạm vi hoạt động", value: "Lên đến 420 km (WLTP)" },
              ],
            },
            {
              category: "Thiết kế",
              items: [{ name: "Dài x Rộng x Cao", value: "4750 x 1900 x 1660 mm" }],
            },
            {
              category: "Công nghệ",
              items: [
                {
                  name: "Màn hình cảm ứng trung tâm 15.6 inch",
                  value:
                    "Màn hình cảm ứng OLED 15.6 inch độ phân giải 4K với hệ thống giải trí thông minh, hỗ trợ Apple CarPlay và Android Auto không dây.",
                },
                {
                  name: "Cập nhật phần mềm từ xa (OTA)",
                  value:
                    "Cập nhật phần mềm từ xa (OTA) cho phép xe luôn được nâng cấp với các tính năng mới nhất mà không cần đến đại lý.",
                },
              ],
            },
            {
              category: "An toàn",
              items: [
                {
                  name: "Hệ thống hỗ trợ lái nâng cao",
                  value: "Hệ thống hỗ trợ lái nâng cao với 11 cảm biến ADAS, hỗ trợ lái tự động cấp độ 2+.",
                },
              ],
            },
            {
              category: "Nội thất",
              items: [
                {
                  name: "Cửa sổ trời toàn cảnh",
                  value:
                    "Cửa sổ trời toàn cảnh với kính cách nhiệt và chống tia UV, điều khiển bằng giọng nói và cử chỉ.",
                },
                {
                  name: "Ghế chỉnh điện có sưởi và làm mát",
                  value:
                    "Ghế bọc da thuần chay cao cấp với chức năng chỉnh điện 16 hướng, nhớ vị trí, sưởi, làm mát và massage 5 chế độ.",
                },
              ],
            },
          ],
          comparisons: [
            {
              model: "Tesla Model Y",
              image: "/images/comparisons/tesla-model-y.png",
              pros: ["Tiết kiệm chi phí", "Vận hành êm ái"],
              cons: ["Phạm vi hoạt động thấp hơn quảng cáo"],
            },
            {
              model: "Audi e-tron",
              image: "/images/comparisons/audi-e-tron.png",
              pros: ["Tiết kiệm chi phí"],
              cons: ["Phạm vi hoạt động thấp hơn quảng cáo"],
            },
            {
              model: "Mercedes EQC",
              image: "/images/comparisons/mercedes-eqc.png",
              pros: ["Tiết kiệm chi phí"],
              cons: ["Phạm vi hoạt động thấp hơn quảng cáo"],
            },
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
            { name: "Xám Graphite", color: "#5a5a5a", image: "/images/vf9-gray.png" },
            { name: "Đỏ Crimson", color: "#a51d2d", image: "/images/vf9-red.png" },
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
            "Hệ thống pin dung lượng lớn",
          ],
          technicalSpecs: [
            {
              category: "Hiệu suất",
              items: [
                { name: "Tăng tốc", value: "0-100 km/h: 6.3 giây" },
                { name: "Tốc độ tối đa", value: "200 km/h" },
                { name: "Phạm vi hoạt động", value: "Lên đến 438 km (WLTP)" },
              ],
            },
            {
              category: "Thiết kế",
              items: [{ name: "Dài x Rộng x Cao", value: "5120 x 2000 x 1721 mm" }],
            },
            {
              category: "Công nghệ",
              items: [
                {
                  name: "Màn hình cảm ứng trung tâm 15.6 inch",
                  value:
                    "Màn hình cảm ứng OLED 15.6 inch độ phân giải 4K với hệ thống giải trí thông minh, hỗ trợ Apple CarPlay và Android Auto không dây.",
                },
                {
                  name: "Cập nhật phần mềm từ xa (OTA)",
                  value:
                    "Cập nhật phần mềm từ xa (OTA) cho phép xe luôn được nâng cấp với các tính năng mới nhất mà không cần đến đại lý.",
                },
              ],
            },
            {
              category: "An toàn",
              items: [
                {
                  name: "Hệ thống hỗ trợ lái nâng cao",
                  value: "Hệ thống hỗ trợ lái nâng cao với 11 cảm biến ADAS, hỗ trợ lái tự động cấp độ 2+.",
                },
              ],
            },
            {
              category: "Nội thất",
              items: [
                {
                  name: "Cửa sổ trời toàn cảnh",
                  value:
                    "Cửa sổ trời toàn cảnh với kính cách nhiệt và chống tia UV, điều khiển bằng giọng nói và cử chỉ.",
                },
                {
                  name: "Ghế chỉnh điện có sưởi và làm mát",
                  value:
                    "Ghế bọc da thuần chay cao cấp với chức năng chỉnh điện 16 hướng, nhớ vị trí, sưởi, làm mát và massage 5 chế độ.",
                },
                {
                  name: "Hàng ghế thứ 3 rộng rãi",
                  value:
                    "Hàng ghế thứ 3 rộng rãi với không gian để chân thoải mái, phù hợp cho người lớn, có thể gập phẳng để tăng không gian chứa đồ.",
                },
              ],
            },
          ],
          comparisons: [
            {
              model: "Tesla Model X",
              image: "/images/comparisons/tesla-model-x.png",
              pros: ["Động cơ mạnh mẽ", "Nội thất sang trọng"],
              cons: ["Hơi tốn xăng"],
            },
            {
              model: "Audi e-tron SUV",
              image: "/images/comparisons/audi-e-tron-suv.png",
              pros: ["Động cơ mạnh mẽ"],
              cons: ["Hơi tốn xăng"],
            },
            {
              model: "Mercedes EQS SUV",
              image: "/images/comparisons/mercedes-eqs-suv.png",
              pros: ["Động cơ mạnh mẽ"],
              cons: ["Hơi tốn xăng"],
            },
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
            { name: "Đen Midnight", color: "#1a1a1a", image: "/images/vf6-black.png" },
            { name: "Xám Graphite", color: "#5a5a5a", image: "/images/vf6-gray.png" },
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
          technicalSpecs: [
            {
              category: "Hiệu suất",
              items: [
                { name: "Tăng tốc", value: "0-100 km/h: 6.8 giây" },
                { name: "Tốc độ tối đa", value: "175 km/h" },
                { name: "Phạm vi hoạt động", value: "Lên đến 381 km (WLTP)" },
              ],
            },
            {
              category: "Thiết kế",
              items: [{ name: "Dài x Rộng x Cao", value: "4238 x 1820 x 1594 mm" }],
            },
            {
              category: "Công nghệ",
              items: [
                {
                  name: "Màn hình cảm ứng trung tâm 12.9 inch",
                  value:
                    "Màn hình cảm ứng 12.9 inch độ phân giải cao với hệ thống giải trí thông minh, hỗ trợ Apple CarPlay và Android Auto không dây.",
                },
                {
                  name: "Cập nhật phần mềm từ xa (OTA)",
                  value:
                    "Cập nhật phần mềm từ xa (OTA) cho phép xe luôn được nâng cấp với các tính năng mới nhất mà không cần đến đại lý.",
                },
              ],
            },
            {
              category: "An toàn",
              items: [
                {
                  name: "Hệ thống hỗ trợ lái cơ bản",
                  value:
                    "Hệ thống hỗ trợ lái cơ bản với các tính năng như cảnh báo điểm mù, hỗ trợ giữ làn và cảnh báo va chạm.",
                },
              ],
            },
            {
              category: "Nội thất",
              items: [
                {
                  name: "Cửa sổ trời",
                  value: "Cửa sổ trời với kính cách nhiệt và chống tia UV, điều khiển bằng nút bấm một chạm.",
                },
                {
                  name: "Ghế bọc da tổng hợp",
                  value: "Ghế bọc da tổng hợp cao cấp với chức năng chỉnh điện 6 hướng cho ghế lái.",
                },
              ],
            },
          ],
          comparisons: [
            {
              model: "Hyundai Kona Electric",
              image: "/images/comparisons/hyundai-kona-electric.png",
              pros: ["Tiết kiệm chi phí"],
              cons: ["Phạm vi hoạt động thấp hơn quảng cáo"],
            },
            {
              model: "MG ZS EV",
              image: "/images/comparisons/mg-zs-ev.png",
              pros: ["Tiết kiệm chi phí"],
              cons: ["Phạm vi hoạt động thấp hơn quảng cáo"],
            },
            {
              model: "Kia Niro EV",
              image: "/images/comparisons/kia-niro-ev.png",
              pros: ["Tiết kiệm chi phí"],
              cons: ["Phạm vi hoạt động thấp hơn quảng cáo"],
            },
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
            { name: "Trắng Ngọc Trai", color: "#f5f5f5", image: "/images/president-white.png" },
            { name: "Xanh Sapphire", color: "#0f3b57", image: "/images/president-blue.png" },
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
          technicalSpecs: [
            {
              category: "Hiệu suất",
              items: [
                { name: "Tăng tốc", value: "0-100 km/h: 6.8 giây" },
                { name: "Tốc độ tối đa", value: "300 km/h" },
                { name: "Phạm vi hoạt động", value: "Khoảng 650 km (bình đầy)" },
              ],
            },
            {
              category: "Thiết kế",
              items: [{ name: "Dài x Rộng x Cao", value: "5146 x 1987 x 1760 mm" }],
            },
            {
              category: "Công nghệ",
              items: [
                {
                  name: "Hệ thống giải trí màn hình cảm ứng 12.3 inch",
                  value:
                    "Màn hình cảm ứng 12.3 inch độ phân giải cao với hệ thống giải trí thông minh, hỗ trợ Apple CarPlay và Android Auto không dây.",
                },
              ],
            },
            {
              category: "An toàn",
              items: [
                {
                  name: "Hệ thống hỗ trợ lái nâng cao",
                  value:
                    "Hệ thống hỗ trợ lái nâng cao với các tính năng như cảnh báo điểm mù, hỗ trợ giữ làn, cảnh báo va chạm và phanh tự động khẩn cấp.",
                },
              ],
            },
            {
              category: "Nội thất",
              items: [
                {
                  name: "Nội thất da cao cấp",
                  value: "Nội thất bọc da Nappa cao cấp với các chi tiết ốp gỗ và carbon, được chế tác thủ công.",
                },
                {
                  name: "Ghế massage, sưởi và làm mát",
                  value:
                    "Ghế bọc da Nappa cao cấp với chức năng chỉnh điện 18 hướng, nhớ vị trí, sưởi, làm mát và massage 7 chế độ.",
                },
              ],
            },
          ],
          comparisons: [
            {
              model: "Lexus LX",
              image: "/images/comparisons/lexus-lx.png",
              pros: ["Động cơ mạnh mẽ", "Nội thất sang trọng"],
              cons: ["Hơi tốn xăng"],
            },
            {
              model: "Mercedes GLS",
              image: "/images/comparisons/mercedes-gls.png",
              pros: ["Động cơ mạnh mẽ"],
              cons: ["Hơi tốn xăng"],
            },
            {
              model: "BMW X7",
              image: "/images/comparisons/bmw-x7.png",
              pros: ["Động cơ mạnh mẽ"],
              cons: ["Hơi tốn xăng"],
            },
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

    // Lắng nghe sự kiện thay đổi chế độ xem từ CarViewer
    const handleViewChange = (e: CustomEvent) => {
      setActiveView(e.detail)
    }

    document.addEventListener("viewChange", handleViewChange as EventListener)

    return () => {
      document.removeEventListener("viewChange", handleViewChange as EventListener)
    }
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
    toast({
      title: `Chế độ xem: ${view === "exterior" ? "Ngoại thất" : view === "interior" ? "Nội thất" : "Động cơ"}`,
      description: "Chế độ xem đã được cập nhật",
    })
  }

  const handleHotspotsToggle = () => {
    setShowHotspots(!showHotspots)
    toast({
      title: showHotspots ? "Đã tắt điểm thông tin" : "Đã bật điểm thông tin",
      description: showHotspots ? "Các điểm thông tin đã được ẩn" : "Các điểm thông tin đã được hiển thị",
    })
  }

  const handleViewModeToggle = () => {
    setViewMode(viewMode === "basic" ? "advanced" : "basic")
    toast({
      title: viewMode === "basic" ? "Đã chuyển sang chế độ nâng cao" : "Đã chuyển sang chế độ cơ bản",
      description: viewMode === "basic" ? "Chế độ xem nâng cao đã được bật" : "Chế độ xem cơ bản đã được bật",
    })
  }

  const handleCompareModeToggle = () => {
    setCompareMode(!compareMode)
    toast({
      title: compareMode ? "Đã tắt chế độ so sánh" : "Đã bật chế độ so sánh",
      description: compareMode ? "Chế độ so sánh đã được tắt" : "Chế độ so sánh đã được bật",
    })
  }

  const handleFavoriteToggle = () => {
    toast({
      title: "Đánh dấu yêu thích",
      description: "Tính năng đánh dấu yêu thích đang được phát triển. Sẽ sớm ra mắt!",
    })
  }

  const handleShare = () => {
    toast({
      title: "Chia sẻ",
      description: "Đường dẫn đã được sao chép vào clipboard",
    })
  }

  const handleDownload = () => {
    toast({
      title: "Tải xuống",
      description: "Đang tải xuống thông tin xe...",
    })

    setTimeout(() => {
      toast({
        title: "Tải xuống hoàn tất",
        description: "Thông tin xe đã được tải xuống",
      })
    }, 2000)
  }

  const handleARView = () => {
    toast({
      title: "Xem trong AR",
      description: "Đang mở chế độ xem AR...",
    })

    setTimeout(() => {
      toast({
        title: "Chế độ AR",
        description: "Tính năng AR đang được phát triển. Sẽ sớm ra mắt!",
      })
    }, 2000)
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
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Link href="/models">
              <Button variant="outline" size="icon" className="border-zinc-700 text-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{car.name}</h1>
                <Badge variant="outline" className="border-red-500 text-red-500">
                  {car.category === "suv" ? "SUV" : "Sedan"}
                </Badge>
              </div>
              <p className="text-zinc-400 text-sm">
                {car.specifications.price} | {car.specifications.engine.split(",")[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-zinc-700 text-white hover:bg-white/10"
                    onClick={handleFavoriteToggle}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Đánh dấu yêu thích</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-zinc-700 text-white hover:bg-white/10"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chia sẻ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-zinc-700 text-white hover:bg-white/10"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tải xuống thông tin</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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

            <div className="mb-6">
              <p className="text-white font-medium mb-3">Chọn màu sắc:</p>
              <div className="flex flex-wrap gap-3 mb-2">
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
              </div>
              <p className="text-zinc-400 text-sm">{car.colors[activeColor].name}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 rounded-full px-6"
                onClick={scrollToViewer}
              >
                Khám Phá Mô Hình 3D
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-zinc-700 text-white hover:bg-white/10 rounded-full px-6">
                    <Info className="h-4 w-4 mr-2" />
                    Thông Số Kỹ Thuật
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Thông Số Kỹ Thuật - {car.name}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Chi tiết thông số kỹ thuật của {car.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {car.technicalSpecs?.map((spec, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="font-medium text-white">{spec.category}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {spec.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="space-y-1">
                              <p className="text-xs text-zinc-400">{item.name}</p>
                              <p className="text-sm text-zinc-300">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          <div className="relative">
            <EnhancedCarViewer
              ref={viewerRef}
              modelPath={car.modelPath}
              activeColor={car.colors[activeColor].color}
              activeView={activeView}
              showHotspots={showHotspots}
              viewMode={viewMode}
              compareMode={compareMode}
              selectedComparison={selectedComparison}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
