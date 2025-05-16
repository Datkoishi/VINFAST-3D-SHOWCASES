"use client"

import { useEffect, useRef, useState, Suspense, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  useGLTF,
  Html,
  Sphere,
  MeshReflectorMaterial,
  SpotLight,
  useDepthBuffer,
  Float,
  Edges,
  CameraShake,
  useAnimations,
  BakeShadows,
  Lightformer,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  Layers,
  Maximize,
  Minimize,
  Camera,
  Smartphone,
  Ruler,
  Palette,
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import dynamic from "next/dynamic"
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

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

interface Hotspot {
  position: [number, number, number]
  title: string
  description: string
  icon?: string
  category: string
  detailImage?: string
}

interface CarPart {
  name: string
  meshNames: string[]
  description: string
  specs?: Record<string, string>
  image?: string
}

// Hiệu ứng sàn phản chiếu
function ReflectiveFloor() {
  const depthBuffer = useDepthBuffer({ frames: 1 })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
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
        mirror={0.5}
        depthToBlurRatioBias={0.25}
      />

      {/* Spotlight cho hiệu ứng sân khấu */}
      <SpotLight
        position={[0, 10, 0]}
        intensity={0.5}
        angle={0.5}
        penumbra={0.5}
        castShadow
        color="#ffffff"
        depthBuffer={depthBuffer}
      />
    </mesh>
  )
}

// Hiệu ứng đường viền khi hover
function OutlineEffect({ meshRef, isHovered }) {
  useEffect(() => {
    if (!meshRef.current) return

    if (isHovered) {
      meshRef.current.material.emissive = new THREE.Color(0xff0000)
      meshRef.current.material.emissiveIntensity = 0.2
    } else {
      meshRef.current.material.emissive = new THREE.Color(0x000000)
      meshRef.current.material.emissiveIntensity = 0
    }
  }, [isHovered, meshRef])

  return null
}

// Hiệu ứng điểm nổi bật
function HotspotPoint({ position, onClick, isActive }) {
  const [hovered, setHovered] = useState(false)
  const pulseRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (pulseRef.current) {
      pulseRef.current.scale.x = THREE.MathUtils.lerp(pulseRef.current.scale.x, hovered || isActive ? 1.4 : 1, 0.1)
      pulseRef.current.scale.y = THREE.MathUtils.lerp(pulseRef.current.scale.y, hovered || isActive ? 1.4 : 1, 0.1)
      pulseRef.current.scale.z = THREE.MathUtils.lerp(pulseRef.current.scale.z, hovered || isActive ? 1.4 : 1, 0.1)
    }
  })

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group
          ref={pulseRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <Sphere args={[0.05, 16, 16]}>
            <meshStandardMaterial
              color={isActive ? "#ff3333" : "#ff0000"}
              emissive={isActive ? "#ff3333" : "#ff0000"}
              emissiveIntensity={isActive ? 2 : 1}
            />
          </Sphere>
          <Sphere args={[0.07, 16, 16]}>
            <meshStandardMaterial
              color="#ff0000"
              transparent
              opacity={0.2}
              emissive="#ff0000"
              emissiveIntensity={0.5}
            />
          </Sphere>
        </group>
      </Float>

      {/* Pulse animation */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.2} depthWrite={false}>
          {/* animateOpacity and animateScale are not defined in Three.js */}
        </meshBasicMaterial>
      </mesh>
    </group>
  )
}

// Hiệu ứng thông tin chi tiết
function HotspotDetail({ title, description, position, detailImage, onClose }) {
  return (
    <Html position={[position[0], position[1] + 0.2, position[2]]} center transform occlude>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        className="bg-zinc-900/90 backdrop-blur-md p-4 rounded-lg border border-red-500 shadow-xl w-64 max-w-xs"
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-white font-bold text-sm">{title}</h4>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {detailImage && (
          <div className="mb-2 rounded-md overflow-hidden">
            <img src={detailImage || "/placeholder.svg"} alt={title} className="w-full h-24 object-cover" />
          </div>
        )}

        <p className="text-zinc-300 text-xs mb-3">{description}</p>

        <button
          onClick={onClose}
          className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-full transition-colors w-full flex items-center justify-center gap-1"
        >
          <span>Xem chi tiết</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </motion.div>
    </Html>
  )
}

