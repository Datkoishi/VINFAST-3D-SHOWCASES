"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, FileText, Upload, Download, CheckCircle2, Info, Pen, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

export default function ContractPage() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [signatureMethod, setSignatureMethod] = useState("digital")
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

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
          title: "Ký hợp đồng thành công",
          description:
            "Cảm ơn bạn đã ký hợp đồng mua xe VinFast. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
        })
      }, 2000)
    }
  }

  const handleSignatureUpload = () => {
    setHasSignature(true)
    toast({
      title: "Tải lên thành công",
      description: "Chữ ký của bạn đã được tải lên thành công",
    })
  }

  const handleSignatureComplete = () => {
    setHasSignature(true)
    setIsDrawing(false)
    toast({
      title: "Ký thành công",
      description: "Chữ ký của bạn đã được lưu thành công",
    })
  }

  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-black to-zinc-900 min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5 bg-repeat"></div>
      <BackgroundBeams className="opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/payment">
            <Button variant="outline" size="icon" className="border-zinc-700 text-white">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Ký Kết Hợp Đồng</h1>
        </div>

        {isComplete ? (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Ký Hợp Đồng Thành Công</h2>
                  <p className="text-zinc-400 text-center max-w-md mb-6">
                    Cảm ơn bạn đã ký hợp đồng mua xe VinFast. Chúng tôi đã gửi bản hợp đồng đến email của bạn.
                  </p>
                  <div className="bg-zinc-800/50 rounded-lg p-4 w-full max-w-md mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-400">Mã hợp đồng:</span>
                      <span className="text-white font-medium">HD{Math.floor(Math.random() * 1000000)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-400">Ngày ký:</span>
                      <span className="text-white font-medium">{new Date().toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-400">Trạng thái:</span>
                      <span className="text-green-500 font-medium">Đã ký</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Phương thức ký:</span>
                      <span className="text-white font-medium">
                        {signatureMethod === "digital" ? "Chữ ký điện tử" : "Chữ ký số"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
                      onClick={() => {
                        toast({
                          title: "Tải xuống hợp đồng",
                          description: "Hợp đồng đang được tải xuống",
                        })
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Tải Xuống Hợp Đồng
                    </Button>
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
                    <span className={step >= 1 ? "text-white font-medium" : ""}>Xem hợp đồng</span>
                    <span className={step >= 2 ? "text-white font-medium" : ""}>Xác minh thông tin</span>
                    <span className={step >= 3 ? "text-white font-medium" : ""}>Ký hợp đồng</span>
                    <span className={step >= 4 ? "text-white font-medium" : ""}>Xác nhận</span>
                  </div>
                </CardHeader>
              </Card>

              {step === 1 && (
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Xem Hợp Đồng</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Vui lòng đọc kỹ hợp đồng trước khi tiếp tục
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-zinc-800 rounded-lg p-4 mb-6 h-[400px] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">HỢP ĐỒNG MUA BÁN XE Ô TÔ</h3>
                        <FileText className="h-5 w-5 text-red-500" />
                      </div>

                      <div className="space-y-4 text-zinc-300">
                        <p className="font-medium">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                        <p className="font-medium">Độc lập - Tự do - Hạnh phúc</p>
                        <p className="text-center">---o0o---</p>

                        <div>
                          <p className="mb-2">Hôm nay, ngày {new Date().toLocaleDateString("vi-VN")}, tại Hà Nội</p>
                          <p className="mb-2">Chúng tôi gồm:</p>
                        </div>

                        <div>
                          <p className="font-medium">BÊN BÁN (Bên A):</p>
                          <p>Tên công ty: CÔNG TY CỔ PHẦN VINFAST</p>
                          <p>Địa chỉ: Khu kinh tế Đình Vũ - Cát Hải, Đảo Cát Hải, Thành phố Hải Phòng, Việt Nam</p>
                          <p>Mã số thuế: 0107894871</p>
                          <p>Đại diện: Ông Phạm Nhật Vượng</p>
                          <p>Chức vụ: Chủ tịch HĐQT</p>
                        </div>

                        <div>
                          <p className="font-medium">BÊN MUA (Bên B):</p>
                          <p>Ông/Bà: Nguyễn Văn A</p>
                          <p>CMND/CCCD số: 012345678910</p>
                          <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                          <p>Điện thoại: 0912345678</p>
                          <p>Email: example@gmail.com</p>
                        </div>

                        <div>
                          <p className="font-medium">
                            Hai bên thống nhất ký kết hợp đồng mua bán xe ô tô với các điều khoản sau:
                          </p>
                        </div>

                        <div>
                          <p className="font-medium">ĐIỀU 1: ĐỐI TƯỢNG VÀ GIÁ TRỊ HỢP ĐỒNG</p>
                          <p>
                            1.1. Đối tượng: Bên A đồng ý bán và Bên B đồng ý mua xe ô tô với các thông số kỹ thuật như
                            sau:
                          </p>
                          <p>- Nhãn hiệu: VinFast</p>
                          <p>- Model: Lux 2.0</p>
                          <p>- Màu sơn: Đỏ</p>
                          <p>- Số khung: ...</p>
                          <p>- Số máy: ...</p>
                          <p>- Năm sản xuất: 2023</p>
                          <p>1.2. Giá trị hợp đồng: 999.000.000 VNĐ (Bằng chữ: Chín trăm chín mươi chín triệu đồng)</p>
                        </div>

                        <div>
                          <p className="font-medium">ĐIỀU 2: PHƯƠNG THỨC THANH TOÁN</p>
                          <p>2.1. Đặt cọc: 50.000.000 VNĐ (Bằng chữ: Năm mươi triệu đồng)</p>
                          <p>2.2. Thanh toán lần 1: 50% giá trị hợp đồng, tương đương 499.500.000 VNĐ</p>
                          <p>2.3. Thanh toán lần 2: 50% giá trị hợp đồng còn lại, tương đương 449.500.000 VNĐ</p>
                        </div>

                        <div>
                          <p className="font-medium">ĐIỀU 3: THỜI GIAN VÀ ĐỊA ĐIỂM GIAO XE</p>
                          <p>3.1. Thời gian giao xe: Dự kiến trong vòng 30 ngày kể từ ngày ký hợp đồng</p>
                          <p>3.2. Địa điểm giao xe: Showroom VinFast</p>
                        </div>

                        <div>
                          <p className="font-medium">ĐIỀU 4: BẢO HÀNH VÀ BẢO DƯỠNG</p>
                          <p>4.1. Thời gian bảo hành: 5 năm hoặc 100.000 km tùy điều kiện nào đến trước</p>
                          <p>4.2. Chế độ bảo dưỡng: Theo quy định của nhà sản xuất</p>
                        </div>

                        <div>
                          <p className="font-medium">ĐIỀU 5: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN</p>
                          <p>5.1. Quyền và nghĩa vụ của Bên A:</p>
                          <p>- Giao xe đúng thời hạn, đúng chất lượng, đúng số lượng</p>
                          <p>- Cung cấp đầy đủ hồ sơ, giấy tờ liên quan đến xe</p>
                          <p>5.2. Quyền và nghĩa vụ của Bên B:</p>
                          <p>- Thanh toán đúng hạn, đủ số tiền theo thỏa thuận</p>
                          <p>- Nhận xe đúng thời hạn đã thỏa thuận</p>
                        </div>

                        <div>
                          <p className="font-medium">ĐIỀU 6: ĐIỀU KHOẢN CHUNG</p>
                          <p>6.1. Hợp đồng này có hiệu lực kể từ ngày ký</p>
                          <p>
                            6.2. Mọi tranh chấp phát sinh từ hợp đồng này sẽ được giải quyết thông qua thương lượng, hòa
                            giải. Trường hợp không thể giải quyết được, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền
                            để giải quyết
                          </p>
                          <p>6.3. Hợp đồng này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị pháp lý như nhau</p>
                        </div>

                        <div className="pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="font-medium">ĐẠI DIỆN BÊN A</p>
                              <p>(Ký, ghi rõ họ tên)</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">ĐẠI DIỆN BÊN B</p>
                              <p>(Ký, ghi rõ họ tên)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="read-contract" className="text-red-500 border-zinc-600" />
                      <label
                        htmlFor="read-contract"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                      >
                        Tôi đã đọc và hiểu rõ các điều khoản trong hợp đồng
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="border-zinc-700 text-white" disabled>
                      Quay Lại
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="border-zinc-700 text-white"
                        onClick={() => {
                          toast({
                            title: "Tải xuống hợp đồng",
                            description: "Hợp đồng đang được tải xuống",
                          })
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Tải Xuống
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
                    </div>
                  </CardFooter>
                </Card>
              )}

              {step === 2 && (
                <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Xác Minh Thông Tin</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Vui lòng xác minh thông tin cá nhân của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full-name" className="text-white">
                            Họ và tên
                          </Label>
                          <Input
                            id="full-name"
                            defaultValue="Nguyễn Văn A"
                            className="bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-white">
                            Số điện thoại
                          </Label>
                          <Input
                            id="phone"
                            defaultValue="0912345678"
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
                          defaultValue="example@gmail.com"
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address" className="text-white">
                          Địa chỉ
                        </Label>
                        <Input
                          id="address"
                          defaultValue="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="id-number" className="text-white">
                          Số CMND/CCCD
                        </Label>
                        <Input
                          id="id-number"
                          defaultValue="012345678910"
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <h3 className="font-medium text-white mb-3">Tải lên giấy tờ xác minh</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-dashed border-zinc-700 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                            <p className="text-zinc-400 text-sm mb-2">CMND/CCCD (mặt trước)</p>
                            <Button variant="outline" size="sm" className="border-zinc-700 text-white">
                              Chọn tệp
                            </Button>
                          </div>
                          <div className="border border-dashed border-zinc-700 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                            <p className="text-zinc-400 text-sm mb-2">CMND/CCCD (mặt sau)</p>
                            <Button variant="outline" size="sm" className="border-zinc-700 text-white">
                              Chọn tệp
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="verify-info" className="text-red-500 border-zinc-600" />
                        <label
                          htmlFor="verify-info"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                        >
                          Tôi xác nhận thông tin trên là chính xác và đồng ý chịu trách nhiệm trước pháp luật
                        </label>
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
                    <CardTitle className="text-white">Ký Hợp Đồng</CardTitle>
                    <CardDescription className="text-zinc-400">Chọn phương thức ký hợp đồng</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={signatureMethod} onValueChange={setSignatureMethod} className="w-full">
                      <TabsList className="grid grid-cols-2 mb-6 bg-zinc-800 p-1 rounded-lg">
                        <TabsTrigger
                          value="digital"
                          className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                        >
                          <Pen className="h-4 w-4 mr-2" />
                          Chữ ký điện tử
                        </TabsTrigger>
                        <TabsTrigger
                          value="certificate"
                          className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Chữ ký số
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="digital" className="mt-0">
                        <div className="space-y-6">
                          <div className="bg-zinc-800/50 rounded-lg p-4">
                            <h3 className="font-medium text-white mb-3">Tạo chữ ký điện tử</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-zinc-400 text-sm mb-3">Vẽ chữ ký của bạn</p>
                                {isDrawing ? (
                                  <div className="border border-dashed border-zinc-700 rounded-lg h-40 bg-zinc-900 flex flex-col items-center justify-center">
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Image
                                        src="/images/signature-example.png"
                                        alt="Signature"
                                        width={200}
                                        height={100}
                                        className="object-contain"
                                      />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-zinc-700 text-white"
                                        onClick={() => setIsDrawing(false)}
                                      >
                                        Xóa
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0"
                                        onClick={handleSignatureComplete}
                                      >
                                        Hoàn tất
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="border border-dashed border-zinc-700 rounded-lg h-40 bg-zinc-900 flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors"
                                    onClick={() => setIsDrawing(true)}
                                  >
                                    {hasSignature ? (
                                      <div className="text-center">
                                        <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                        <p className="text-green-500">Đã ký</p>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <Pen className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                                        <p className="text-zinc-400">Nhấp để vẽ chữ ký</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-zinc-400 text-sm mb-3">Hoặc tải lên chữ ký</p>
                                <div className="border border-dashed border-zinc-700 rounded-lg h-40 bg-zinc-900 flex flex-col items-center justify-center">
                                  {hasSignature ? (
                                    <div className="text-center">
                                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                      <p className="text-green-500">Đã tải lên</p>
                                    </div>
                                  ) : (
                                    <>
                                      <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                                      <p className="text-zinc-400 text-sm mb-2">Tải lên hình ảnh chữ ký</p>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-zinc-700 text-white"
                                        onClick={handleSignatureUpload}
                                      >
                                        Chọn tệp
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-zinc-400">
                            <Info className="h-5 w-5 text-red-500 shrink-0" />
                            <p className="text-sm">
                              Chữ ký điện tử của bạn sẽ được sử dụng để ký hợp đồng. Vui lòng đảm bảo chữ ký rõ ràng và
                              chính xác.
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="certificate" className="mt-0">
                        <div className="space-y-6">
                          <div className="bg-zinc-800/50 rounded-lg p-4">
                            <h3 className="font-medium text-white mb-3">Sử dụng chữ ký số</h3>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="certificate-id" className="text-white">
                                  Mã chứng thư số
                                </Label>
                                <Input
                                  id="certificate-id"
                                  placeholder="Nhập mã chứng thư số"
                                  className="bg-zinc-800 border-zinc-700 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="certificate-password" className="text-white">
                                  Mật khẩu
                                </Label>
                                <Input
                                  id="certificate-password"
                                  type="password"
                                  placeholder="Nhập mật khẩu"
                                  className="bg-zinc-800 border-zinc-700 text-white"
                                />
                              </div>
                              <div className="border border-dashed border-zinc-700 rounded-lg p-4 text-center">
                                <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                                <p className="text-zinc-400 text-sm mb-2">Tải lên tệp chứng thư số (.p12, .pfx)</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-zinc-700 text-white"
                                  onClick={() => {
                                    setHasSignature(true)
                                    toast({
                                      title: "Tải lên thành công",
                                      description: "Chứng thư số của bạn đã được tải lên thành công",
                                    })
                                  }}
                                >
                                  Chọn tệp
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-zinc-400">
                            <Info className="h-5 w-5 text-red-500 shrink-0" />
                            <p className="text-sm">
                              Chữ ký số là chữ ký điện tử được tạo ra bởi một quá trình biến đổi thông điệp dữ liệu, sử
                              dụng hệ thống mật mã không đối xứng, theo đó người có được thông điệp dữ liệu ban đầu và
                              khóa công khai của người ký có thể xác định chính xác.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
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
                      disabled={isProcessing || !hasSignature}
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
                    <CardTitle className="text-white">Xác Nhận Ký Hợp Đồng</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Vui lòng kiểm tra lại thông tin trước khi hoàn tất ký hợp đồng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <h3 className="font-medium text-white mb-3">Thông tin hợp đồng</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Loại hợp đồng:</span>
                            <span className="text-white">Hợp đồng mua bán xe ô tô</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Mã hợp đồng:</span>
                            <span className="text-white">HD{Math.floor(Math.random() * 1000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Ngày ký:</span>
                            <span className="text-white">{new Date().toLocaleDateString("vi-VN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Phương thức ký:</span>
                            <span className="text-white">
                              {signatureMethod === "digital" ? "Chữ ký điện tử" : "Chữ ký số"}
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
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Số CMND/CCCD:</span>
                            <span className="text-white">012345678910</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <h3 className="font-medium text-white mb-3">Thông tin xe</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Nhãn hiệu:</span>
                            <span className="text-white">VinFast</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Model:</span>
                            <span className="text-white">Lux 2.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Màu sắc:</span>
                            <span className="text-white">Đỏ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Giá xe:</span>
                            <span className="text-white">999.000.000 VNĐ</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="confirm-sign" className="text-red-500 border-zinc-600" />
                        <label
                          htmlFor="confirm-sign"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                        >
                          Tôi xác nhận thông tin trên là chính xác và đồng ý ký hợp đồng
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
                        "Hoàn Tất Ký Hợp Đồng"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div>
              <Card className="bg-zinc-800/30 backdrop-blur-sm border-zinc-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Trạng Thái Hợp Đồng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-red-500" : "bg-zinc-700"}`}
                        >
                          {step > 1 ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <span className="text-white font-medium">1</span>
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${step >= 1 ? "text-white" : "text-zinc-500"}`}>Xem hợp đồng</p>
                          {step === 1 && <p className="text-zinc-400 text-sm">Đang thực hiện</p>}
                          {step > 1 && <p className="text-green-500 text-sm">Hoàn thành</p>}
                        </div>
                      </div>
                      <div className="w-0.5 h-6 bg-zinc-700 ml-4"></div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-red-500" : "bg-zinc-700"}`}
                        >
                          {step > 2 ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <span className="text-white font-medium">2</span>
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${step >= 2 ? "text-white" : "text-zinc-500"}`}>
                            Xác minh thông tin
                          </p>
                          {step === 2 && <p className="text-zinc-400 text-sm">Đang thực hiện</p>}
                          {step > 2 && <p className="text-green-500 text-sm">Hoàn thành</p>}
                          {step < 2 && <p className="text-zinc-500 text-sm">Chưa thực hiện</p>}
                        </div>
                      </div>
                      <div className="w-0.5 h-6 bg-zinc-700 ml-4"></div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-red-500" : "bg-zinc-700"}`}
                        >
                          {step > 3 ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <span className="text-white font-medium">3</span>
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${step >= 3 ? "text-white" : "text-zinc-500"}`}>Ký hợp đồng</p>
                          {step === 3 && <p className="text-zinc-400 text-sm">Đang thực hiện</p>}
                          {step > 3 && <p className="text-green-500 text-sm">Hoàn thành</p>}
                          {step < 3 && <p className="text-zinc-500 text-sm">Chưa thực hiện</p>}
                        </div>
                      </div>
                      <div className="w-0.5 h-6 bg-zinc-700 ml-4"></div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? "bg-red-500" : "bg-zinc-700"}`}
                        >
                          {step > 4 ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <span className="text-white font-medium">4</span>
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${step >= 4 ? "text-white" : "text-zinc-500"}`}>Xác nhận</p>
                          {step === 4 && <p className="text-zinc-400 text-sm">Đang thực hiện</p>}
                          {step > 4 && <p className="text-green-500 text-sm">Hoàn thành</p>}
                          {step < 4 && <p className="text-zinc-500 text-sm">Chưa thực hiện</p>}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-700 pt-4">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Clock className="h-4 w-4 text-red-500" />
                        <p className="text-sm">Thời gian hoàn thành: {new Date().toLocaleTimeString("vi-VN")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
