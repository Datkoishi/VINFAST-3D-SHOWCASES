// Dịch vụ chat đơn giản với các phản hồi được định nghĩa trước

interface ChatResponse {
    text: string
    suggestedActions?: string[]
  }
  
  export const getChatbotResponse = (message: string): ChatResponse => {
    const lowerMessage = message.toLowerCase()
  
    // Câu hỏi về giá
    if (lowerMessage.includes("giá") || lowerMessage.includes("bao nhiêu") || lowerMessage.includes("chi phí")) {
      return {
        text: "Giá xe VinFast phụ thuộc vào từng dòng xe và phiên bản:\n\n- VF6: từ 675.000.000 VNĐ\n- VF8: từ 1.057.100.000 VNĐ\n- VF9: từ 1.443.200.000 VNĐ\n\nVinFast cũng có chính sách thuê pin và mua pin linh hoạt. Bạn quan tâm đến dòng xe nào?",
        suggestedActions: ["VF6", "VF8", "VF9", "Chính sách pin"],
      }
    }
  
    // Câu hỏi về lái thử
    if (lowerMessage.includes("lái thử") || lowerMessage.includes("test drive")) {
      return {
        text: "Bạn có thể đặt lịch lái thử xe VinFast tại đại lý gần nhất. Vui lòng cung cấp thông tin liên hệ và chúng tôi sẽ sắp xếp lịch lái thử cho bạn. Hoặc bạn có thể gặp tư vấn viên để được hỗ trợ nhanh hơn.",
        suggestedActions: ["Đặt lịch lái thử", "Tìm đại lý gần nhất", "Gặp tư vấn viên"],
      }
    }
  
    // Câu hỏi về AR/VR
    if (lowerMessage.includes("ar") || lowerMessage.includes("vr") || lowerMessage.includes("thực tế ảo")) {
      return {
        text: "VinFast cung cấp trải nghiệm AR/VR cho phép bạn xem xe trong không gian thực hoặc môi trường ảo. Bạn có thể truy cập tính năng này trong mục AR/VR trên trang web của chúng tôi. Bạn muốn tôi hướng dẫn cách sử dụng không?",
        suggestedActions: ["Hướng dẫn AR", "Hướng dẫn VR", "Xem mẫu xe trong AR"],
      }
    }
  
    // Câu hỏi về thanh toán
    if (lowerMessage.includes("thanh toán") || lowerMessage.includes("trả góp") || lowerMessage.includes("mua xe")) {
      return {
        text: "VinFast cung cấp nhiều phương thức thanh toán linh hoạt, bao gồm thanh toán một lần và trả góp với lãi suất ưu đãi. Bạn có thể tham khảo chi tiết tại mục Thanh Toán trên trang web. Bạn muốn kết nối với tư vấn viên để biết thêm chi tiết không?",
        suggestedActions: ["Phương thức thanh toán", "Chính sách trả góp", "Gặp tư vấn viên"],
      }
    }
  
    // Câu hỏi về pin
    if (lowerMessage.includes("pin") || lowerMessage.includes("battery") || lowerMessage.includes("sạc")) {
      return {
        text: "Các xe điện VinFast được trang bị pin lithium-ion hiệu suất cao với thời gian sạc từ 24-35 phút (sạc nhanh từ 10% đến 70%). VinFast cung cấp chính sách thuê pin và bảo hành pin lên đến 10 năm. Bạn muốn biết thêm thông tin gì về pin không?",
        suggestedActions: ["Chính sách thuê pin", "Trạm sạc", "Thời gian sạc", "Tuổi thọ pin"],
      }
    }
  
    // Câu hỏi về VF6
    if (lowerMessage.includes("vf6")) {
      return {
        text: "VF6 là mẫu SUV điện cỡ nhỏ của VinFast với thiết kế năng động, phù hợp cho đô thị. VF6 có giá từ 675.000.000 VNĐ, được trang bị động cơ điện 201 mã lực và phạm vi hoạt động lên đến 381km. Bạn muốn biết thêm thông tin gì về VF6?",
        suggestedActions: ["Thông số kỹ thuật VF6", "Xem VF6 trong AR", "Đặt lịch lái thử VF6"],
      }
    }
  
    // Câu hỏi về VF8
    if (lowerMessage.includes("vf8")) {
      return {
        text: "VF8 là mẫu SUV điện cỡ trung của VinFast với thiết kế hiện đại và công nghệ tiên tiến. VF8 có giá từ 1.057.100.000 VNĐ, được trang bị động cơ điện 402 mã lực và phạm vi hoạt động lên đến 420km. Bạn muốn biết thêm thông tin gì về VF8?",
        suggestedActions: ["Thông số kỹ thuật VF8", "Xem VF8 trong AR", "Đặt lịch lái thử VF8"],
      }
    }
  
    // Câu hỏi về VF9
    if (lowerMessage.includes("vf9")) {
      return {
        text: "VF9 là mẫu SUV điện cỡ lớn của VinFast với không gian rộng rãi, phù hợp cho gia đình. VF9 có giá từ 1.443.200.000 VNĐ, được trang bị động cơ điện 402 mã lực và phạm vi hoạt động lên đến 438km. Bạn muốn biết thêm thông tin gì về VF9?",
        suggestedActions: ["Thông số kỹ thuật VF9", "Xem VF9 trong AR", "Đặt lịch lái thử VF9"],
      }
    }
  
    // Câu hỏi về hỗ trợ
    if (lowerMessage.includes("tư vấn") || lowerMessage.includes("hỗ trợ") || lowerMessage.includes("gặp người")) {
      return {
        text: "Tôi có thể kết nối bạn với tư vấn viên VinFast để được hỗ trợ trực tiếp. Bạn có muốn kết nối ngay không?",
        suggestedActions: ["Kết nối với tư vấn viên", "Đặt lịch gọi lại", "Tiếp tục chat với bot"],
      }
    }
  
    // Lời chào
    if (
      lowerMessage.includes("xin chào") ||
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("chào")
    ) {
      return {
        text: "Xin chào! Tôi là trợ lý ảo VinFast. Tôi có thể giúp gì cho bạn về các dòng xe VinFast?",
        suggestedActions: ["Thông tin về xe", "Giá xe", "Đặt lịch lái thử", "Gặp tư vấn viên"],
      }
    }
  
    // Phản hồi mặc định
    return {
      text: "Cảm ơn bạn đã liên hệ. Để được tư vấn chi tiết hơn, bạn có thể kết nối với tư vấn viên của chúng tôi hoặc đặt câu hỏi cụ thể hơn về các dòng xe VinFast, tính năng, giá cả hoặc chính sách bán hàng.",
      suggestedActions: ["Thông tin về xe", "Giá xe", "Đặt lịch lái thử", "Gặp tư vấn viên"],
    }
  }
  