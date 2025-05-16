"use client"

import React, { useEffect, useRef, useState, Suspense, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  useGLTF,
  Html,
  Sphere,
  useAnimations,
  Text,
  Float,
  MeshReflectorMaterial,
  Sparkles,
  SpotLight,
  Stage,
  CameraShake,
  PerformanceMonitor,
  Stats,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Maximize,
  Smartphone,
  Compass,
  Share2,
  Download,
  Lightbulb,
  Gauge,
  Palette,
  X,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import dynamic from "next/dynamic"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Import Canvas với noSSR để tránh lỗi khi render trên server
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
})

// Fallback model for testing
const DUCK_MODEL_PATH = "/assets/3d/duck.glb"

interface EnhancedCarViewerProps {
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
  icon?: React.ReactNode
  category: string
  detailImage?: string
}

interface PartInfo {
  name: string
  description: string
  specs?: Record<string, string>
  image?: string
}

// Tạo hiệu ứng phát sáng cho hotspot
function HotspotGlow({ position, color = "#ef4444", pulse = true }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current && pulse) {
      meshRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2) * 0.1)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  )
}

// Tạo hiệu ứng tia sáng từ hotspot
function HotspotBeam({ position, color = "#ef4444" }) {
  return (
    <group position={position}>
      <Sparkles count={20} scale={0.5} size={0.5} speed={0.3} color={color} />
    </group>
  )
}

// Tạo sàn phản chiếu
function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#101010"
        metalness={0.8}
      />
    </mesh>
  )
}

