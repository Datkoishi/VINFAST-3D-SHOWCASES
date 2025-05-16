import Link from "next/link"
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-10">
          <Image src="/images/vinfast-logo.png" alt="VinFast Logo" width={60} height={60} className="mb-4" />
          <h3 className="font-bold text-xl text-white mb-2">VinFast 3D Showcase</h3>
          <p className="text-zinc-400 text-center max-w-md">
            Trải nghiệm các mô hình 3D của dòng xe VinFast với công nghệ hiện đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Liên Kết</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/models" className="text-zinc-400 hover:text-white transition-colors">
                  Các Dòng Xe
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-white mb-4">Dòng Xe</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/models/lux-2-0" className="text-zinc-400 hover:text-white transition-colors">
                  VinFast Lux 2.0
                </Link>
              </li>
              <li>
                <Link href="/models/vf8" className="text-zinc-400 hover:text-white transition-colors">
                  VinFast VF8
                </Link>
              </li>
              <li>
                <Link href="/models/vf9" className="text-zinc-400 hover:text-white transition-colors">
                  VinFast VF9
                </Link>
              </li>
              <li>
                <Link href="/models/vf6" className="text-zinc-400 hover:text-white transition-colors">
                  VinFast VF6
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-white mb-4">Hỗ Trợ</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Đặt Lịch Lái Thử
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Tìm Đại Lý
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Chính Sách Bảo Hành
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-white mb-4">Kết Nối</h3>
            <div className="flex space-x-4 mb-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
            <p className="text-zinc-400 text-sm">Hotline: 1900 23 23 89</p>
            <p className="text-zinc-400 text-sm">Email: support@vinfast.vn</p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 text-center text-zinc-500">
          <p>&copy; {new Date().getFullYear()} VinFast 3D Showcase. Designed & Developed by truongdat.</p>
        </div>
      </div>
    </footer>
  )
}
