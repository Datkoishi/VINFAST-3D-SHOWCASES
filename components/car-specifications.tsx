"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gauge, Shield, Fuel, Ruler, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

interface CarSpecificationsProps {
  specifications: {
    engine: string
    dimensions: string
    fuelType: string
    safety: string
    price: string
  }
}

export default function CarSpecifications({ specifications }: CarSpecificationsProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 bg-zinc-800 p-1 rounded-full">
          <TabsTrigger
            value="general"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value="engine"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            Động cơ
          </TabsTrigger>
          <TabsTrigger
            value="dimensions"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            Kích thước
          </TabsTrigger>
          <TabsTrigger
            value="safety"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            An toàn
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            Tính năng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50 hover:border-red-500/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Động cơ</CardTitle>
                  <Gauge className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-300">{specifications.engine}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50 hover:border-red-500/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Kích thước</CardTitle>
                  <Ruler className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-300">{specifications.dimensions}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50 hover:border-red-500/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Nhiên liệu</CardTitle>
                  <Fuel className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-300">{specifications.fuelType}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50 hover:border-red-500/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">An toàn</CardTitle>
                  <Shield className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-300">{specifications.safety}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50 hover:border-red-500/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Giá dự kiến</CardTitle>
                  <DollarSign className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-300">{specifications.price}</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="engine" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-white">Thông số động cơ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Loại động cơ:</span>
                    <span className="font-medium text-white">2.0L Turbo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Công suất tối đa:</span>
                    <span className="font-medium text-white">228 mã lực</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Mô-men xoắn cực đại:</span>
                    <span className="font-medium text-white">350 Nm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Hộp số:</span>
                    <span className="font-medium text-white">Tự động 8 cấp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Dẫn động:</span>
                    <span className="font-medium text-white">Cầu sau</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-white">Hiệu suất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tốc độ tối đa:</span>
                    <span className="font-medium text-white">235 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tăng tốc 0-100 km/h:</span>
                    <span className="font-medium text-white">6.5 giây</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="mt-0">
          <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50">
            <CardHeader>
              <CardTitle className="text-white">Kích thước</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Chiều dài:</span>
                  <span className="font-medium text-white">4,880 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Chiều rộng:</span>
                  <span className="font-medium text-white">1,910 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Chiều cao:</span>
                  <span className="font-medium text-white">1,435 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Khoảng cách giữa hai bánh trước:</span>
                  <span className="font-medium text-white">1,565 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Khoảng cách giữa hai bánh sau:</span>
                  <span className="font-medium text-white">1,565 mm</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-0">
          <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50">
            <CardHeader>
              <CardTitle className="text-white">An toàn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Phanh ABS:</span>
                  <span className="font-medium text-white">Có</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Hệ thống kiểm soát lực kéo:</span>
                  <span className="font-medium text-white">Có</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Đèn pha tự động:</span>
                  <span className="font-medium text-white">Có</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Đèn báo phanh:</span>
                  <span className="font-medium text-white">Có</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Đèn báo đèn:</span>
                  <span className="font-medium text-white">Có</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-0">
          <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50">
            <CardHeader>
              <CardTitle className="text-white">Tính năng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Hệ thống âm thanh:</span>
                  <span className="font-medium text-white">Bose Premium Sound System</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Hệ thống điều khiển giao thông:</span>
                  <span className="font-medium text-white">Có</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Camera lùi 360 độ:</span>
                  <span className="font-medium text-white">Có</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Hệ thống hỗ trợ lái tự động:</span>
                  <span className="font-medium text-white">Có</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Hệ thống an toàn:</span>
                  <span className="font-medium text-white">Có</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
