### VinFast 3D Showcase

<div>

`<h3>`Trải nghiệm xe VinFast trong không gian 3D`</h3>`
`<h3>`Experience VinFast cars in 3D space`</h3>`

</div>## 📝 Giới thiệu | Introduction

**VinFast 3D Showcase** là một ứng dụng web hiện đại cho phép người dùng khám phá và tương tác với các mô hình 3D của xe VinFast. Dự án này sử dụng công nghệ WebGL và Three.js để tạo trải nghiệm 3D mượt mà và chân thực, giúp người dùng có cái nhìn chi tiết về các dòng xe VinFast trước khi đưa ra quyết định mua hàng.

**VinFast 3D Showcase** is a modern web application that allows users to explore and interact with 3D models of VinFast cars. This project uses WebGL and Three.js technologies to create a smooth and realistic 3D experience, giving users a detailed view of VinFast car models before making a purchase decision.

## ✨ Tính năng | Features

- **Xem mô hình 3D** - Xoay, phóng to và khám phá chi tiết các mẫu xe VinFast
- **Điểm thông tin tương tác** - Nhấp vào các điểm đỏ để xem thông tin chi tiết về từng bộ phận của xe
- **Chế độ xem đa dạng** - Chuyển đổi giữa chế độ xem ngoại thất, nội thất và động cơ
- **Thay đổi màu sắc** - Xem xe với các màu sắc khác nhau
- **Thông số kỹ thuật** - Xem đầy đủ thông số kỹ thuật của từng dòng xe
- **Thiết kế đáp ứng** - Trải nghiệm tốt trên mọi thiết bị, từ điện thoại di động đến máy tính để bàn


---

- **3D Model Viewing** - Rotate, zoom, and explore VinFast car models in detail
- **Interactive Hotspots** - Click on red points to view detailed information about each part of the car
- **Multiple View Modes** - Switch between exterior, interior, and engine views
- **Color Customization** - View the car in different colors
- **Technical Specifications** - View complete technical specifications for each car model
- **Responsive Design** - Great experience on all devices, from mobile phones to desktops


## 🛠️ Công nghệ sử dụng | Technologies Used

- **Next.js** - Framework React cho phát triển ứng dụng web
- **React Three Fiber** - Thư viện React cho Three.js
- **Three.js** - Thư viện JavaScript cho đồ họa 3D trên web
- **TypeScript** - Ngôn ngữ lập trình JavaScript với kiểu dữ liệu tĩnh
- **Tailwind CSS** - Framework CSS tiện ích
- **Framer Motion** - Thư viện animation cho React
- **Shadcn UI** - Thư viện component UI cho React


## 🚀 Cài đặt và chạy | Installation and Running

### Yêu cầu hệ thống | Prerequisites

- Node.js (v18.0.0 hoặc cao hơn)
- npm hoặc yarn


### Các bước cài đặt | Installation Steps

1. Clone repository:


```shellscript
git clone https://github.com/your-username/vinfast-3d-showcase.git
cd vinfast-3d-showcase
```

2. Cài đặt các dependencies:


```shellscript
npm install
# hoặc
yarn install
```

3. Chạy ứng dụng ở môi trường phát triển:


```shellscript
npm run dev
# hoặc
yarn dev
```

4. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)


### Xây dựng cho môi trường production | Build for Production

```shellscript
npm run build
npm run start
# hoặc
yarn build
yarn start
```

## 📁 Cấu trúc dự án | Project Structure

```plaintext
vinfast-3d-showcase/
├── app/                    # Next.js app router
│   ├── cars/               # Car detail pages
│   ├── models/             # Car models listing pages
│   ├── page.tsx            # Home page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── car-viewer.tsx      # 3D car viewer component
│   ├── car-specifications.tsx # Car specifications component
│   ├── header.tsx          # Header component
│   ├── footer.tsx          # Footer component
│   └── ui/                 # UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static assets
│   ├── images/             # Images
│   └── models/             # 3D models (.glb files)
├── styles/                 # Global styles
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Project dependencies
```

## 📖 Hướng dẫn sử dụng | Usage Guide

### Xem mô hình 3D | Viewing 3D Models

1. Truy cập trang chủ và chọn một mẫu xe từ danh sách
2. Sử dụng chuột hoặc ngón tay để xoay mô hình:

1. Nhấp và kéo để xoay
2. Cuộn để phóng to/thu nhỏ
3. Nhấp đúp để đặt lại góc nhìn





### Tương tác với điểm thông tin | Interacting with Hotspots

1. Nhấp vào các điểm đỏ trên mô hình để xem thông tin chi tiết về bộ phận đó
2. Sử dụng các nút chế độ xem để chuyển đổi giữa ngoại thất, nội thất và động cơ
3. Bật/tắt điểm thông tin bằng nút "Hiện/Ẩn Điểm Thông Tin"


### Thay đổi màu sắc | Changing Colors

1. Chọn một màu từ bảng màu bên dưới mô hình
2. Mô hình sẽ cập nhật ngay lập tức để hiển thị màu đã chọn


## 🤝 Đóng góp | Contributing

Chúng tôi hoan nghênh mọi đóng góp cho dự án! Nếu bạn muốn đóng góp, vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit các thay đổi của bạn (`git commit -m 'Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request


## 📄 Giấy phép | License

Dự án này được cấp phép theo giấy phép MIT - xem tệp [LICENSE](LICENSE) để biết chi tiết.

## 📞 Liên hệ | Contact

Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng liên hệ:

- Email: [My email](mailto:truongdinhdetrel@gmail.com)
- Website: [My profile](https://truongdat.glitch.me)
- GitHub: [Datkoishi](https://github.com/Datkoishi)


---

<div>`<p>`Được phát triển với ❤️ bởi Truong Dat`</p>`
`<p>`Developed with ❤️ by Truong Dat`</p>`

</div>
