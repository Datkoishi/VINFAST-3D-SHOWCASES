"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, CreditCard, Landmark, Wallet, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

export default function PaymentPage() {
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [selectedCar, setSelectedCar] = useState("lux-2-0")
  const [depositAmount, setDepositAmount] = useState("50000000")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleContinue = () => {
    if (step < 4) {
      setIsProcessing(true)
      setTimeout(() => {
        setStep(step + 1)
        setProgress((step + 1) * 25)
        setIsProcessing(false)
      }, 1500)
    } else {
      setIsProcessing(true)
      setTimeout(() => {
        setIsComplete(true)
        setIsProcessing(false)
        toast({
          title: "Thanh toán thành công",
          description: "Cảm ơn bạn đã đặt cọc xe VinFast. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
        })
      }, 2000)
    }
  }

  const cars = [
    {
      id: "lux-2-0",
      name: "VinFast Lux 2.0",
      price: "999.000.000 VNĐ",
      image: "/images/lux-2-0-thumbnail.png",
    },
    {
      id: "vf8",
      name: "VinFast VF8",
      price: "1.057.100.000 VNĐ",
      image: "/images/vf8-thumbnail.png",
    },
    {
      id: "vf9",
      name: "VinFast VF9",
      price: "1.443.200.000 VNĐ",
      image: "/images/vf9-thumbnail.png",
    },
    {
      id: "vf6",
      name: "VinFast VF6",
      price: "675.000.000 VNĐ",
      image: "/images/vf6-thumbnail.png",
    },
  ]

  const selectedCarData = cars.find((car) => car.id === selectedCar)

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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Thanh Toán & Đặt Cọc</h1>
        </div>

        {isComplete ? (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Thanh Toán Thành Công</h2>
                  <p className="text-zinc-400 text-center max-w-md mb-6">
                    Cảm ơn bạn đã đặt cọc xe VinFast. Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
                  </p>
                  <div className="bg-zinc-800/50 rounded-lg p-4 w-full max-w-md mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-400">Mã đơn hàng:</span>
                      <span className="text-white font-medium">VF{Math.floor(Math.random() * 1000000)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-400">Xe:</span>
                      <span className="text-white font-medium">{selectedCarData?.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-400">Số tiền đặt cọc:</span>
                      <span className="text-white font-medium">
                        {Number.parseInt(depositAmount).toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Phương thức thanh toán:</span>
                      <span className="text-white font-medium">
                        {paymentMethod === "credit-card"
                          ? "Thẻ tín dụng"
                          : paymentMethod === "bank-transfer"
                            ? "Chuyển khoản ngân hàng"
                            : "Ví điện tử"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link href="/contract">
                      <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0">
                        Tiếp Tục Đến Ký Hợp Đồng
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="border-zinc-700 text-white">
                        Quay Lại Trang Chủ
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700 mb-6">
                <CardHeader className="pb-2">
                  <div className="w-full mb-4">
                    <Progress value={progress} className="h-2 bg-zinc-700" indicatorColor="bg-red-500" />
                  </div>
                  <div className="flex justify-between text-sm text-zinc-400 mb-4">
                    <span className={step >= 1 ? "text-white font-medium" : ""}>Chọn xe</span>
                    <span className={step >= 2 ? "text-white font-medium" : ""}>Đặt cọc</span>
                    <span className={step >= 3 ? "text-white font-medium" : ""}>Thông tin</span>
                    <span className={step >= 4 ? "text-white font-medium" : ""}>Xác nhận</span>
                  </div>
                </CardHeader>
              </Card>

              {step === 1 && (
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Chọn Xe VinFast</CardTitle>
                    <CardDescription className="text-zinc-400">Chọn mẫu xe VinFast bạn muốn đặt cọc</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cars.map((car) => (
                        <div
                          key={car.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedCar === car.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-zinc-700 hover:border-zinc-500"
                          }`}
                          onClick={() => setSelectedCar(car.id)}
                        >
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20">
                              <Image
                                src={car.image || "/placeholder.svg"}
                                alt={car.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{car.name}</h3>
                              <p className="text-zinc-400 text-sm mb-1">Giá từ: {car.price}</p>
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 rounded-full border ${
                                    selectedCar === car.id
                                      ? "border-red-500 bg-red-500"
                                      : "border-zinc-600 bg-transparent"
                                  } mr-2`}
                                >
                                  {selectedCar === car.id && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="w-4 h-4 text-white"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  )}
                                </div>
                                <span className="text-sm text-zinc-400">
                                  {selectedCar === car.id ? "Đã chọn" : "Chọn xe này"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="border-zinc-700 text-white" disabled>
                      Quay Lại
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
                      onClick={handleContinue}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        "Tiếp Tục"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === 2 && (
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Đặt Cọc</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Chọn số tiền đặt cọc và phương thức thanh toán
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label className="text-white mb-2 block">Số tiền đặt cọc</Label>
                        <RadioGroup
                          value={depositAmount}
                          onValueChange={setDepositAmount}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="20000000" id="deposit-1" className="text-red-500" />
                            <Label htmlFor="deposit-1" className="text-white">
                              20.000.000 VNĐ
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="50000000" id="deposit-2" className="text-red-500" />
                            <Label htmlFor="deposit-2" className="text-white">
                              50.000.000 VNĐ
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="100000000" id="deposit-3" className="text-red-500" />
                            <Label htmlFor="deposit-3" className="text-white">
                              100.000.000 VNĐ
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Phương thức thanh toán</Label>
                        <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                          <TabsList className="grid grid-cols-3 mb-6 bg-zinc-800 p-1 rounded-lg">
                            <TabsTrigger
                              value="credit-card"
                              className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Thẻ tín dụng
                            </TabsTrigger>
                            <TabsTrigger
                              value="bank-transfer"
                              className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                            >
                              <Landmark className="h-4 w-4 mr-2" />
                              Chuyển khoản
                            </TabsTrigger>
                            <TabsTrigger
                              value="e-wallet"
                              className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                            >
                              <Wallet className="h-4 w-4 mr-2" />
                              Ví điện tử
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="credit-card" className="mt-0">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="card-name" className="text-white">
                                    Tên chủ thẻ
                                  </Label>
                                  <Input
                                    id="card-name"
                                    placeholder="NGUYEN VAN A"
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="card-number" className="text-white">
                                    Số thẻ
                                  </Label>
                                  <Input
                                    id="card-number"
                                    placeholder="1234 5678 9012 3456"
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiry" className="text-white">
                                    Ngày hết hạn
                                  </Label>
                                  <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cvv" className="text-white">
                                    CVV
                                  </Label>
                                  <Input
                                    id="cvv"
                                    placeholder="123"
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="bank-transfer" className="mt-0">
                            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                              <h3 className="font-medium text-white mb-2">Thông tin chuyển khoản</h3>
                              <div className="space-y-2 text-zinc-300">
                                <p>Ngân hàng: Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)</p>
                                <p>Số tài khoản: 19036789789789</p>
                                <p>Chủ tài khoản: CÔNG TY CP VINFAST</p>
                                <p>
                                  Nội dung chuyển khoản:{" "}
                                  <span className="text-red-500 font-medium">
                                    VINFAST {selectedCarData?.name.split(" ")[1]} {Math.floor(Math.random() * 1000000)}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 mb-4">
                              <Shield className="h-5 w-5 text-red-500" />
                              <p className="text-sm">
                                Vui lòng chuyển khoản đúng số tiền và nội dung để đảm bảo giao dịch được xử lý nhanh
                                chóng.
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="confirm-transfer" className="text-red-500 border-zinc-600" />
                              <label
                                htmlFor="confirm-transfer"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                              >
                                Tôi xác nhận đã chuyển khoản
                              </label>
                            </div>
                          </TabsContent>

                          <TabsContent value="e-wallet" className="mt-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                              {["MoMo", "VNPay", "ZaloPay", "Moca"].map((wallet) => (
                                <div
                                  key={wallet}
                                  className="border border-zinc-700 rounded-lg p-4 text-center cursor-pointer hover:border-red-500 transition-colors"
                                >
                                  <div className="w-12 h-12 rounded-full bg-zinc-700 mx-auto mb-2"></div>
                                  <p className="text-white">{wallet}</p>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                              <Shield className="h-5 w-5 text-red-500" />
                              <p className="text-sm">
                                Bạn sẽ được chuyển đến trang thanh toán của ví điện tử để hoàn tất giao dịch.
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-white"
                      onClick={() => {
                        setStep(1)
                        setProgress(25)
                      }}
                      disabled={isProcessing}
                    >
                      Quay Lại
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
                      onClick={handleContinue}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        "Tiếp Tục"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === 3 && (
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Thông Tin Cá Nhân</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Nhập thông tin cá nhân của bạn để hoàn tất đặt cọc
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full-name" className="text-white">
                            Họ và tên
                          </Label>
                          <Input
                            id="full-name"
                            placeholder="Nguyễn Văn A"
                            className="bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-white">
                            Số điện thoại
                          </Label>
                          <Input
                            id="phone"
                            placeholder="0912345678"
                            className="bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@gmail.com"
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address" className="text-white">
                          Địa chỉ
                        </Label>
                        <Input
                          id="address"
                          placeholder="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="id-number" className="text-white">
                          Số CMND/CCCD
                        </Label>
                        <Input
                          id="id-number"
                          placeholder="012345678910"
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" className="text-red-500 border-zinc-600" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                        >
                          Tôi đồng ý với{" "}
                          <a href="#" className="text-red-500 hover:underline">
                            điều khoản và điều kiện
                          </a>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-white"
                      onClick={() => {
                        setStep(2)
                        setProgress(50)
                      }}
                      disabled={isProcessing}
                    >
                      Quay Lại
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
                      onClick={handleContinue}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        "Tiếp Tục"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === 4 && (
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Xác Nhận Đặt Cọc</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Vui lòng kiểm tra lại thông tin trước khi hoàn tất đặt cọc
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <h3 className="font-medium text-white mb-3">Thông tin xe</h3>
                        <div className="flex gap-4 items-center">
                          <div className="relative w-16 h-16">
                            <Image
                              src={selectedCarData?.image || ""}
                              alt={selectedCarData?.name || ""}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-white font-medium">{selectedCarData?.name}</p>
                            <p className="text-zinc-400 text-sm">Giá từ: {selectedCarData?.price}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <h3 className="font-medium text-white mb-3">Thông tin đặt cọc</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Số tiền đặt cọc:</span>
                            <span className="text-white font-medium">
                              {Number.parseInt(depositAmount).toLocaleString("vi-VN")} VNĐ
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Phương thức thanh toán:</span>
                            <span className="text-white font-medium">
                              {paymentMethod === "credit-card"
                                ? "Thẻ tín dụng"
                                : paymentMethod === "bank-transfer"
                                  ? "Chuyển khoản ngân hàng"
                                  : "Ví điện tử"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <h3 className="font-medium text-white mb-3">Thông tin cá nhân</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Họ và tên:</span>
                            <span className="text-white">Nguyễn Văn A</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Số điện thoại:</span>
                            <span className="text-white">0912345678</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Email:</span>
                            <span className="text-white">example@gmail.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Địa chỉ:</span>
                            <span className="text-white">123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="confirm" className="text-red-500 border-zinc-600" />
                        <label
                          htmlFor="confirm"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                        >
                          Tôi xác nhận thông tin trên là chính xác và đồng ý hoàn tất đặt cọc
                        </label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-white"
                      onClick={() => {
                        setStep(3)
                        setProgress(75)
                      }}
                      disabled={isProcessing}
                    >
                      Quay Lại
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
                      onClick={handleContinue}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        "Hoàn Tất Đặt Cọc"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div>
              <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Tóm Tắt Đơn Hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-16 h-16">
                        <Image
                          src={selectedCarData?.image || ""}
                          alt={selectedCarData?.name || ""}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedCarData?.name}</p>
                        <p className="text-zinc-400 text-sm">Giá từ: {selectedCarData?.price}</p>
                      </div>
                    </div>

                    <div className="border-t border-zinc-700 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-400">Số tiền đặt cọc:</span>
                        <span className="text-white font-medium">
                          {Number.parseInt(depositAmount).toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Phương thức thanh toán:</span>
                        <span className="text-white">
                          {paymentMethod === "credit-card"
                            ? "Thẻ tín dụng"
                            : paymentMethod === "bank-transfer"
                              ? "Chuyển khoản ngân hàng"
                              : "Ví điện tử"}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-zinc-700 pt-4">
                      <div className="flex justify-between font-medium">
                        <span className="text-zinc-300">Tổng cộng:</span>
                        <span className="text-red-500">
                          {Number.parseInt(depositAmount).toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <Shield className="h-4 w-4 text-red-500" />
                    <p>Giao dịch của bạn được bảo mật 100%</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
