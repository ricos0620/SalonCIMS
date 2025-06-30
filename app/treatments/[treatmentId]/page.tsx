"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import {
  Loader2,
  ArrowLeft,
  Calendar,
  User,
  Scissors,
  JapaneseYenIcon as Yen,
  FileText,
  StickyNote,
} from "lucide-react"

interface Treatment {
  id: string
  customer_id: string
  type: string
  date: string
  stylist: string
  price: number
  description?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface Customer {
  id: string
  name_kanji: string
  phone_number?: string
  email?: string
}

interface TreatmentWithCustomer extends Treatment {
  customer?: Customer
}

export default function TreatmentDetailPage({ params }: { params: Promise<{ treatmentId: string }> }) {
  const { treatmentId } = use(params)
  const router = useRouter()
  const [treatment, setTreatment] = useState<TreatmentWithCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTreatment() {
      // "new", "create" などの予約語をチェック
      if (treatmentId === "new" || treatmentId === "create") {
        router.push("/treatments/create")
        return
      }

      // UUID形式の検証
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(treatmentId)) {
        toast({
          title: "エラー",
          description: "無効な施術IDです。",
          variant: "destructive",
        })
        router.push("/treatments")
        return
      }

      setIsLoading(true)
      try {
        // 施術データを取得
        const { data: treatmentData, error: treatmentError } = await supabase
          .from("treatments")
          .select("*")
          .eq("id", treatmentId)
          .single()

        if (treatmentError) throw treatmentError

        // 顧客データを取得（phone → phone_numberに変更）
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("id, name_kanji, phone_number, email")
          .eq("id", treatmentData.customer_id)
          .single()

        if (customerError) {
          console.warn("顧客データの取得に失敗:", customerError)
        }

        setTreatment({
          ...treatmentData,
          customer: customerData || undefined,
        })
      } catch (error) {
        console.error("施術データの取得に失敗:", error)
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
      fetchTreatment()
    }
  }, [treatmentId, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(price)
  }

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
        <PageHeader title="施術詳細" description="施術の詳細情報を表示しています" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              施術情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">顧客:</span>
              <span>{treatment.customer?.name_kanji || "不明"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-gray-500" />
              <span className="font-medium">施術メニュー:</span>
              <Badge variant="secondary">{treatment.type}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">施術日:</span>
              <span>{formatDate(treatment.date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">担当スタイリスト:</span>
              <span>{treatment.stylist}</span>
            </div>

            <div className="flex items-center gap-2">
              <Yen className="h-4 w-4 text-gray-500" />
              <span className="font-medium">料金:</span>
              <span className="text-lg font-bold text-green-600">¥{formatPrice(treatment.price)}</span>
            </div>
          </CardContent>
        </Card>

        {/* 顧客情報 */}
        {treatment.customer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                顧客情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">氏名:</span>
                <span className="ml-2">{treatment.customer.name_kanji}</span>
              </div>

              {treatment.customer.phone_number && (
                <div>
                  <span className="font-medium">電話番号:</span>
                  <span className="ml-2">{treatment.customer.phone_number}</span>
                </div>
              )}

              {treatment.customer.email && (
                <div>
                  <span className="font-medium">メールアドレス:</span>
                  <span className="ml-2">{treatment.customer.email}</span>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => router.push(`/customers/${treatment.customer_id}`)}
                className="w-full"
              >
                顧客詳細を見る
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 施術内容 */}
        {treatment.description && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                施術内容
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{treatment.description}</p>
            </CardContent>
          </Card>
        )}

        {/* 備考 */}
        {treatment.notes && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                備考
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{treatment.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* メタ情報 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>記録情報</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">登録日時:</span>
              <span className="ml-2">{new Date(treatment.created_at).toLocaleString("ja-JP")}</span>
            </div>
            <div>
              <span className="font-medium">更新日時:</span>
              <span className="ml-2">{new Date(treatment.updated_at).toLocaleString("ja-JP")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* アクションボタン */}
      <div className="mt-8 flex gap-4">
        <Button variant="outline" onClick={() => router.push("/treatments")} className="flex-1">
          施術一覧に戻る
        </Button>
        <Button onClick={() => router.push(`/treatments/${treatment.id}/edit`)} className="flex-1">
          編集
        </Button>
      </div>
    </div>
  )
}
