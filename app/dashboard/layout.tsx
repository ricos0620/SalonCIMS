"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, FileText, Settings, Menu, X, LogOut, Store, Home } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useSupabaseAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [salons, setSalons] = useState<any[]>([])
  const [selectedSalonId, setSelectedSalonId] = useLocalStorage<string>("selected_salon_id", "1")

  // 認証チェック
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // 店舗情報を取得
  useEffect(() => {
    const fetchSalons = () => {
      const storedSalons = localStorage.getItem("salon_branches")
      if (storedSalons) {
        setSalons(JSON.parse(storedSalons))
      }
    }

    fetchSalons()

    // ローカルストレージの変更を監視
    const handleStorageChange = () => {
      fetchSalons()
    }

    window.addEventListener("storage", handleStorageChange)

    // 定期的に更新（ローカルストレージの変更イベントが同一ウィンドウで発火しない場合の対策）
    const interval = setInterval(fetchSalons, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // 権限に応じたナビゲーション
  const getNavigation = () => {
    const baseNavigation = [
      {
        name: "ホーム",
        href: "/",
        icon: Home,
        current: pathname === "/",
        show: true,
      },
      {
        name: "顧客管理",
        href: "/dashboard/customers",
        icon: Users,
        current: pathname === "/dashboard/customers",
        show: true,
      },
      {
        name: "カウンセリングデータ",
        href: "/dashboard/counseling",
        icon: FileText,
        current: pathname === "/dashboard/counseling",
        show: true,
      },
      {
        name: "設定",
        href: "/dashboard/settings",
        icon: Settings,
        current: pathname === "/dashboard/settings",
        show: true,
      },
    ]

    return baseNavigation.filter((item) => item.show)
  }

  const navigation = getNavigation()

  // 現在選択中の店舗を取得
  const selectedSalon = salons.find((salon) => salon.id === selectedSalonId)

  // システム名を動的に生成
  const systemName = selectedSalon ? `${selectedSalon.name} 管理システム` : "美容室管理システム"

  const handleLogout = async () => {
    await logout()
    // ローカルストレージのデータをクリア
    localStorage.removeItem("selected_salon_id")
    localStorage.removeItem("salon_branches")
    localStorage.removeItem("staff_members")
    localStorage.removeItem("treatment_menus")
    localStorage.removeItem("membership_ranks")
    localStorage.removeItem("counseling_items")
    localStorage.removeItem("custom_counseling_items")

    // ログアウト完了画面にリダイレクト
    window.location.href = "/logout-complete"
  }

  // 認証されていない場合は何も表示しない
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4 justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleSidebar}>
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">メニュー</span>
            </Button>
            <h1 className="text-xl font-bold">{systemName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">ログイン中:</span>
              <span className="font-medium">{user.email}</span>
            </div>

            {salons.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedSalonId} onValueChange={setSelectedSalonId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>
                      {selectedSalon ? `${selectedSalon.name} ${selectedSalon.branchName}` : "店舗を選択"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {salons.map((salon) => (
                      <SelectItem key={salon.id} value={salon.id}>
                        {salon.name} {salon.branchName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* サイドバー（aside）を非表示にしたい場合は下記をコメントアウト */}
        {/*
        <aside
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block w-64 border-r bg-muted/40 p-4 fixed md:static top-16 bottom-0 left-0 z-10 bg-background`}
        >
          <div className="mb-4 p-3 bg-muted rounded-md md:hidden">
            <div className="text-sm font-medium">ログイン中:</div>
            <div className="text-base">{user.email}</div>
          </div>

          {salons.length > 0 && selectedSalon && (
            <div className="mb-4 p-3 bg-muted rounded-md md:hidden">
              <div className="text-sm font-medium">現在の店舗:</div>
              <div className="text-base">
                {selectedSalon.name} {selectedSalon.branchName}
              </div>
              <Select value={selectedSalonId} onValueChange={setSelectedSalonId} className="mt-2">
                <SelectTrigger className="w-full">
                  <SelectValue>店舗を切り替え</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {salons.map((salon) => (
                    <SelectItem key={salon.id} value={salon.id}>
                      {salon.name} {salon.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <nav className="space-y-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={item.current ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {selectedSalon?.name || "BeautySalon"}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
