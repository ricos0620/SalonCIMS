"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Calendar, MessageSquare, BarChart3, Settings, Home, Menu, X } from "lucide-react"
import { useState } from "react"

const navigation = [
   { name: "顧客管理", href: "/customers", icon: Users },
  { name: "施術管理", href: "/treatments", icon: Calendar },
  { name: "カウンセリング", href: "/counseling", icon: MessageSquare },
  { name: "分析", href: "/analytics", icon: BarChart3 },
  { name: "設定", href: "/dashboard/settings", icon: Settings },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // counseling記入画面ではヘッダー非表示
  if (pathname.startsWith("/counseling")) {
    return null
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* ロゴ・ブランド名 */}
          <div className="flex items-center">
            {/* ここだけ修正 */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CIMS</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">SalonCIMS</span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          {/* ↓↓↓ ここだけ修正 ↓↓↓ */}
          <nav className="hidden md:flex flex-1 justify-evenly items-center">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          {/* ↑↑↑ ここだけ修正 ↑↑↑ */}

          {/* 右側のアクション */}
          <div className="flex items-center space-x-4">
            {/* モバイルメニューボタン */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
