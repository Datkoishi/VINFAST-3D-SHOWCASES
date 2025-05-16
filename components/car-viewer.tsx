"use client"

import React, { useEffect, useRef, useState, Suspense } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Html, Line } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import dynamic from "next/dynamic"

// Custom ErrorBoundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  FallbackComponent: React.ComponentType
}> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Lỗi WebGL:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <this.props.FallbackComponent />
    }

    return this.props.children
  }
}

// Import Canvas với noSSR để tránh lỗi khi render trên server
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
})

// Fallback model for testing
const DUCK_MODEL_PATH = "/assets/3d/duck.glb"

interface CarViewerProps {
  modelPath: string
  activeView: string
  activeColor: number
  colorData: {
    name: string
    color: string
  }
  showHotspots: boolean
}

// Thay đổi phần khai báo interface Hotspot để thêm thuộc tính offset
interface Hotspot {
  position: [number, number, number]
  surfacePosition: [number, number, number]
  title: string
  description: string
}

function Model({
  modelPath,
  activeView,
  colorData,
  showHotspots,
  onPartClick,
}: {
  modelPath: string
  activeView: string
  colorData: {
    name: string
    color: string
  }
  showHotspots: boolean
  onPartClick: (part: string) => void
}) {
  // For demo purposes, we'll use the duck model if the car model isn't available
  const actualModelPath = modelPath || DUCK_MODEL_PATH
  const { scene } = useGLTF(actualModelPath)
  const model = useRef<THREE.Group>(null)
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const [time, setTime] = useState(0)

  // Cập nhật thời gian cho hiệu ứng nhấp nháy
  useFrame(() => {
    setTime((state) => state + 0.01)
  })

  // Thay đổi phần useEffect để cập nhật vị trí các điểm đỏ
  useEffect(() => {
    if (activeView === "exterior") {
      setHotspots([
        // Điểm đỏ cho đèn pha - vị trí điểm nổi và vị trí thực tế trên bề mặt xe
        {
          position: [0.8, 0.52, 1.8], // Đã hạ thấp xuống
          surfacePosition: [0.8, 0.5, 1.8], // Vị trí thực tế trên bề mặt xe
          title: "Đèn pha LED",
          description:
            "Đèn pha LED ma trận thích ứng với thiết kế hiện đại, tự động điều chỉnh theo điều kiện ánh sáng",
        },
        // Điểm đỏ cho lưới tản nhiệt
        {
          position: [-0.8, 0.52, 1.8], // Đã hạ thấp xuống
          surfacePosition: [-0.8, 0.5, 1.8],
          title: "Lưới tản nhiệt",
          description: "Lưới tản nhiệt đặc trưng của VinFast với thiết kế V-shape độc đáo",
        },
        // Điểm đỏ cho mâm xe
        {
          position: [1.2, 0.32, 0], // Đã hạ thấp xuống
          surfacePosition: [1.2, 0.3, 0],
          title: "Mâm xe hợp kim",
          description: "Mâm hợp kim 19 inch với thiết kế thể thao, tăng tính khí động học",
        },
        // Điểm đỏ cho đèn hậu
        {
          position: [0, 0.72, -1.8], // Đã hạ thấp xuống
          surfacePosition: [0, 0.7, -1.8],
          title: "Đèn hậu LED",
          description: "Cụm đèn hậu LED với hiệu ứng 3D, tăng khả năng nhận diện và an toàn",
        },
        // Điểm đỏ cho cửa sổ trời
        {
          position: [0, 1.02, 0], // Đã hạ thấp xuống
          surfacePosition: [0, 1.0, 0],
          title: "Cửa sổ trời toàn cảnh",
          description: "Cửa sổ trời toàn cảnh với khả năng chống tia UV, tạo không gian thoáng đãng",
        },
      ])
    } else if (activeView === "interior") {
      setHotspots([
        // Điểm đỏ cho màn hình trung tâm
        {
          position: [0, 0.82, 0.3], // Đã hạ thấp xuống
          surfacePosition: [0, 0.8, 0.3],
          title: "Màn hình trung tâm",
          description:
            "Màn hình cảm ứng 10.4 inch với hệ thống giải trí hiện đại, kết nối Apple CarPlay và Android Auto",
        },
        // Điểm đỏ cho vô lăng
        {
          position: [0.3, 0.62, 0.2], // Đã hạ thấp xuống
          surfacePosition: [0.3, 0.6, 0.2],
          title: "Vô lăng đa chức n��ng",
          description: "Vô lăng bọc da cao cấp với các nút điều khiển tích hợp, hỗ trợ đàm thoại rảnh tay",
        },
        // Điểm đỏ cho ghế ngồi
        {
          position: [-0.3, 0.42, 0], // Đã hạ thấp xuống
          surfacePosition: [-0.3, 0.4, 0],
          title: "Ghế da cao cấp",
          description: "Ghế da cao cấp với chức năng chỉnh điện, nhớ vị trí, sưởi và làm mát",
        },
        // Điểm đỏ cho cửa sổ trời
        {
          position: [0, 1.02, -0.3], // Đã hạ thấp xuống
          surfacePosition: [0, 1.0, -0.3],
          title: "Cửa sổ trời toàn cảnh",
          description: "Cửa sổ trời toàn cảnh với rèm che tự động, tạo không gian thoáng đãng",
        },
      ])
    } else if (activeView === "engine") {
      setHotspots([
        // Điểm đỏ cho động cơ
        {
          position: [0, 0.42, 0.5], // Đã hạ thấp xuống
          surfacePosition: [0, 0.4, 0.5],
          title: "Động cơ 2.0L Turbo",
          description: "Động cơ 2.0L Turbo với công suất 228 mã lực, mô-men xoắn 350 Nm, tiết kiệm nhiên liệu",
        },
        // Điểm đỏ cho hệ thống làm mát
        {
          position: [0.5, 0.42, 0.3], // Đã hạ thấp xuống
          surfacePosition: [0.5, 0.4, 0.3],
          title: "Hệ thống làm mát",
          description: "Hệ thống làm mát hiệu suất cao với khả năng duy trì nhiệt độ động cơ ổn định",
        },
        // Điểm đỏ cho ắc quy
        {
          position: [-0.5, 0.42, 0.3], // Đã hạ thấp xuống
          surfacePosition: [-0.5, 0.4, 0.3],
          title: "Ắc quy dung lượng cao",
          description: "Ắc quy dung lượng cao với tuổi thọ bền bỉ, hỗ trợ khởi động nhanh trong mọi điều kiện",
        },
        // Điểm đỏ cho hộp số
        {
          position: [0, 0.42, -0.3], // Đã hạ thấp xuống
          surfacePosition: [0, 0.4, -0.3],
          title: "Hộp số tự động 8 cấp",
          description: "Hộp số tự động 8 cấp mượt mà, chuyển số nhanh và tiết kiệm nhiên liệu",
        },
      ])
    }
  }, [activeView])

  // Clone the scene to avoid modifying the original
  const clonedScene = scene.clone()

  // Apply color to the car body
  clonedScene.traverse((object: any) => {
    if (object.isMesh) {
      // Store original material for hover effect
      object.userData.originalMaterial = object.material.clone()

      // Apply car color to body parts (in a real app, you would identify body parts by name or material)
      if (object.name.includes("body") || object.name.includes("exterior")) {
        const newMaterial = object.material.clone()
        newMaterial.color = new THREE.Color(colorData.color)
        object.material = newMaterial
      }

      // Add event handlers
      object.onClick = () => {
        onPartClick(object.name || "Phần không xác định")
      }
    }
  })

  // Thay đổi phần render các điểm đỏ để điều chỉnh kích thước và hiệu ứng
  return (
    <>
      <primitive ref={model} object={clonedScene} scale={1} position={[0, -0.5, 0]} />

      {/* Hotspots - Điểm thông tin */}
      {showHotspots &&
        hotspots.map((hotspot, index) => (
          <group key={index}>
            {/* Điểm đỏ chính */}
            <mesh position={hotspot.position} onClick={() => setActiveHotspot(index === activeHotspot ? null : index)}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>

            {/* Hiệu ứng nhấp nháy */}
            <mesh position={hotspot.position}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color="#ef4444" transparent={true} opacity={0.3 + Math.sin(time * 5) * 0.2} />
            </mesh>

            {/* Đường kết nối từ điểm đỏ đến bề mặt xe */}
            <Line
              points={[hotspot.position, hotspot.surfacePosition]}
              color="#ef4444"
              lineWidth={1}
              dashed={false}
              opacity={0.7}
            />

            {/* Điểm kết nối trên bề mặt xe */}
            <mesh position={hotspot.surfacePosition}>
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>

            {/* Thông tin chi tiết khi nhấp vào */}
            {activeHotspot === index && (
              <Html
                position={[hotspot.position[0], hotspot.position[1] + 0.15, hotspot.position[2]]}
                center
                style={{ pointerEvents: "none" }}
              >
                <div className="bg-zinc-900/90 backdrop-blur-sm p-4 rounded-lg border-2 border-red-500 shadow-xl w-64">
                  <h4 className="text-white font-bold text-base mb-2">{hotspot.title}</h4>
                  <p className="text-zinc-300 text-sm">{hotspot.description}</p>
                </div>
              </Html>
            )}
          </group>
        ))}
    </>
  )
}