// Component hiển thị phần đang được chọn
function SelectedPartHighlight({ part, meshes, onClose }) {
  const [hovered, setHovered] = useState(false)

  if (!part || !meshes || meshes.length === 0) return null

  return (
    <group>
      {meshes.map((mesh, index) => (
        <group key={index}>
          <mesh geometry={mesh.geometry} position={mesh.position} rotation={mesh.rotation} scale={mesh.scale}>
            <meshStandardMaterial
              color="#ff0000"
              transparent
              opacity={0.3}
              emissive="#ff0000"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Edges
            geometry={mesh.geometry}
            position={mesh.position}
            rotation={mesh.rotation}
            scale={mesh.scale}
            color="#ff0000"
            threshold={15} // Góc tối thiểu giữa các mặt để hiển thị cạnh
            linewidth={1}
          />
        </group>
      ))}

      <Html position={[0, 1, 0]} center>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-zinc-900/90 backdrop-blur-md p-4 rounded-lg border border-red-500 shadow-xl w-80"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-white font-bold">{part.name}</h4>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-zinc-300 text-sm mb-3">{part.description}</p>

          {part.specs && (
            <div className="space-y-1 mb-3">
              {Object.entries(part.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-zinc-400">{key}:</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          <button className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-full transition-colors w-full flex items-center justify-center gap-1">
            <span>Xem thêm thông số</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </motion.div>
      </Html>
    </group>
  )
}

// Hiệu ứng ánh sáng studio
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={1024} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.5} penumbra={1} castShadow />

      {/* Hiệu ứng ánh sáng studio */}
      <Environment preset="studio">
        <Lightformer position={[10, 5, 0]} scale={[10, 10, 1]} color="#ffffff" intensity={0.5} form="rect" />
        <Lightformer position={[-10, 5, 0]} scale={[10, 10, 1]} color="#ffffff" intensity={0.5} form="rect" />
        <Lightformer position={[0, 5, 10]} scale={[10, 10, 1]} color="#ffffff" intensity={0.5} form="rect" />
      </Environment>

      {/* Bóng đổ tích lũy */}
      <AccumulativeShadows
        temporal
        frames={100}
        color="#000000"
        colorBlend={0.5}
        opacity={0.8}
        scale={10}
        position={[0, -0.79, 0]}
      >
        <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[5, 5, -10]} bias={0.001} />
      </AccumulativeShadows>
    </>
  )
}

