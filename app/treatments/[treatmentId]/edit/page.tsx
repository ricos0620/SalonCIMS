"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation" // ← useParamsを追加
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"

interface Customer {
  id: string
  name_kanji: string
}

interface Treatment {
  id: string
  customer_id: string
  type: string
  date: string
  stylist: string
  price: number
  description?: string
  notes?: string
}

export default function EditTreatmentPage() {
  const params = useParams() as { treatmentId: string }
  const treatmentId = params.treatmentId // ← ここでid取得
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [treatment, setTreatment] = useState<Treatment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // フォームの状態
  const [formData, setFormData] = useState({
    customer_id: "",
    type: "",
    date: "",
    stylist: "",
    price: "",
    description: "",
    notes: "",
  })

  // フォームのエラー状態
  const [errors, setErrors] = useState({
    customer_id: "",
    type: "",
    date: "",
    stylist: "",
    price: "",
  })

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // 施術データと顧客データを並列取得
        const [treatmentResult, customersResult] = await Promise.all([
          supabase.from("treatments").select("*").eq("id", treatmentId).single(),
          supabase.from("customers").select("id, name_kanji").order("name_kanji"),
        ])

        if (treatmentResult.error) throw treatmentResult.error
        if (customersResult.error) throw customersResult.error

        const treatmentData = treatmentResult.data
        setTreatment(treatmentData)
        setCustomers(customersResult.data || [])

        // フォームデータを設定
        setFormData({
          customer_id: treatmentData.customer_id,
          type: treatmentData.type,
          date: treatmentData.date,
          stylist: treatmentData.stylist,
          price: treatmentData.price.toString(),
          description: treatmentData.description || "",
          notes: treatmentData.notes || "",
        })
      } catch (error) {
        console.error("データの取得に失敗:", error)
        toast({
          title: "エラー",
          description: "施術データの取得に失敗しました。",
          variant: "destructive",
        })
        router.push("/treatments")
      } finally {
        setIsLoading(false)
      }
    }

    if (treatmentId) {
      fetchData()
    }
  }, [treatmentId, router])

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
      customer_id: formData.customer_id ? "" : "顧客を選択してください",
      type: formData.type ? "" : "施術メニューは必須です",
      date: formData.date ? "" : "施術日は必須です",
      stylist: formData.stylist ? "" : "担当スタイリストは必須です",
      price: formData.price ? "" : "料金は必須です",
    }

    setErrors(newErrors)

    // エラーがあるかチェック
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
      const updateData = {
        ...formData,
        price: Number(formData.price),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("treatments").update(updateData).eq("id", treatmentId)

      if (error) throw error

      toast({
        title: "施術を更新しました",
        description: "施術情報が正常に更新されました。",
      })

      router.push(`/treatments/${treatmentId}`)
    } catch (error) {
      console.error("施術更新エラー:", error)
      toast({
        title: "エラー",
        description: "施術の更新に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ここから施術削除用ハンドラ追加
  const handleDelete = async () => {
    if (!window.confirm("本当にこの施術を削除しますか？ この操作は取り消せません。")) return;

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from("treatments")
        .delete()
        .eq("id", treatmentId)

      if (error) throw error

      toast({
        title: "施術を削除しました",
        description: "施術履歴が削除されました。",
      })

      router.push("/treatments")
    } catch (error) {
      console.error("施術削除エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: "施術の削除に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  // ここまで

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">施術データを読み込み中...</span>
        </div>
      </div>
    )
  }

  if (!treatment) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">施術が見つかりません</h2>
          <Button onClick={() => router.push("/treatments")}>施術一覧に戻る</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <PageHeader title="施術編集" description="施術情報を編集します" />
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="customer_id" className="block text-sm font-medium mb-1">
              顧客 *
            </label>
            <Select value={formData.customer_id} onValueChange={(value) => handleChange("customer_id", value)}>
              <SelectTrigger className={errors.customer_id ? "border-red-500" : ""}>
                <SelectValue placeholder="顧客を選択してください" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name_kanji}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customer_id && <p className="text-sm text-red-500 mt-1">{errors.customer_id}</p>}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              施術メニュー *
            </label>
            <Input
              id="type"
              placeholder="カット、カラー、パーマなど"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className={errors.type ? "border-red-500" : ""}
            />
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
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  更新中...
                </>
              ) : (
                "施術を更新"
              )}
            </Button>
            {/* ここから削除ボタン追加 */}
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  削除中...
                </>
              ) : (
                "施術を削除"
              )}
            </Button>
            {/* ここまで */}
          </div>
        </form>
      </div>
    </div>
  )
}