function Model({
  modelPath,
  activeView,
  colorData,
  showHotspots,
  explodeView,
  highlightParts,
  onPartClick,
  quality,
}: {
  modelPath: string
  activeView: string
  colorData: {
    name: string
    color: string
  }
  showHotspots: boolean
  explodeView: number
  highlightParts: boolean
  onPartClick: (part: PartInfo) => void
  quality: "low" | "medium" | "high"
}) {
  // For demo purposes, we'll use the duck model if the car model isn't available
  const actualModelPath = modelPath || DUCK_MODEL_PATH
  const { scene, animations } = useGLTF(actualModelPath)
  const { actions } = useAnimations(animations, scene)
  const model = useRef<THREE.Group>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [partsInfo, setPartsInfo] = useState<Record<string, PartInfo>>({})

  // Tạo danh sách thông tin chi tiết về các bộ phận
  useEffect(() => {
    setPartsInfo({
      body: {
        name: "Thân xe",
        description: "Thân xe được làm từ thép cường lực, thiết kế khí động học hiện đại",
        specs: {
          "Vật liệu": "Thép cường lực",
          "Hệ số cản gió": "0.32 Cd",
          "Trọng lượng": "1,450 kg",
        },
        image: "/images/car-body-detail.png",
      },
      headlight: {
        name: "Đèn pha LED",
        description: "Hệ thống đèn pha LED thông minh với tính năng tự động điều chỉnh",
        specs: {
          "Công nghệ": "LED Matrix",
          "Tự động điều chỉnh": "Có",
          "Chế độ đèn": "Gần, xa, tự động",
        },
        image: "/images/headlight-detail.png",
      },
      wheel: {
        name: "Mâm xe",
        description: "Mâm xe hợp kim nhôm 19 inch với thiết kế thể thao",
        specs: {
          "Kích thước": "19 inch",
          "Vật liệu": "Hợp kim nhôm",
          "Lốp xe": "Continental 245/45 R19",
        },
        image: "/images/wheel-detail.png",
      },
      engine: {
        name: "Động cơ",
        description: "Động cơ 2.0L Turbo mạnh mẽ với công suất 228 mã lực",
        specs: {
          "Dung tích": "2.0L Turbo",
          "Công suất": "228 mã lực",
          "Mô-men xoắn": "350 Nm",
          "Tăng tốc 0-100km/h": "7.1 giây",
        },
        image: "/images/engine-detail.png",
      },
      interior: {
        name: "Nội thất",
        description: "Nội thất sang trọng với ghế da cao cấp và hệ thống giải trí hiện đại",
        specs: {
          "Chất liệu ghế": "Da Nappa",
          "Màn hình giải trí": "10.4 inch",
          "Hệ thống âm thanh": "13 loa Bose",
          "Điều hòa": "2 vùng độc lập",
        },
        image: "/images/interior-detail.png",
      },
      dashboard: {
        name: "Bảng điều khiển",
        description: "Bảng điều khiển kỹ thuật số với màn hình cảm ứng 10.4 inch",
        specs: {
          "Màn hình": "10.4 inch cảm ứng",
          "Kết nối": "Apple CarPlay, Android Auto",
          "Điều khiển": "Cảm ứng và giọng nói",
          "Hệ điều hành": "VinFast OS",
        },
        image: "/images/dashboard-detail.png",
      },
      battery: {
        name: "Hệ thống pin",
        description: "Pin lithium-ion dung lượng cao với khả năng sạc nhanh",
        specs: {
          "Dung lượng": "70 kWh",
          "Phạm vi hoạt động": "420 km",
          "Thời gian sạc nhanh": "30 phút (10-80%)",
          "Tuổi thọ pin": "8 năm hoặc 160,000 km",
        },
        image: "/images/battery-detail.png",
      },
      suspension: {
        name: "Hệ thống treo",
        description: "Hệ thống treo độc lập với khả năng điều chỉnh theo chế độ lái",
        specs: {
          Loại: "Treo độc lập đa liên kết",
          "Điều chỉnh": "Điện tử theo chế độ lái",
          "Chế độ lái": "Eco, Comfort, Sport, Individual",
        },
        image: "/images/suspension-detail.png",
      },
    })
  }, [])

  // Tạo hotspots dựa trên chế độ xem
  useEffect(() => {
    if (activeView === "exterior") {
      setHotspots([
        {
          position: [1, 0.5, 2],
          title: "Đèn pha LED Matrix",
          description:
            "Đèn pha LED Matrix thông minh tự động điều chỉnh ánh sáng, tăng tầm nhìn ban đêm và tự động thay đổi chế độ chiếu sáng khi có xe đi ngược chiều.",
          icon: <Lightbulb className="h-4 w-4 text-red-500" />,
          category: "lighting",
          detailImage: "/images/headlight-detail.png",
        },
        {
          position: [-1, 0.5, 2],
          title: "Lưới tản nhiệt đặc trưng",
          description:
            "Lưới tản nhiệt đặc trưng của VinFast với thiết kế V-shape tinh tế, tạo nên nhận diện thương hiệu độc đáo và cải thiện khí động học.",
          icon: <Palette className="h-4 w-4 text-red-500" />,
          category: "design",
          detailImage: "/images/grille-detail.png",
        },
        {
          position: [1.5, 0.5, 0],
          title: "Mâm xe hợp kim 19 inch",
          description:
            "Mâm xe hợp kim nhôm 19 inch với thiết kế 5 chấu kép thể thao, giảm trọng lượng và tăng khả năng tản nhiệt cho hệ thống phanh.",
          icon: <Compass className="h-4 w-4 text-red-500" />,
          category: "wheels",
          detailImage: "/images/wheel-detail.png",
        },
        {
          position: [0, 1, -2],
          title: "Cụm đèn hậu LED 3D",
          description:
            "Cụm đèn hậu LED với hiệu ứng 3D độc đáo, tăng khả năng nhận diện và cảnh báo cho các phương tiện phía sau, đồng thời tiết kiệm năng lượng.",
          icon: <Lightbulb className="h-4 w-4 text-red-500" />,
          category: "lighting",
          detailImage: "/images/taillight-detail.png",
        },
        {
          position: [0, 0.3, 0],
          title: "Hệ thống treo thích ứng",
          description:
            "Hệ thống treo thích ứng với khả năng điều chỉnh độ cứng theo điều kiện đường và chế độ lái, mang lại cảm giác lái êm ái hoặc thể thao tùy chọn.",
          icon: <Gauge className="h-4 w-4 text-red-500" />,
          category: "performance",
          detailImage: "/images/suspension-detail.png",
        },
      ])
    } else if (activeView === "interior") {
      setHotspots([
        {
          position: [0, 1, 0.5],
          title: "Màn hình cảm ứng trung tâm",
          description:
            "Màn hình cảm ứng 10.4 inch độ phân giải cao với hệ thống giải trí hiện đại, hỗ trợ Apple CarPlay và Android Auto, điều khiển bằng giọng nói và cử chỉ.",
          icon: <Smartphone className="h-4 w-4 text-red-500" />,
          category: "technology",
          detailImage: "/images/screen-detail.png",
        },
        {
          position: [0.5, 0.8, 0],
          title: "Vô lăng đa chức năng",
          description:
            "Vô lăng bọc da cao cấp với các nút điều khiển tích hợp, cho phép người lái điều khiển hệ thống giải trí, đàm thoại và kiểm soát hành trình mà không rời tay khỏi vô lăng.",
          icon: <Compass className="h-4 w-4 text-red-500" />,
          category: "comfort",
          detailImage: "/images/steering-detail.png",
        },
        {
          position: [-0.5, 0.5, 0],
          title: "Ghế da Nappa cao cấp",
          description:
            "Ghế da Nappa cao cấp với chức năng chỉnh điện 12 hướng, nhớ vị trí, sưởi và làm mát, mang lại sự thoải mái tối đa cho người lái và hành khách.",
          icon: <Lightbulb className="h-4 w-4 text-red-500" />,
          category: "comfort",
          detailImage: "/images/seat-detail.png",
        },
        {
          position: [0, 1, -0.5],
          title: "Cửa sổ trời toàn cảnh",
          description:
            "Cửa sổ trời toàn cảnh với rèm che tự động, mang ánh sáng tự nhiên vào cabin và tạo cảm giác không gian rộng rãi, thoáng đãng.",
          icon: <Maximize className="h-4 w-4 text-red-500" />,
          category: "design",
          detailImage: "/images/sunroof-detail.png",
        },
        {
          position: [0, 0.5, -1],
          title: "Hệ thống âm thanh cao cấp",
          description:
            "Hệ thống âm thanh cao cấp 13 loa Bose với công nghệ âm thanh vòm, tối ưu hóa cho không gian cabin, mang lại trải nghiệm âm thanh chân thực.",
          icon: <Gauge className="h-4 w-4 text-red-500" />,
          category: "technology",
          detailImage: "/images/audio-detail.png",
        },
      ])
    } else if (activeView === "engine") {
      setHotspots([
        {
          position: [0, 0.5, 0],
          title: "Động cơ 2.0L Turbo",
          description:
            "Động cơ 2.0L Turbo với công suất 228 mã lực và mô-men xoắn 350 Nm, tích hợp công nghệ phun xăng trực tiếp và tăng áp, mang lại hiệu suất cao và tiết kiệm nhiên liệu.",
          icon: <Gauge className="h-4 w-4 text-red-500" />,
          category: "performance",
          detailImage: "/images/engine-detail.png",
        },
        {
          position: [0.5, 0.5, 0.5],
          title: "Hệ thống làm mát hiệu suất cao",
          description:
            "Hệ thống làm mát hiệu suất cao với bộ tản nhiệt kép và quạt điều khiển điện tử, duy trì nhiệt độ động cơ tối ưu trong mọi điều kiện vận hành.",
          icon: <Lightbulb className="h-4 w-4 text-red-500" />,
          category: "performance",
          detailImage: "/images/cooling-detail.png",
        },
        {
          position: [-0.5, 0.5, 0.5],
          title: "Hệ thống pin thông minh",
          description:
            "Hệ thống pin lithium-ion dung lượng cao với khả năng sạc nhanh, hệ thống quản lý nhiệt thông minh và tuổi thọ cao, đảm bảo hiệu suất ổn định.",
          icon: <Lightbulb className="h-4 w-4 text-red-500" />,
          category: "technology",
          detailImage: "/images/battery-detail.png",
        },
        {
          position: [0, 0.5, -0.5],
          title: "Hộp số tự động 8 cấp",
          description:
            "Hộp số tự động 8 cấp với khả năng sang số nhanh và mượt mà, tích hợp chế độ lái thể thao và tiết kiệm nhiên liệu, mang lại trải nghiệm lái tối ưu.",
          icon: <Gauge className="h-4 w-4 text-red-500" />,
          category: "performance",
          detailImage: "/images/transmission-detail.png",
        },
        {
          position: [0.5, 0, 0],
          title: "Hệ thống xử lý khí thải",
          description:
            "Hệ thống xử lý khí thải tiên tiến đạt chuẩn Euro 6, giảm phát thải CO2 và bảo vệ môi trường, đồng thời tối ưu hóa hiệu suất động cơ.",
          icon: <Lightbulb className="h-4 w-4 text-red-500" />,
          category: "technology",
          detailImage: "/images/exhaust-detail.png",
        },
      ])
    }
  }, [activeView])

  // Xử lý animation và hiệu ứng
  useEffect(() => {
    // Kích hoạt animation nếu có
    if (actions && Object.keys(actions).length > 0) {
      const animationName = Object.keys(actions)[0]
      actions[animationName]?.play()
    }
  }, [actions])

  useFrame((state) => {
    if (model.current) {
      // Hiệu ứng xoay nhẹ khi không có tương tác
      // model.current.rotation.y += 0.001

      // Điều chỉnh vị trí camera dựa trên chế độ xem
      if (activeView === "exterior") {
        // Vị trí mặc định - không cần điều chỉnh đặc biệt
      } else if (activeView === "interior") {
        // Di chuyển camera vào bên trong xe
        // Đây chỉ là placeholder, bạn cần điều chỉnh dựa trên mô hình thực tế
        // state.camera.position.set(0, 1, 0)
        // state.camera.lookAt(0, 1, 1)
      } else if (activeView === "engine") {
        // Tập trung vào khu vực động cơ
        // state.camera.position.set(0, 1, 3)
        // state.camera.lookAt(0, 0, 0)
      }
    }
  })

  // Clone scene để tránh sửa đổi bản gốc
  const clonedScene = useMemo(() => scene.clone(), [scene])

  // Áp dụng màu sắc và hiệu ứng cho các bộ phận
  useEffect(() => {
    clonedScene.traverse((object: any) => {
      if (object.isMesh) {
        // Lưu vật liệu gốc cho hiệu ứng hover
        object.userData.originalMaterial = object.material.clone()

        // Áp dụng màu xe cho phần thân xe (trong ứng dụng thực tế, bạn sẽ xác định các bộ phận thân xe theo tên hoặc vật liệu)
        if (object.name.includes("body") || object.name.includes("exterior")) {
          const newMaterial = object.material.clone()
          newMaterial.color = new THREE.Color(colorData.color)

          // Thêm hiệu ứng phản chiếu cho thân xe
          if (quality !== "low") {
            newMaterial.metalness = 0.8
            newMaterial.roughness = 0.2
            newMaterial.envMapIntensity = 1.5
          }

          object.material = newMaterial
        }

        // Thêm hiệu ứng phát sáng cho đèn xe
        if (object.name.includes("light") || object.name.includes("lamp")) {
          const newMaterial = object.material.clone()
          newMaterial.emissive = new THREE.Color(0xffffee)
          newMaterial.emissiveIntensity = 2
          object.material = newMaterial
        }

        // Thêm hiệu ứng kim loại cho mâm xe
        if (object.name.includes("wheel") || object.name.includes("rim")) {
          const newMaterial = object.material.clone()
          newMaterial.metalness = 0.9
          newMaterial.roughness = 0.1
          object.material = newMaterial
        }

        // Thêm hiệu ứng kính cho cửa sổ
        if (object.name.includes("glass") || object.name.includes("window")) {
          const newMaterial = object.material.clone()
          newMaterial.transparent = true
          newMaterial.opacity = 0.3
          newMaterial.metalness = 0.9
          newMaterial.roughness = 0
          object.material = newMaterial
        }
      }
    })

    // Áp dụng hiệu ứng explode view
    if (explodeView > 0) {
      clonedScene.traverse((object: any) => {
        if (object.isMesh) {
          // Lấy vị trí gốc từ tâm mô hình
          const direction = new THREE.Vector3()
          direction.subVectors(object.position, new THREE.Vector3(0, 0, 0)).normalize()

          // Di chuyển các bộ phận ra xa tâm dựa trên giá trị explodeView
          const originalPosition = object.userData.originalPosition || object.position.clone()
          object.userData.originalPosition = originalPosition.clone()

          object.position.copy(originalPosition.clone().add(direction.multiplyScalar(explodeView)))
        }
      })
    }
  }, [clonedScene, colorData.color, explodeView, quality])

  // Xử lý sự kiện hover và click
  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    if (e.object.name) {
      setHoveredPart(e.object.name)
      document.body.style.cursor = "pointer"

      // Hiệu ứng highlight khi hover
      if (highlightParts) {
        const material = e.object.material
        if (material) {
          material.emissive = new THREE.Color(0x333333)
          material.emissiveIntensity = 0.5
          material.needsUpdate = true
        }
      }
    }
  }

  const handlePointerOut = (e: any) => {
    setHoveredPart(null)
    document.body.style.cursor = "auto"

    // Khôi phục vật liệu gốc
    if (e.object.material) {
      e.object.material.emissive = new THREE.Color(0x000000)
      e.object.material.emissiveIntensity = 0
      e.object.material.needsUpdate = true
    }
  }

  const handleClick = (e: any) => {
    e.stopPropagation()
    // Tìm thông tin bộ phận dựa trên tên
    const partName = e.object.name

    // Xử lý tên bộ phận để tìm thông tin phù hợp
    for (const key in partsInfo) {
      if (partName.toLowerCase().includes(key.toLowerCase())) {
        onPartClick(partsInfo[key])
        return
      }
    }

    // Nếu không tìm thấy thông tin cụ thể, sử dụng thông tin mặc định
    onPartClick({
      name: partName || "Phần không xác định",
      description: "Không có thông tin chi tiết về bộ phận này.",
    })
  }

  return (
    <>
      <group ref={model}>
        <primitive
          object={clonedScene}
          scale={1}
          position={[0, -0.5, 0]}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        />
      </group>

      {/* Hiệu ứng ánh sáng và môi trường */}
      {quality !== "low" && (
        <>
          <SpotLight position={[5, 5, 5]} angle={0.6} penumbra={0.5} intensity={1} castShadow shadow-bias={-0.0001} />
          <SpotLight
            position={[-5, 5, 5]}
            angle={0.6}
            penumbra={0.5}
            intensity={0.8}
            castShadow
            shadow-bias={-0.0001}
          />
          <ReflectiveFloor />
        </>
      )}

      {/* Hiển thị tên bộ phận khi hover */}
      {hoveredPart && highlightParts && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-zinc-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">{hoveredPart}</div>
        </Html>
      )}

      {/* Hotspots */}
      {showHotspots &&
        hotspots.map((hotspot, index) => (
          <group key={index} position={hotspot.position}>
            {/* Hiệu ứng phát sáng cho hotspot */}
            <HotspotGlow position={[0, 0, 0]} />

            {/* Điểm nhấn có thể click */}
            <Sphere args={[0.05, 16, 16]} onClick={() => setActiveHotspot(index === activeHotspot ? null : index)}>
              <meshBasicMaterial color="#ef4444" />
            </Sphere>

            {/* Hiệu ứng tia sáng khi hotspot được kích hoạt */}
            {activeHotspot === index && <HotspotBeam position={[0, 0, 0]} />}

            {/* Hiển thị thông tin chi tiết khi hotspot được kích hoạt */}
            {activeHotspot === index && (
              <Html position={[0, 0.2, 0]} center style={{ pointerEvents: "none" }}>
                <div className="bg-zinc-900/90 backdrop-blur-sm p-4 rounded-lg border border-red-500 shadow-xl w-64 max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    {hotspot.icon}
                    <h4 className="text-white font-bold text-sm">{hotspot.title}</h4>
                  </div>
                  <p className="text-zinc-300 text-xs mb-2">{hotspot.description}</p>
                  <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                    {hotspot.category}
                  </Badge>
                </div>
              </Html>
            )}

            {/* Hiển thị tiêu đề khi hover */}
            {activeHotspot !== index && (
              <Html position={[0, 0.1, 0]} center style={{ pointerEvents: "none" }}>
                <div className="bg-zinc-900/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  <p className="text-white text-xs whitespace-nowrap">{hotspot.title}</p>
                </div>
              </Html>
            )}
          </group>
        ))}

      {/* Hiệu ứng text 3D nổi */}
      {quality === "high" && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, 2, 0]}>
          <Text
            font="/fonts/Geist_Bold.json"
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 4, 0]}
            fontSize={0.5}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
          >
            VinFast
          </Text>
        </Float>
      )}
    </>
  )
}