function Model({
  modelPath,
  activeView,
  colorData,
  showHotspots,
  onPartClick,
  explodeView,
  onHotspotClick,
  selectedPart,
  onSelectedPartClose,
}: {
  modelPath: string
  activeView: string
  colorData: {
    name: string
    color: string
  }
  showHotspots: boolean
  onPartClick: (part: string) => void
  explodeView: boolean
  onHotspotClick: (index: number) => void
  selectedPart: { part: CarPart; meshes: THREE.Mesh[] } | null
  onSelectedPartClose: () => void
}) {
  // For demo purposes, we'll use the duck model if the car model isn't available
  const actualModelPath = modelPath || DUCK_MODEL_PATH
  const { scene, animations } = useGLTF(actualModelPath)
  const { actions, mixer } = useAnimations(animations, scene)
  const model = useRef<THREE.Group>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const [carParts, setCarParts] = useState<Record<string, CarPart>>({})
  const [partMeshes, setPartMeshes] = useState<Record<string, THREE.Mesh[]>>({})

  // Định nghĩa các điểm thông tin (hotspots) dựa trên chế độ xem
  const hotspots = useMemo<Hotspot[]>(() => {
    if (activeView === "exterior") {
      return [
        {
          position: [1, 0.5, 2],
          title: "Đèn LED Matrix",
          description:
            "Đèn pha LED Matrix thông minh tự động điều chỉnh ánh sáng theo điều kiện giao thông, tăng tầm nhìn ban đêm lên đến 300m.",
          icon: "lightbulb",
          category: "lighting",
          detailImage: "/images/details/headlight.jpg",
        },
        {
          position: [-1, 0.5, 2],
          title: "Lưới tản nhiệt V-Motion",
          description:
            "Thiết kế lưới tản nhiệt V-Motion đặc trưng của VinFast với các chi tiết mạ chrome sang trọng, tăng khả năng nhận diện thương hiệu.",
          icon: "design",
          category: "exterior",
          detailImage: "/images/details/grille.jpg",
        },
        {
          position: [1.5, 0.5, 0],
          title: "Mâm xe hợp kim 20 inch",
          description:
            "Mâm xe hợp kim 20 inch với thiết kế 5 chấu kép thể thao, tăng khả năng tản nhiệt cho hệ thống phanh và giảm trọng lượng tổng thể.",
          icon: "wheel",
          category: "exterior",
          detailImage: "/images/details/wheel.jpg",
        },
        {
          position: [0, 1, -2],
          title: "Cụm đèn hậu LED 3D",
          description:
            "Cụm đèn hậu LED 3D với hiệu ứng ánh sáng động, tăng khả năng nhận diện và cảnh báo cho các phương tiện phía sau.",
          icon: "lightbulb",
          category: "lighting",
          detailImage: "/images/details/taillight.jpg",
        },
        {
          position: [0, 0.3, 0],
          title: "Hệ thống treo thích ứng",
          description:
            "Hệ thống treo thích ứng với 5 chế độ điều chỉnh độ cứng, tự động điều chỉnh theo điều kiện mặt đường và phong cách lái.",
          icon: "suspension",
          category: "chassis",
          detailImage: "/images/details/suspension.jpg",
        },
      ]
    } else if (activeView === "interior") {
      return [
        {
          position: [0, 1, 0.5],
          title: "Màn hình cảm ứng 15.6 inch",
          description:
            "Màn hình cảm ứng OLED 15.6 inch độ phân giải 4K với hệ thống giải trí thông minh, hỗ trợ Apple CarPlay và Android Auto không dây.",
          icon: "screen",
          category: "technology",
          detailImage: "/images/details/screen.jpg",
        },
        {
          position: [0.5, 0.8, 0],
          title: "Vô lăng D-cut thể thao",
          description:
            "Vô lăng D-cut bọc da Nappa cao cấp với các nút điều khiển cảm ứng và lẫy chuyển số, tích hợp sưởi và làm mát.",
          icon: "steering",
          category: "interior",
          detailImage: "/images/details/steering.jpg",
        },
        {
          position: [-0.5, 0.5, 0],
          title: "Ghế ngồi chỉnh điện 16 hướng",
          description:
            "Ghế ngồi bọc da semi-aniline với chức năng chỉnh điện 16 hướng, nhớ vị trí, sưởi, làm mát và massage 5 chế độ.",
          icon: "seat",
          category: "comfort",
          detailImage: "/images/details/seat.jpg",
        },
        {
          position: [0, 1, -0.5],
          title: "Cửa sổ trời toàn cảnh",
          description:
            "Cửa sổ trời toàn cảnh với kính cách nhiệt và chống tia UV, điều khiển bằng giọng nói và cử chỉ.",
          icon: "sunroof",
          category: "comfort",
          detailImage: "/images/details/sunroof.jpg",
        },
        {
          position: [0, 0.6, 0],
          title: "Hệ thống âm thanh 18 loa",
          description:
            "Hệ thống âm thanh vòm 18 loa công suất 1200W, tích hợp công nghệ khử tiếng ồn chủ động và tối ưu hóa âm thanh theo vị trí ngồi.",
          icon: "audio",
          category: "technology",
          detailImage: "/images/details/audio.jpg",
        },
      ]
    } else if (activeView === "engine") {
      return [
        {
          position: [0, 0.5, 0],
          title: "Động cơ V8 Twin-Turbo",
          description:
            "Động cơ V8 4.0L Twin-Turbo công suất 550 mã lực, mô-men xoắn 770 Nm, tăng tốc 0-100 km/h trong 3.8 giây.",
          icon: "engine",
          category: "powertrain",
          detailImage: "/images/details/engine.jpg",
        },
        {
          position: [0.5, 0.5, 0.5],
          title: "Hệ thống làm mát biến thiên",
          description:
            "Hệ thống làm mát biến thiên với 3 két nước độc lập, tự động điều chỉnh theo nhiệt độ động cơ và điều kiện vận hành.",
          icon: "cooling",
          category: "powertrain",
          detailImage: "/images/details/cooling.jpg",
        },
        {
          position: [-0.5, 0.5, 0.5],
          title: "Pin lithium-ion 120 kWh",
          description:
            "Pin lithium-ion 120 kWh với hệ thống quản lý nhiệt độ thông minh, sạc nhanh 10-80% trong 30 phút.",
          icon: "battery",
          category: "electric",
          detailImage: "/images/details/battery.jpg",
        },
        {
          position: [0, 0.5, -0.5],
          title: "Hộp số tự động 8 cấp",
          description:
            "Hộp số tự động 8 cấp với công nghệ chuyển số thông minh, tối ưu hóa hiệu suất và tiết kiệm nhiên liệu.",
          icon: "transmission",
          category: "powertrain",
          detailImage: "/images/details/transmission.jpg",
        },
        {
          position: [0, 0.2, 0.8],
          title: "Hệ thống xả thể thao",
          description:
            "Hệ thống xả thể thao với van điều khiển điện tử, tùy chỉnh âm thanh theo 4 chế độ lái khác nhau.",
          icon: "exhaust",
          category: "powertrain",
          detailImage: "/images/details/exhaust.jpg",
        },
      ]
    }
    return []
  }, [activeView])

  // Định nghĩa các bộ phận của xe
  useEffect(() => {
    const parts: Record<string, CarPart> = {
      body: {
        name: "Thân xe",
        meshNames: ["body", "chassis", "frame"],
        description: "Thân xe được làm từ thép cường lực và nhôm, giảm trọng lượng và tăng độ cứng.",
        specs: {
          "Vật liệu": "Thép cường lực + Nhôm",
          "Trọng lượng": "1,650 kg",
          "Hệ số cản gió": "0.28 Cd",
          "Chiều dài": "4,973 mm",
        },
        image: "/images/details/body.jpg",
      },
      engine: {
        name: "Động cơ",
        meshNames: ["engine", "motor"],
        description: "Động cơ V8 Twin-Turbo 4.0L công suất 550 mã lực, mô-men xoắn 770 Nm.",
        specs: {
          Loại: "V8 Twin-Turbo 4.0L",
          "Công suất": "550 mã lực",
          "Mô-men xoắn": "770 Nm",
          "Tăng tốc 0-100 km/h": "3.8 giây",
        },
        image: "/images/details/engine_detail.jpg",
      },
      wheels: {
        name: "Bánh xe",
        meshNames: ["wheel", "tire", "rim"],
        description: "Mâm xe hợp kim 20 inch với lốp thể thao cao cấp, tăng độ bám đường.",
        specs: {
          "Kích thước mâm": "20 inch",
          "Kích thước lốp trước": "255/40 R20",
          "Kích thước lốp sau": "275/35 R20",
          "Loại lốp": "Michelin Pilot Sport 4S",
        },
        image: "/images/details/wheels.jpg",
      },
      interior: {
        name: "Nội thất",
        meshNames: ["interior", "cabin", "seats"],
        description: "Nội thất bọc da Nappa cao cấp với các chi tiết ốp gỗ và carbon.",
        specs: {
          "Chất liệu ghế": "Da Nappa",
          "Số ghế": "5",
          "Chỉnh điện": "16 hướng",
          "Chức năng": "Sưởi, làm mát, massage",
        },
        image: "/images/details/interior_detail.jpg",
      },
      lights: {
        name: "Hệ thống đèn",
        meshNames: ["headlight", "taillight", "light"],
        description: "Hệ thống đèn LED Matrix thông minh với các tính năng tự động điều chỉnh.",
        specs: {
          "Loại đèn pha": "LED Matrix",
          "Loại đèn hậu": "LED 3D",
          "Đèn ban ngày": "LED dạng V-signature",
          "Tính năng": "Tự động điều chỉnh góc chiếu",
        },
        image: "/images/details/lights.jpg",
      },
    }

    setCarParts(parts)
  }, [])

  // Tìm và lưu trữ các mesh tương ứng với từng bộ phận
  useEffect(() => {
    if (!scene) return

    const meshMap: Record<string, THREE.Mesh[]> = {}

    // Duyệt qua tất cả các mesh trong scene
    scene.traverse((object: any) => {
      if (object.isMesh) {
        // Kiểm tra xem mesh này thuộc bộ phận nào
        for (const [partKey, part] of Object.entries(carParts)) {
          for (const meshName of part.meshNames) {
            if (object.name.toLowerCase().includes(meshName.toLowerCase())) {
              if (!meshMap[partKey]) {
                meshMap[partKey] = []
              }
              meshMap[partKey].push(object)
              break
            }
          }
        }
      }
    })

    setPartMeshes(meshMap)
  }, [scene, carParts])

  // Hiệu ứng explode view
  useFrame((state, delta) => {
    if (model.current) {
      // Xoay nhẹ mô hình
      if (activeView === "exterior" && !selectedPart) {
        model.current.rotation.y += delta * 0.05
      }

      // Hiệu ứng explode view
      if (explodeView) {
        scene.traverse((object: any) => {
          if (object.isMesh) {
            // Tìm vị trí tương đối so với tâm
            const direction = new THREE.Vector3()
            object.getWorldPosition(direction)
            direction.sub(new THREE.Vector3(0, 0, 0)).normalize()

            // Di chuyển các bộ phận ra xa tâm
            const targetPosition = direction.multiplyScalar(0.5)
            object.position.lerp(targetPosition, delta * 2)
          }
        })
      } else {
        // Khôi phục vị trí ban đầu
        scene.traverse((object: any) => {
          if (object.isMesh && object.userData.originalPosition) {
            object.position.lerp(object.userData.originalPosition, delta * 2)
          }
        })
      }
    }
  })

  // Lưu vị trí ban đầu của các mesh
  useEffect(() => {
    scene.traverse((object: any) => {
      if (object.isMesh) {
        object.userData.originalPosition = object.position.clone()
      }
    })
  }, [scene])

  // Clone the scene to avoid modifying the original
  const clonedScene = useMemo(() => scene.clone(), [scene])

  // Apply color to the car body
  useEffect(() => {
    clonedScene.traverse((object: any) => {
      if (object.isMesh) {
        // Store original material for hover effect
        object.userData.originalMaterial = object.material.clone()

        // Apply car color to body parts (in a real app, you would identify body parts by name or material)
        if (object.name.toLowerCase().includes("body") || object.name.toLowerCase().includes("exterior")) {
          const newMaterial = object.material.clone()
          newMaterial.color = new THREE.Color(colorData.color)

          // Thêm hiệu ứng metallic và clearcoat cho sơn xe
          if (newMaterial.type === "MeshStandardMaterial") {
            newMaterial.metalness = 0.8
            newMaterial.roughness = 0.2
            newMaterial.envMapIntensity = 1.5
          }

          object.material = newMaterial
        }

        // Thêm hiệu ứng phản chiếu cho kính
        if (object.name.toLowerCase().includes("glass") || object.name.toLowerCase().includes("window")) {
          const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#ffffff"),
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9, // Độ trong suốt
            transparent: true,
            opacity: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
          })

          object.material = glassMaterial
        }

        // Thêm hiệu ứng chrome cho các chi tiết kim loại
        if (
          object.name.toLowerCase().includes("chrome") ||
          object.name.toLowerCase().includes("metal") ||
          object.name.toLowerCase().includes("trim")
        ) {
          const chromeMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#cccccc"),
            metalness: 1.0,
            roughness: 0.1,
            envMapIntensity: 2.0,
          })

          object.material = chromeMaterial
        }

        // Bật đổ bóng cho tất cả các mesh
        object.castShadow = true
        object.receiveShadow = true

        // Add event handlers
        object.onClick = () => {
          // Tìm bộ phận tương ứng với mesh này
          for (const [partKey, meshes] of Object.entries(partMeshes)) {
            if (meshes.some((mesh) => mesh.uuid === object.uuid)) {
              onPartClick(partKey)
              return
            }
          }

          // Nếu không tìm thấy bộ phận, sử dụng tên mesh
          onPartClick(object.name || "Phần không xác định")
        }
      }
    })
  }, [clonedScene, colorData, onPartClick, partMeshes])

  // Hiệu ứng hover
  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    const mesh = e.object

    // Tìm bộ phận tương ứng với mesh này
    for (const [partKey, meshes] of Object.entries(partMeshes)) {
      if (meshes.some((mesh) => mesh.uuid === mesh.uuid)) {
        setHoveredPart(partKey)
        return
      }
    }

    setHoveredPart(mesh.name)
  }

  const handlePointerOut = () => {
    setHoveredPart(null)
  }

  return (
    <>
      <primitive
        ref={model}
        object={clonedScene}
        scale={1}
        position={[0, -0.5, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* Hiệu ứng highlight cho phần đang hover */}
      {hoveredPart && partMeshes[hoveredPart] && (
        <group>
          {partMeshes[hoveredPart].map((mesh, index) => (
            <Edges
              key={index}
              geometry={mesh.geometry}
              position={mesh.position}
              rotation={mesh.rotation}
              scale={mesh.scale}
              color="#ff0000"
              threshold={15}
              linewidth={1}
            />
          ))}
        </group>
      )}

      {/* Hiệu ứng highlight cho phần đang được chọn */}
      {selectedPart && (
        <SelectedPartHighlight part={selectedPart.part} meshes={selectedPart.meshes} onClose={onSelectedPartClose} />
      )}

      {/* Hotspots */}
      {showHotspots &&
        hotspots.map((hotspot, index) => (
          <group key={index}>
            <HotspotPoint
              position={hotspot.position}
              onClick={() => onHotspotClick(index)}
              isActive={activeHotspot === index}
            />

            {activeHotspot === index && (
              <HotspotDetail
                title={hotspot.title}
                description={hotspot.description}
                position={hotspot.position}
                detailImage={hotspot.detailImage}
                onClose={() => setActiveHotspot(null)}
              />
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
  explodeView,
  autoRotate,
  cameraShake,
  postProcessing,
}: {
  modelPath: string
  activeView: string
  colorData: {
    name: string
    color: string
  }
  showHotspots: boolean
  explodeView: boolean
  autoRotate: boolean
  cameraShake: boolean
  postProcessing: boolean
}) {
  const { toast } = useToast()
  const { camera } = useThree()
  const controls = useRef<any>(null)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const [selectedPart, setSelectedPart] = useState<{ part: CarPart; meshes: THREE.Mesh[] } | null>(null)
  const [carParts, setCarParts] = useState<Record<string, CarPart>>({})
  const [partMeshes, setPartMeshes] = useState<Record<string, THREE.Mesh[]>>({})

  // Định nghĩa các bộ phận của xe
  useEffect(() => {
    const parts: Record<string, CarPart> = {
      body: {
        name: "Thân xe",
        meshNames: ["body", "chassis", "frame"],
        description: "Thân xe được làm từ thép cường lực và nhôm, giảm trọng lượng và tăng độ cứng.",
        specs: {
          "Vật liệu": "Thép cường lực + Nhôm",
          "Trọng lượng": "1,650 kg",
          "Hệ số cản gió": "0.28 Cd",
          "Chiều dài": "4,973 mm",
        },
        image: "/images/details/body.jpg",
      },
      engine: {
        name: "Động cơ",
        meshNames: ["engine", "motor"],
        description: "Động cơ V8 Twin-Turbo 4.0L công suất 550 mã lực, mô-men xoắn 770 Nm.",
        specs: {
          Loại: "V8 Twin-Turbo 4.0L",
          "Công suất": "550 mã lực",
          "Mô-men xoắn": "770 Nm",
          "Tăng tốc 0-100 km/h": "3.8 giây",
        },
        image: "/images/details/engine_detail.jpg",
      },
      wheels: {
        name: "Bánh xe",
        meshNames: ["wheel", "tire", "rim"],
        description: "Mâm xe hợp kim 20 inch với lốp thể thao cao cấp, tăng độ bám đường.",
        specs: {
          "Kích thước mâm": "20 inch",
          "Kích thước lốp trước": "255/40 R20",
          "Kích thước lốp sau": "275/35 R20",
          "Loại lốp": "Michelin Pilot Sport 4S",
        },
        image: "/images/details/wheels.jpg",
      },
      interior: {
        name: "Nội thất",
        meshNames: ["interior", "cabin", "seats"],
        description: "Nội thất bọc da Nappa cao cấp với các chi tiết ốp gỗ và carbon.",
        specs: {
          "Chất liệu ghế": "Da Nappa",
          "Số ghế": "5",
          "Chỉnh điện": "16 hướng",
          "Chức năng": "Sưởi, làm mát, massage",
        },
        image: "/images/details/interior_detail.jpg",
      },
      lights: {
        name: "Hệ thống đèn",
        meshNames: ["headlight", "taillight", "light"],
        description: "Hệ thống đèn LED Matrix thông minh với các tính năng tự động điều chỉnh.",
        specs: {
          "Loại đèn pha": "LED Matrix",
          "Loại đèn hậu": "LED 3D",
          "Đèn ban ngày": "LED dạng V-signature",
          "Tính năng": "Tự động điều chỉnh góc chiếu",
        },
        image: "/images/details/lights.jpg",
      },
    }

    setCarParts(parts)
  }, [])

  const handlePartClick = (partKey: string) => {
    // Tìm bộ phận tương ứng
    const part = carParts[partKey]
    const meshes = partMeshes[partKey]

    if (part && meshes) {
      setSelectedPart({ part, meshes })

      toast({
        title: `Phần: ${part.name}`,
        description: part.description,
      })
    } else {
      toast({
        title: `Phần: ${partKey}`,
        description: "Nhấp vào các bộ phận khác để xem thêm thông tin chi tiết.",
      })
    }
  }

  const handleHotspotClick = (index: number) => {
    setActiveHotspot(index === activeHotspot ? null : index)
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

  // Điều chỉnh camera dựa trên chế độ xem
  useEffect(() => {
    if (camera && controls.current) {
      if (activeView === "exterior") {
        // Góc nhìn ngoại thất
        camera.position.set(5, 2, 5)
        controls.current.target.set(0, 0, 0)
      } else if (activeView === "interior") {
        // Góc nhìn nội thất
        camera.position.set(0, 1, 0)
        controls.current.target.set(0, 1, 1)
      } else if (activeView === "engine") {
        // Góc nhìn động cơ
        camera.position.set(0, 1, 3)
        controls.current.target.set(0, 0, 0)
      }

      controls.current.update()
    }
  }, [activeView, camera])

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 2, 5]} fov={45} />

      {/* Hiệu ứng rung camera */}
      {cameraShake && (
        <CameraShake
          maxYaw={0.01}
          maxPitch={0.01}
          maxRoll={0.01}
          yawFrequency={0.5}
          pitchFrequency={0.5}
          rollFrequency={0.4}
        />
      )}

      {/* Ánh sáng và môi trường */}
      <StudioLighting />

      {/* Sàn phản chiếu */}
      <ReflectiveFloor />

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
          explodeView={explodeView}
          onHotspotClick={handleHotspotClick}
          selectedPart={selectedPart}
          onSelectedPartClose={() => setSelectedPart(null)}
        />
      </Suspense>

      <OrbitControls
        ref={controls}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        target={[0, 0, 0]}
      />

      {/* Hiệu ứng hậu kỳ */}
      {postProcessing && (
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
          <ChromaticAberration
            offset={[0.0005, 0.0005]}
            blendFunction={BlendFunction.NORMAL}
            radialModulation={true}
            modulationOffset={0.5}
          />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        </EffectComposer>
      )}

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

      {/* Bake shadows for performance */}
      <BakeShadows />
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

// Hiệu ứng AR
function ARButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-zinc-700 text-white hover:bg-red-600 hover:text-white hover:border-red-600"
      onClick={onClick}
    >
      <Smartphone className="h-4 w-4 mr-2" />
      Xem trong AR
    </Button>
  )
}

// Hiệu ứng đo lường
function MeasurementTool({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      className={
        isActive
          ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
          : "border-zinc-700 text-white hover:bg-white/10"
      }
      onClick={onToggle}
    >
      <Ruler className="h-4 w-4 mr-2" />
      Đo kích thước
    </Button>
  )
}

// Hiệu ứng chụp ảnh
function ScreenshotButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="icon" className="border-zinc-700 text-white hover:bg-white/10" onClick={onClick}>
      <Camera className="h-4 w-4" />
    </Button>
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
  const [explodeView, setExplodeView] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [measurementMode, setMeasurementMode] = useState(false)
  const [cameraShake, setCameraShake] = useState(false)
  const [postProcessing, setPostProcessing] = useState(true)
  const [viewMode, setViewMode] = useState<"normal" | "fullscreen">("normal")
  const canvasRef = useRef<HTMLDivElement>(null)
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

  const handleARView = () => {
    toast({
      title: "Chế độ AR",
      description: "Đang mở chế độ xem AR. Vui lòng cho phép truy cập camera.",
    })

    // Mở chế độ AR (giả lập)
    setTimeout(() => {
      toast({
        title: "Chế độ AR",
        description: "Tính năng AR đang được phát triển. Sẽ sớm ra mắt!",
      })
    }, 2000)
  }

  const handleMeasurementToggle = () => {
    setMeasurementMode(!measurementMode)

    toast({
      title: measurementMode ? "Đã tắt chế độ đo lường" : "Đã bật chế độ đo lường",
      description: measurementMode
        ? "Chế độ đo lường đã được tắt"
        : "Nhấp vào hai điểm bất kỳ trên mô hình để đo khoảng cách",
    })
  }

  const handleScreenshot = () => {
    toast({
      title: "Chụp ảnh",
      description: "Đang chụp ảnh mô hình 3D...",
    })

    // Giả lập chụp ảnh
    setTimeout(() => {
      toast({
        title: "Chụp ảnh thành công",
        description: "Ảnh đã được lưu vào thư viện của bạn",
      })
    }, 1000)
  }

  const toggleFullscreen = () => {
    if (viewMode === "normal") {
      setViewMode("fullscreen")

      // Mở fullscreen
      if (canvasRef.current && canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen().catch((err) => {
          console.error("Không thể mở chế độ toàn màn hình:", err)
        })
      }
    } else {
      setViewMode("normal")

      // Thoát fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error("Không thể thoát chế độ toàn màn hình:", err)
        })
      }
    }
  }

  if (hasWebGLError) {
    return <WebGLErrorFallback />
  }

  return (
    <div className="w-full h-full relative" ref={canvasRef}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 z-10">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-red-500 animate-spin"></div>
            <p className="mt-4 text-white">Đang tải mô hình 3D...</p>
          </div>
        </div>
      )}

      {/* Thanh công cụ phía trên */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap justify-between items-center gap-2 bg-zinc-800/80 backdrop-blur-md p-2 rounded-lg">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={explodeView ? "default" : "outline"}
            size="sm"
            className={
              explodeView
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                : "border-zinc-700 text-white hover:bg-white/10"
            }
            onClick={() => setExplodeView(!explodeView)}
          >
            <Layers className="h-4 w-4 mr-2" />
            {explodeView ? "Thu gọn" : "Mở rộng"}
          </Button>

          <Button
            variant={autoRotate ? "default" : "outline"}
            size="sm"
            className={
              autoRotate
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-0"
                : "border-zinc-700 text-white hover:bg-white/10"
            }
            onClick={() => setAutoRotate(!autoRotate)}
          >
            {autoRotate ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {autoRotate ? "Dừng xoay" : "Tự động xoay"}
          </Button>

          <MeasurementTool isActive={measurementMode} onToggle={handleMeasurementToggle} />

          <ARButton onClick={handleARView} />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-700 text-white hover:bg-white/10"
            onClick={() => setPostProcessing(!postProcessing)}
            title={postProcessing ? "Tắt hiệu ứng hậu kỳ" : "Bật hiệu ứng hậu kỳ"}
          >
            <Palette className="h-4 w-4" />
          </Button>

          <ScreenshotButton onClick={handleScreenshot} />

          <Button
            variant="outline"
            size="icon"
            className="border-zinc-700 text-white hover:bg-white/10"
            onClick={toggleFullscreen}
          >
            {viewMode === "normal" ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* ErrorBoundary component to catch errors */}
      <div>
        {hasWebGLError && <WebGLErrorFallback />}
        {!hasWebGLError && (
          <Canvas
            shadows
            dpr={[1, isMobile ? 1.5 : 2]}
            gl={{
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: true, // Cho phép chụp ảnh
            }}
            onCreated={({ gl }) => {
              // Cấu hình thêm cho WebGL renderer
              gl.setClearColor("#000000", 0)
              gl.physicallyCorrectLights = true
              gl.outputEncoding = THREE.sRGBEncoding
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 1.2
            }}
            camera={{ fov: 45, near: 0.1, far: 1000 }}
            className={viewMode === "fullscreen" ? "fixed inset-0 z-50" : ""}
          >
            <CarScene
              modelPath={modelPath}
              activeView={activeView}
              colorData={colorData}
              showHotspots={showHotspots}
              explodeView={explodeView}
              autoRotate={autoRotate}
              cameraShake={cameraShake}
              postProcessing={postProcessing}
            />
          </Canvas>
        )}
      </div>

      {/* Điều hướng chế độ xem */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 bg-zinc-800/80 backdrop-blur-md p-2 rounded-full">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 rounded-full"
          onClick={() => {
            if (activeView === "exterior") {
              // Nếu đang ở chế độ ngoại thất, chuyển sang chế độ nội thất
              const event = new CustomEvent("viewChange", { detail: "interior" })
              document.dispatchEvent(event)
            } else if (activeView === "interior") {
              // Nếu đang ở chế độ nội thất, chuyển sang chế độ động cơ
              const event = new CustomEvent("viewChange", { detail: "engine" })
              document.dispatchEvent(event)
            } else if (activeView === "engine") {
              // Nếu đang ở chế độ động cơ, chuyển sang chế độ ngoại thất
              const event = new CustomEvent("viewChange", { detail: "exterior" })
              document.dispatchEvent(event)
            }
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-white text-sm flex items-center">
          {activeView === "exterior" ? "Ngoại thất" : activeView === "interior" ? "Nội thất" : "Động cơ"}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 rounded-full"
          onClick={() => {
            if (activeView === "exterior") {
              // Nếu đang ở chế độ ngoại thất, chuyển sang chế độ nội thất
              const event = new CustomEvent("viewChange", { detail: "interior" })
              document.dispatchEvent(event)
            } else if (activeView === "interior") {
              // Nếu đang ở chế độ nội thất, chuyển sang chế độ động cơ
              const event = new CustomEvent("viewChange", { detail: "engine" })
              document.dispatchEvent(event)
            } else if (activeView === "engine") {
              // Nếu đang ở chế độ động cơ, chuyển sang chế độ ngoại thất
              const event = new CustomEvent("viewChange", { detail: "exterior" })
              document.dispatchEvent(event)
            }
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence>
        {showHotspots && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 left-4 text-xs text-white bg-zinc-800/80 backdrop-blur-sm p-2 rounded-md flex items-center gap-2"
          >
            <Info className="h-3 w-3 text-red-500" />
            <p>Nhấp vào các điểm đỏ để xem thông tin chi tiết</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
