"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function NewTreatmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // フォームの状態
  const [formData, setFormData] = useState({
    customer_id: "",
    type: "",
    date: new Date().toISOString().split("T")[0],
    stylist: "",
    price: "",
    description: "",
    notes: "",
  })

  // エラー状態
  const [errors, setErrors] = useState({
    customer_id: "",
    type: "",
    date: "",
    stylist: "",
    price: "",
  })

  // 顧客一覧
  const [customers, setCustomers] = useState<{ id: string; name_kanji: string }[]>([])
  const [customersLoading, setCustomersLoading] = useState(true)

  // 施術メニュー一覧
  const [menus, setMenus] = useState<{ id: string; name: string }[]>([])
  const [menusLoading, setMenusLoading] = useState(true)

  // 顧客一覧の取得
  useEffect(() => {
    async function fetchCustomers() {
      setCustomersLoading(true)
      const { data, error } = await supabase
        .from("customers")
        .select("id, name_kanji")
        .order("name_kanji", { ascending: true })

      if (!error && data) {
        setCustomers(data)
      } else {
        toast({
          title: "エラー",
          description: "顧客リストの取得に失敗しました",
          variant: "destructive",
        })
      }
      setCustomersLoading(false)
    }
    fetchCustomers()
  }, [])

  // 施術メニュー一覧の取得
  useEffect(() => {
    async function fetchMenus() {
      setMenusLoading(true)
      const { data, error } = await supabase
        .from("menus")
        .select("id, name")
        .order("name", { ascending: true })
      if (!error && data) {
        setMenus(data)
      } else {
        toast({
          title: "エラー",
          description: "メニューリストの取得に失敗しました",
          variant: "destructive",
        })
      }
      setMenusLoading(false)
    }
    fetchMenus()
  }, [])

  // 入力値の変更ハンドラ
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // エラーをクリア
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  // バリデーション関数
  const validateForm = () => {
    const newErrors = {
      customer_id: formData.customer_id ? "" : "顧客氏名は必須です",
      type: formData.type ? "" : "施術メニューは必須です",
      date: formData.date ? "" : "施術日は必須です",
      stylist: formData.stylist ? "" : "担当スタイリストは必須です",
      price: formData.price ? "" : "料金は必須です",
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "入力エラー",
        description: "必須項目を入力してください。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const treatmentData = {
        ...formData,
        price: Number(formData.price),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("treatments").insert([treatmentData])

      if (error) throw error

      toast({
        title: "施術を登録しました",
        description: "新しい施術が正常に登録されました。",
      })

      router.push("/treatments")
    } catch (error) {
      console.error("施術登録エラー:", error)
      toast({
        title: "エラー",
        description: "施術の登録に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="新規施術登録" description="新しい施術を登録します" />

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="customer_id" className="block text-sm font-medium mb-1">
              顧客氏名 *
            </label>
            <select
              id="customer_id"
              value={formData.customer_id}
              onChange={(e) => handleChange("customer_id", e.target.value)}
              className={`w-full border rounded px-3 py-2 ${errors.customer_id ? "border-red-500" : ""}`}
              disabled={customersLoading}
              required
            >
              <option value="">選択してください</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name_kanji}
                </option>
              ))}
            </select>
            {errors.customer_id && <p className="text-sm text-red-500 mt-1">{errors.customer_id}</p>}
            <p className="text-xs text-gray-500 mt-1">顧客氏名を選択してください</p>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              施術メニュー *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className={`w-full border rounded px-3 py-2 ${errors.type ? "border-red-500" : ""}`}
              disabled={menusLoading}
              required
            >
              <option value="">メニューを選択してください</option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.name}>
                  {menu.name}
                </option>
              ))}
            </select>
            {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                施術日 *
              </label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                料金 (円) *
              </label>
              <Input
                id="price"
                type="number"
                placeholder="5000"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="stylist" className="block text-sm font-medium mb-1">
              担当スタイリスト *
            </label>
            <Input
              id="stylist"
              placeholder="担当者名"
              value={formData.stylist}
              onChange={(e) => handleChange("stylist", e.target.value)}
              className={errors.stylist ? "border-red-500" : ""}
            />
            {errors.stylist && <p className="text-sm text-red-500 mt-1">{errors.stylist}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              施術内容
            </label>
            <Textarea
              id="description"
              placeholder="施術の詳細内容を入力してください"
              className="resize-none"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              備考
            </label>
            <Textarea
              id="notes"
              placeholder="特記事項があれば入力してください"
              className="resize-none"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/treatments")} className="flex-1">
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting || customersLoading || menusLoading} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                "施術を登録"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
