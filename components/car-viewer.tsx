"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Html, Sphere } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

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

interface Hotspot {
  position: [number, number, number]
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

  // Generate some sample hotspots based on the active view
  useEffect(() => {
    if (activeView === "exterior") {
      setHotspots([
        { position: [1, 0.5, 2], title: "Đèn LED", description: "Đèn pha LED tự động với thiết kế hiện đại" },
        { position: [-1, 0.5, 2], title: "Lưới tản nhiệt", description: "Lưới tản nhiệt đặc trưng của VinFast" },
        { position: [1.5, 0.5, 0], title: "Mâm xe", description: "Mâm hợp kim 19 inch với thiết kế thể thao" },
        { position: [0, 1, -2], title: "Đèn hậu", description: "Cụm đèn hậu LED với hiệu ứng 3D" },
      ])
    } else if (activeView === "interior") {
      setHotspots([
        {
          position: [0, 1, 0.5],
          title: "Màn hình trung tâm",
          description: "Màn hình cảm ứng 10.4 inch với hệ thống giải trí hiện đại",
        },
        {
          position: [0.5, 0.8, 0],
          title: "Vô lăng",
          description: "Vô lăng bọc da cao cấp với các nút điều khiển tích hợp",
        },
        { position: [-0.5, 0.5, 0], title: "Ghế ngồi", description: "Ghế da cao cấp với chức năng chỉnh điện" },
        { position: [0, 1, -0.5], title: "Cửa sổ trời", description: "Cửa sổ trời toàn cảnh với rèm che tự động" },
      ])
    } else if (activeView === "engine") {
      setHotspots([
        { position: [0, 0.5, 0], title: "Động cơ", description: "Động cơ 2.0L Turbo với công suất 228 mã lực" },
        { position: [0.5, 0.5, 0.5], title: "Hệ thống làm mát", description: "Hệ thống làm mát hiệu suất cao" },
        { position: [-0.5, 0.5, 0.5], title: "Ắc quy", description: "Ắc quy dung lượng cao với tuổi thọ bền bỉ" },
        { position: [0, 0.5, -0.5], title: "Hộp số", description: "Hộp số tự động 8 cấp mượt mà" },
      ])
    }
  }, [activeView])

  useFrame((state) => {
    if (model.current) {
      // Optional: Add subtle animation
      // model.current.rotation.y += 0.001

      // Adjust camera position based on active view
      if (activeView === "exterior") {
        // Default view - no special positioning
      } else if (activeView === "interior") {
        // Move camera inside the car
        // This is just a placeholder, you would need to adjust based on your actual model
        // state.camera.position.set(0, 1, 0)
        // state.camera.lookAt(0, 1, 1)
      } else if (activeView === "engine") {
        // Focus on engine area
        // state.camera.position.set(0, 1, 3)
        // state.camera.lookAt(0, 0, 0)
      }
    }
  })

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

  return (
    <>
      <primitive ref={model} object={clonedScene} scale={1} position={[0, -0.5, 0]} />

      {/* Hotspots */}
      {showHotspots &&
        hotspots.map((hotspot, index) => (
          <group key={index} position={hotspot.position}>
            <Sphere args={[0.05, 16, 16]} onClick={() => setActiveHotspot(index === activeHotspot ? null : index)}>
              <meshBasicMaterial color="#ef4444" />
            </Sphere>

            {activeHotspot === index && (
              <Html position={[0, 0.15, 0]} center style={{ pointerEvents: "none" }}>
                <div className="bg-zinc-900/90 backdrop-blur-sm p-3 rounded-lg border border-red-500 shadow-xl w-48">
                  <h4 className="text-white font-bold text-sm mb-1">{hotspot.title}</h4>
                  <p className="text-zinc-300 text-xs">{hotspot.description}</p>
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

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

export default function CarViewer({
  modelPath,
  activeView = "exterior",
  activeColor = 0,
  colorData,
  showHotspots = true,
}: CarViewerProps) {
  const isMobile = useMobile()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate model loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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

      <Canvas shadows dpr={[1, isMobile ? 1.5 : 2]}>
        <CarScene modelPath={modelPath} activeView={activeView} colorData={colorData} showHotspots={showHotspots} />
      </Canvas>

      <AnimatePresence>
        {showHotspots && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 text-xs text-white bg-zinc-800/80 backdrop-blur-sm p-2 rounded-md flex items-center gap-2"
          >
            <Info className="h-3 w-3 text-red-500" />
            <p>Nhấp vào các điểm đỏ để xem thông tin chi tiết</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