function CarScene({
  modelPath,
  activeView,
  colorData,
  showHotspots,
  explodeView = 0,
  highlightParts = true,
  quality = "medium",
  showStats = false,
}: {
  modelPath: string
  activeView: string
  colorData: {
    name: string
    color: string
  }
  showHotspots: boolean
  explodeView?: number
  highlightParts?: boolean
  quality?: "low" | "medium" | "high"
  showStats?: boolean
}) {
  const { toast } = useToast()
  const { camera } = useThree()
  const controls = useRef<any>(null)
  const [selectedPart, setSelectedPart] = useState<PartInfo | null>(null)
  const [performanceMode, setPerformanceMode] = useState(quality)

  const handlePartClick = (partInfo: PartInfo) => {
    setSelectedPart(partInfo)
    toast({
      title: `Phần: ${partInfo.name}`,
      description: partInfo.description.substring(0, 60) + "...",
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

  const handlePerformanceChange = (mode: "low" | "medium" | "high") => {
    setPerformanceMode(mode)
    toast({
      title: `Chất lượng: ${mode === "low" ? "Thấp" : mode === "medium" ? "Trung bình" : "Cao"}`,
      description: "Đã thay đổi chất lượng hiển thị",
    })
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 2, 5]} fov={50} />

      {/* Ánh sáng cơ bản */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Hiệu ứng rung camera nhẹ */}
      {performanceMode === "high" && (
        <CameraShake
          maxYaw={0.01}
          maxPitch={0.01}
          maxRoll={0.01}
          yawFrequency={0.5}
          pitchFrequency={0.5}
          rollFrequency={0.4}
        />
      )}

      {/* Theo dõi hiệu suất và tự động điều chỉnh chất lượng */}
      <PerformanceMonitor
        onDecline={() => {
          if (performanceMode === "high") handlePerformanceChange("medium")
          else if (performanceMode === "medium") handlePerformanceChange("low")
        }}
      />

      {/* Hiển thị thông số FPS nếu được bật */}
      {showStats && <Stats />}

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
        {/* Sử dụng Stage cho chất lượng cao */}
        {performanceMode === "high" ? (
          <Stage
            environment="city"
            intensity={0.5}
            contactShadow={{ opacity: 0.5, blur: 2 }}
            shadows={{ type: "contact", opacity: 0.5, blur: 3 }}
            adjustCamera={false}
          >
            <Model
              modelPath={modelPath}
              activeView={activeView}
              colorData={colorData}
              showHotspots={showHotspots}
              explodeView={explodeView}
              highlightParts={highlightParts}
              onPartClick={handlePartClick}
              quality={performanceMode}
            />
          </Stage>
        ) : (
          <>
            <Environment preset="city" />
            <Model
              modelPath={modelPath}
              activeView={activeView}
              colorData={colorData}
              showHotspots={showHotspots}
              explodeView={explodeView}
              highlightParts={highlightParts}
              onPartClick={handlePartClick}
              quality={performanceMode}
            />
          </>
        )}
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

      {/* Hiển thị thông tin chi tiết về bộ phận được chọn */}
      {selectedPart && (
        <Html position={[0, 0, 0]} center style={{ pointerEvents: "none" }}>
          <div
            className="absolute top-4 right-4 w-72 bg-zinc-900/90 backdrop-blur-sm p-4 rounded-lg border border-red-500 shadow-xl"
            style={{ pointerEvents: "auto" }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-bold">{selectedPart.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-red-500/20"
                onClick={() => setSelectedPart(null)}
              >
                <X className="h-3 w-3 text-red-500" />
              </Button>
            </div>

            <p className="text-zinc-300 text-sm mb-3">{selectedPart.description}</p>

            {selectedPart.specs && (
              <div className="space-y-2 mb-3">
                <h4 className="text-white text-xs font-semibold">Thông số kỹ thuật:</h4>
                <div className="bg-zinc-800/50 rounded-md p-2 space-y-1">
                  {Object.entries(selectedPart.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-zinc-400">{key}:</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPart.image && (
              <div className="relative h-32 w-full rounded-md overflow-hidden">
                <img
                  src={selectedPart.image || "/placeholder.svg"}
                  alt={selectedPart.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Điều khiển tương tác */}
      <Html position={[0, 0, 0]} center style={{ pointerEvents: "none" }}>
        <div className="absolute bottom-4 right-4 flex flex-col gap-2" style={{ pointerEvents: "auto" }}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleZoomIn}
                  className="bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700"
                >
                  <ZoomIn className="h-4 w-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Phóng to</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleZoomOut}
                  className="bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700"
                >
                  <ZoomOut className="h-4 w-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Thu nhỏ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleReset}
                  className="bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700"
                >
                  <RotateCcw className="h-4 w-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Đặt lại góc nhìn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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

export default function EnhancedCarViewer({
  modelPath,
  activeView = "exterior",
  activeColor = 0,
  colorData,
  showHotspots = true,
}: EnhancedCarViewerProps) {
  const isMobile = useMobile()
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasWebGLError, setHasWebGLError] = useState(false)
  const [explodeView, setExplodeView] = useState(0)
  const [highlightParts, setHighlightParts] = useState(true)
  const [quality, setQuality] = useState<"low" | "medium" | "high">(isMobile ? "low" : "medium")
  const [showStats, setShowStats] = useState(false)
  const { toast } = useToast()

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

  const handleExplodeViewChange = (value: number[]) => {
    setExplodeView(value[0])
  }

  const handleHighlightPartsChange = (checked: boolean) => {
    setHighlightParts(checked)
    toast({
      title: checked ? "Đã bật đánh dấu bộ phận" : "Đã tắt đánh dấu bộ phận",
      description: checked
        ? "Bạn có thể di chuột qua các bộ phận để xem thông tin"
        : "Đã tắt hiệu ứng đánh dấu khi di chuột qua các bộ phận",
    })
  }

  const handleQualityChange = (newQuality: "low" | "medium" | "high") => {
    setQuality(newQuality)
    toast({
      title: `Chất lượng: ${newQuality === "low" ? "Thấp" : newQuality === "medium" ? "Trung bình" : "Cao"}`,
      description: "Đã thay đổi chất lượng hiển thị 3D",
    })
  }

  if (hasWebGLError) {
    return <WebGLErrorFallback />
  }

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 z-50">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-red-500 animate-spin"></div>
            <p className="mt-4 text-white">Đang tải mô hình 3D...</p>
          </div>
        </div>
      )}

      {/* Bảng điều khiển nâng cao */}
      <div className="absolute top-4 left-4 z-10 bg-zinc-900/80 backdrop-blur-sm p-3 rounded-lg border border-zinc-800 w-64">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-sm font-medium">Điều khiển nâng cao</h3>
          <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
            3D Pro
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="explode-view" className="text-xs text-zinc-400">
                Tách rời bộ phận
              </Label>
              <span className="text-xs text-zinc-400">{explodeView.toFixed(1)}</span>
            </div>
            <Slider
              id="explode-view"
              min={0}
              max={3}
              step={0.1}
              value={[explodeView]}
              onValueChange={handleExplodeViewChange}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="highlight-parts" className="text-xs text-zinc-400">
              Đánh dấu bộ phận
            </Label>
            <Switch id="highlight-parts" checked={highlightParts} onCheckedChange={handleHighlightPartsChange} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Chất lượng hiển thị</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant={quality === "low" ? "default" : "outline"}
                className={cn(
                  "text-xs h-8",
                  quality === "low"
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                    : "border-zinc-700 text-zinc-400",
                )}
                onClick={() => handleQualityChange("low")}
              >
                Thấp
              </Button>
              <Button
                size="sm"
                variant={quality === "medium" ? "default" : "outline"}
                className={cn(
                  "text-xs h-8",
                  quality === "medium"
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                    : "border-zinc-700 text-zinc-400",
                )}
                onClick={() => handleQualityChange("medium")}
              >
                Trung bình
              </Button>
              <Button
                size="sm"
                variant={quality === "high" ? "default" : "outline"}
                className={cn(
                  "text-xs h-8",
                  quality === "high"
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                    : "border-zinc-700 text-zinc-400",
                )}
                onClick={() => handleQualityChange("high")}
              >
                Cao
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-stats" className="text-xs text-zinc-400">
              Hiển thị FPS
            </Label>
            <Switch id="show-stats" checked={showStats} onCheckedChange={setShowStats} />
          </div>
        </div>
      </div>

      <ErrorBoundary FallbackComponent={WebGLErrorFallback}>
        <Canvas
          shadows
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{
            antialias: quality !== "low",
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            // Cấu hình thêm cho WebGL renderer
            gl.setClearColor("#000000", 0)
            gl.physicallyCorrectLights = true

            // Thêm cấu hình nâng cao cho chất lượng cao
            if (quality === "high") {
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 1.2
            }
          }}
        >
          <CarScene
            modelPath={modelPath}
            activeView={activeView}
            colorData={colorData}
            showHotspots={showHotspots}
            explodeView={explodeView}
            highlightParts={highlightParts}
            quality={quality}
            showStats={showStats}
          />
        </Canvas>
      </ErrorBoundary>

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

      {/* Nút chia sẻ và tải xuống */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-zinc-900/80 backdrop-blur-sm border-zinc-700 text-white hover:bg-zinc-800"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chia sẻ mô hình 3D</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-zinc-900/80 backdrop-blur-sm border-zinc-700 text-white hover:bg-zinc-800"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tải xuống hình ảnh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Nút xem AR (Augmented Reality) */}
      {isMobile && (
        <div className="absolute bottom-16 right-4 z-10">
          <Button
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0 rounded-full"
            onClick={() => {
              toast({
                title: "Chức năng AR",
                description: "Tính năng xem xe trong thực tế ảo tăng cường sẽ sớm được ra mắt!",
              })
            }}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Xem trong AR
          </Button>
        </div>
      )}
    </div>
  )
}

// Thêm ErrorBoundary component để bắt lỗi React
class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  FallbackComponent: React.ComponentType
}> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("WebGL Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <this.props.FallbackComponent />
    }

    return this.props.children
  }
}
