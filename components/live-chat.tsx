"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send, User, Bot, Phone, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { getChatbotResponse } from "@/app/services/chat-service"

interface Message {
  id: string
  content: string
  sender: "user" | "bot" | "agent"
  timestamp: Date
  suggestedActions?: string[]
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isConnectingToAgent, setIsConnectingToAgent] = useState(false)
  const [hasAgent, setHasAgent] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Lời chào ban đầu khi chat được mở
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialResponse = getChatbotResponse("hello")
      const initialMessage: Message = {
        id: Date.now().toString(),
        content: initialResponse.text,
        sender: "bot",
        timestamp: new Date(),
        suggestedActions: initialResponse.suggestedActions,
      }
      setMessages([initialMessage])
    }

    // Đặt lại số tin nhắn chưa đọc khi chat được mở
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen, messages.length])

  // Tự động cuộn xuống cuối tin nhắn
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mô phỏng thông báo sau 30 giây nếu chat không được mở
  useEffect(() => {
    if (messages.length === 0) {
      const timer = setTimeout(() => {
        if (!isOpen) {
          const proactiveResponse = getChatbotResponse("proactive")
          const proactiveMessage: Message = {
            id: Date.now().toString(),
            content: "Xin chào! Bạn có cần hỗ trợ tìm hiểu về các dòng xe VinFast không?",
            sender: "bot",
            timestamp: new Date(),
            suggestedActions: ["Có, tôi cần hỗ trợ", "Không, cảm ơn"],
          }
          setMessages([proactiveMessage])
          setUnreadCount(1)
        }
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, messages.length])

  const handleSendMessage = (text: string = inputValue) => {
    if (!text.trim()) return

    // Thêm tin nhắn người dùng
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Mô phỏng bot đang nhập
    setIsTyping(true)

    // Nếu đã kết nối với tư vấn viên, mô phỏng phản hồi của tư vấn viên
    if (hasAgent) {
      setTimeout(() => {
        setIsTyping(false)
        const agentResponse = {
          text: getAgentResponse(text),
          suggestedActions: ["Cảm ơn", "Tôi có thêm câu hỏi", "Kết thúc cuộc trò chuyện"],
        }

        const agentMessage: Message = {
          id: Date.now().toString(),
          content: agentResponse.text,
          sender: "agent",
          timestamp: new Date(),
          suggestedActions: agentResponse.suggestedActions,
        }
        setMessages((prev) => [...prev, agentMessage])
      }, 2000)
      return
    }

    // Lấy phản hồi từ bot
    setTimeout(() => {
      setIsTyping(false)
      const botResponse = getChatbotResponse(text)

      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponse.text,
        sender: "bot",
        timestamp: new Date(),
        suggestedActions: botResponse.suggestedActions,
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const connectToAgent = () => {
    setIsConnectingToAgent(true)

    // Thêm tin nhắn hệ thống
    const systemMessage: Message = {
      id: Date.now().toString(),
      content: "Đang kết nối với tư vấn viên...",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, systemMessage])

    // Mô phỏng độ trễ kết nối
    setTimeout(() => {
      setIsConnectingToAgent(false)
      setHasAgent(true)

      // Thêm tin nhắn tư vấn viên đã kết nối
      const agentMessage: Message = {
        id: Date.now().toString(),
        content: "Xin chào, tôi là Hương - tư vấn viên VinFast. Tôi có thể giúp gì cho bạn?",
        sender: "agent",
        timestamp: new Date(),
        suggestedActions: ["Tôi muốn biết thêm về giá xe", "Tôi muốn đặt lịch lái thử", "Tôi cần tư vấn mua xe"],
      }
      setMessages((prev) => [...prev, agentMessage])

      toast({
        title: "Đã kết nối với tư vấn viên",
        description: "Bạn đã được kết nối với tư vấn viên VinFast",
      })
    }, 3000)
  }

  const handleSuggestedAction = (action: string) => {
    handleSendMessage(action)

    // Xử lý đặc biệt cho các hành động cụ thể
    if (action === "Gặp tư vấn viên" || action === "Kết nối với tư vấn viên" || action === "Có, tôi cần hỗ trợ") {
      if (!hasAgent && !isConnectingToAgent) {
        connectToAgent()
      }
    }

    if (action === "Đặt lịch lái thử" || action.includes("Đặt lịch lái thử")) {
      toast({
        title: "Đặt lịch lái thử",
        description: "Chúng tôi sẽ liên hệ với bạn để sắp xếp lịch lái thử xe VinFast",
      })
    }

    if (action === "Đặt lịch gọi lại") {
      toast({
        title: "Đặt lịch gọi lại",
        description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất",
      })
    }
  }

  // Logic phản hồi đơn giản của tư vấn viên
  const getAgentResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("giá") || lowerMessage.includes("bao nhiêu")) {
      return "Dạ, hiện tại VinFast đang có chương trình ưu đãi đặc biệt cho các dòng xe. VF8 có giá từ 1.057.100.000 VNĐ, VF9 từ 1.443.200.000 VNĐ, và VF6 từ 675.000.000 VNĐ. Ngoài ra, chúng tôi còn có chính sách trả góp với lãi suất ưu đãi. Anh/chị quan tâm đến dòng xe nào ạ?"
    }

    if (lowerMessage.includes("lái thử")) {
      return "Vâng, tôi có thể sắp xếp lịch lái thử cho anh/chị. Anh/chị vui lòng cho tôi biết khu vực sinh sống và thời gian thuận tiện, tôi sẽ kiểm tra lịch tại đại lý gần nhất và thông báo lại cho anh/chị sớm nhất có thể."
    }

    if (lowerMessage.includes("cảm ơn")) {
      return "Không có gì ạ! Rất vui được hỗ trợ anh/chị. Anh/chị có câu hỏi gì thêm không ạ? Hoặc nếu anh/chị muốn đặt lịch lái thử hay tham quan showroom, tôi có thể sắp xếp ngay."
    }

    if (lowerMessage.includes("kết thúc")) {
      return "Cảm ơn anh/chị đã liên hệ với VinFast. Rất mong được phục vụ anh/chị trong tương lai. Chúc anh/chị một ngày tốt lành!"
    }

    // Phản hồi mặc định
    return "Cảm ơn anh/chị đã liên hệ. Tôi rất vui được hỗ trợ anh/chị. Anh/chị có thể cho tôi biết thêm về nhu cầu sử dụng xe để tôi có thể tư vấn phù hợp hơn không ạ?"
  }

  return (
    <>
      {/* Bong bóng Chat */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>

              {/* Huy hiệu số tin nhắn chưa đọc */}
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                >
                  {unreadCount}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bảng Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-[370px] shadow-xl"
          >
            <Card className="border-zinc-700 bg-zinc-800/90 backdrop-blur-md overflow-hidden">
              <CardHeader className="p-4 bg-gradient-to-r from-red-600 to-red-500 flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src="/images/vinfast-logo.png" alt="VinFast" />
                    <AvatarFallback className="bg-red-600 text-white">VF</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-white text-sm">Tư vấn VinFast</h3>
                    <p className="text-white/80 text-xs">{hasAgent ? "Đang kết nối với tư vấn viên" : "Trợ lý ảo"}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-red-600/20 h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>

              <CardContent className="p-0">
                <div className="h-[350px] overflow-y-auto p-4 bg-zinc-900/50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("mb-4 max-w-[85%]", message.sender === "user" ? "ml-auto" : "mr-auto")}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender !== "user" && (
                          <Avatar className="h-8 w-8 mt-0.5">
                            {message.sender === "bot" ? (
                              <>
                                <AvatarImage src="/images/vinfast-logo.png" alt="VinFast Bot" />
                                <AvatarFallback className="bg-red-600 text-white">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              </>
                            ) : (
                              <>
                                <AvatarImage src="/images/agent-avatar.png" alt="Agent" />
                                <AvatarFallback className="bg-blue-600 text-white">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm",
                            message.sender === "user"
                              ? "bg-red-600 text-white"
                              : message.sender === "agent"
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-800 text-white",
                          )}
                        >
                          <p className="whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="h-8 w-8 mt-0.5">
                            <AvatarFallback className="bg-zinc-700 text-white">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {/* Các hành động được đề xuất */}
                      {message.suggestedActions && message.suggestedActions.length > 0 && message.sender !== "user" && (
                        <div className="mt-2 ml-10 flex flex-wrap gap-2">
                          {message.suggestedActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 bg-zinc-800/80 border-zinc-700 text-white hover:bg-zinc-700"
                              onClick={() => handleSuggestedAction(action)}
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Chỉ báo đang nhập */}
                  {isTyping && (
                    <div className="mb-4 max-w-[85%] mr-auto">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-8 w-8 mt-0.5">
                          {hasAgent ? (
                            <>
                              <AvatarImage src="/images/agent-avatar.png" alt="Agent" />
                              <AvatarFallback className="bg-blue-600 text-white">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/images/vinfast-logo.png" alt="VinFast Bot" />
                              <AvatarFallback className="bg-red-600 text-white">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div className="bg-zinc-800 rounded-lg px-4 py-2 text-white">
                          <div className="flex space-x-1">
                            <div
                              className="h-2 w-2 rounded-full bg-white/60 animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 rounded-full bg-white/60 animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 rounded-full bg-white/60 animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-3 border-t border-zinc-700 bg-zinc-800/80">
                {!hasAgent && !isConnectingToAgent && (
                  <div className="grid grid-cols-2 gap-2 w-full mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 text-white hover:bg-zinc-700"
                      onClick={connectToAgent}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Gặp tư vấn viên
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 text-white hover:bg-zinc-700"
                      onClick={() => {
                        toast({
                          title: "Đặt lịch gọi lại",
                          description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất",
                        })
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Gọi lại cho tôi
                    </Button>
                  </div>
                )}

                {isConnectingToAgent ? (
                  <div className="w-full flex items-center justify-center py-2">
                    <Clock className="h-4 w-4 text-red-500 animate-spin mr-2" />
                    <span className="text-sm text-white">Đang kết nối với tư vấn viên...</span>
                  </div>
                ) : (
                  <div className="flex w-full gap-2">
                    <Input
                      placeholder="Nhập tin nhắn..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
