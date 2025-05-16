"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Info, MaximizeIcon as Maximize360, RotateCcw } from "lucide-react"
import Link from "next/link"
import CarViewer from "@/components/car-viewer"
import CarSpecifications from "@/components/car-specifications"
import { Skeleton } from "@/components/ui/skeleton"

interface CarData {
  id: string
  name: string
  description: string
  modelPath: string
  specifications: {
    engine: string
    dimensions: string
    fuelType: string
    safety: string
    price: string
  }
}

export default function CarDetailPage() {
  const { id } = useParams()
  const [car, setCar] = useState<CarData | null>(null)
  const [loading, setLoading] = useState(true)

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
          description: "Mẫu sedan cao cấp với thiết kế sang trọng và hiện đại",
          modelPath: "/models/lux-2-0.glb", // This would be the path to your 3D model
          specifications: {
            engine: "2.0L Turbo, 228 mã lực, 350 Nm",
            dimensions: "Dài x Rộng x Cao: 4973 x 1900 x 1500 mm",
            fuelType: "Xăng",
            safety: "8 túi khí, ABS, EBD, BA, ESC, TCS, HSA",
            price: "Từ 999.000.000 VNĐ",
          },
        },
        vf8: {
          id: "vf8",
          name: "VinFast VF8",
          description: "SUV điện thông minh với công nghệ tiên tiến",
          modelPath: "/models/vf8.glb",
          specifications: {
            engine: "Động cơ điện, 402 mã lực, 620 Nm",
            dimensions: "Dài x Rộng x Cao: 4750 x 1900 x 1660 mm",
            fuelType: "Điện",
            safety: "11 túi khí, ABS, EBD, BA, ESC, TCS, HSA",
            price: "Từ 1.057.100.000 VNĐ",
          },
        },
        vf9: {
          id: "vf9",
          name: "VinFast VF9",
          description: "SUV điện cỡ lớn với không gian rộng rãi",
          modelPath: "/models/vf9.glb",
          specifications: {
            engine: "Động cơ điện, 402 mã lực, 620 Nm",
            dimensions: "Dài x Rộng x Cao: 5120 x 2000 x 1721 mm",
            fuelType: "Điện",
            safety: "11 túi khí, ABS, EBD, BA, ESC, TCS, HSA",
            price: "Từ 1.443.200.000 VNĐ",
          },
        },
        vf6: {
          id: "vf6",
          name: "VinFast VF6",
          description: "SUV điện cỡ nhỏ với thiết kế năng động",
          modelPath: "/models/vf6.glb",
          specifications: {
            engine: "Động cơ điện, 201 mã lực, 310 Nm",
            dimensions: "Dài x Rộng x Cao: 4238 x 1820 x 1594 mm",
            fuelType: "Điện",
            safety: "6 túi khí, ABS, EBD, BA, ESC, TCS, HSA",
            price: "Từ 675.000.000 VNĐ",
          },
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid gap-8">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <div className="grid gap-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin xe</h2>
          <p className="text-muted-foreground mb-6">
            Rất tiếc, chúng tôi không thể tìm thấy thông tin về dòng xe bạn đang tìm kiếm.
          </p>
          <Link href="/">
            <Button>Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">{car.name}</h1>
      </div>

      <Tabs defaultValue="3d-view" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="3d-view" className="flex items-center gap-2">
            <Maximize360 className="h-4 w-4" />
            <span>Xem 3D</span>
          </TabsTrigger>
          <TabsTrigger value="specifications" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Thông số kỹ thuật</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="3d-view" className="mt-0">
          <div className="bg-muted/30 rounded-xl overflow-hidden">
            <div className="h-[500px] md:h-[600px] lg:h-[700px]">
              <CarViewer modelPath={car.modelPath} />
            </div>

            <div className="p-4 bg-muted/50">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Xoay 360°
                </Button>
                <Button variant="outline" size="sm">
                  Ngoại thất
                </Button>
                <Button variant="outline" size="sm">
                  Nội thất
                </Button>
                <Button variant="outline" size="sm">
                  Động cơ
                </Button>
                <Button variant="outline" size="sm">
                  Gầm xe
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Mô tả</h2>
            <p className="text-muted-foreground">{car.description}</p>

            <Separator className="my-6" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Động cơ</h3>
                <p className="text-muted-foreground">{car.specifications.engine}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Kích thước</h3>
                <p className="text-muted-foreground">{car.specifications.dimensions}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Nhiên liệu</h3>
                <p className="text-muted-foreground">{car.specifications.fuelType}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Giá dự kiến</h3>
                <p className="text-muted-foreground">{car.specifications.price}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-0">
          <CarSpecifications specifications={car.specifications} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