function CarScene({
  modelPath,
  activeView,
  colorData,
  showHotspots,
}: {
  modelPath: string
  activeView: string
  colorData: {
    name: string
    color: string
  }
  showHotspots: boolean
}) {
  const { toast } = useToast()
  const { camera } = useThree()
  const controls = useRef<any>(null)

  const handlePartClick = (partName: string) => {
    toast({
      title: `Phần: ${partName}`,
      description: "Nhấp vào các bộ phận khác để xem thêm thông tin chi tiết.",
    })
  }

  const handleZoomIn = () => {
    if (camera && controls.current) {
      controls.current.dollyIn(1.2)
      controls.current.update()
    }
  }

  const handleZoomOut = () => {
    if (camera && controls.current) {
      controls.current.dollyOut(1.2)
      controls.current.update()
    }
  }

  const handleReset = () => {
    if (controls.current) {
      controls.current.reset()
    }
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 2, 5]} />
      <ambientLight intensity={0.7} /> {/* Tăng cường độ ánh sáng */}
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.7} />
      <Suspense
        fallback={
          <Html center>
            <div className="flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-red-500 animate-spin"></div>
              <p className="mt-4 text-white">Đang tải mô hình 3D...</p>
            </div>
          </Html>
        }
      >
        <Model
          modelPath={modelPath}
          activeView={activeView}
          colorData={colorData}
          showHotspots={showHotspots}
          onPartClick={handlePartClick}
        />
      </Suspense>
      <OrbitControls
        ref={controls}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
      <Environment preset="city" />
      <Html position={[0, 0, 0]} center style={{ pointerEvents: "none" }}>
        <div className="absolute bottom-4 right-4 flex flex-col gap-2" style={{ pointerEvents: "auto" }}>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomIn}
            className="bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700"
          >
            <ZoomIn className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomOut}
            className="bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700"
          >
            <ZoomOut className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleReset}
            className="bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700"
          >
            <RotateCw className="h-4 w-4 text-white" />
          </Button>
        </div>
      </Html>
    </>
  )
}

function WebGLErrorFallback() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-zinc-900 rounded-xl">
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
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
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Không thể tải trình xem 3D</h3>
        <p className="text-zinc-400 mb-4">
          Trình duyệt của bạn không hỗ trợ WebGL hoặc đã bị tắt. Vui lòng thử trình duyệt khác hoặc kiểm tra cài đặt.
        </p>
        <a
          href="https://get.webgl.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 hover:text-red-400 underline"
        >
          Tìm hiểu thêm về WebGL
        </a>
      </div>
    </div>
  )
}

export default function CarViewer({
  modelPath,
  activeView = "exterior",
  activeColor = 0,
  colorData,
  showHotspots = true,
}: CarViewerProps) {
  const isMobile = useMobile()
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasWebGLError, setHasWebGLError] = useState(false)

  useEffect(() => {
    // Kiểm tra WebGL support
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")

    if (!gl) {
      setHasWebGLError(true)
    }

    // Simulate model loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (hasWebGLError) {
    return <WebGLErrorFallback />
  }

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-red-500 animate-spin"></div>
            <p className="mt-4 text-white">Đang tải mô hình 3D...</p>
          </div>
        </div>
      )}

      <ErrorBoundary FallbackComponent={WebGLErrorFallback}>
        <Canvas
          shadows
          dpr={[1, isMobile ? 1.5 : 2]}
          onCreated={({ gl }) => {
            // Cấu hình thêm cho WebGL renderer
            gl.setClearColor("#000000", 0)
            gl.physicallyCorrectLights = true
          }}
        >
          <CarScene modelPath={modelPath} activeView={activeView} colorData={colorData} showHotspots={showHotspots} />
        </Canvas>
      </ErrorBoundary>

      <AnimatePresence>
        {showHotspots && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 text-sm text-white bg-zinc-800/80 backdrop-blur-sm p-3 rounded-md flex items-center gap-2"
          >
            <Info className="h-4 w-4 text-red-500" />
            <p>Nhấp vào các điểm đỏ để xem thông tin chi tiết</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
