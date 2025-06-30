"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button" // 追加

export default function CustomerPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.customerId as string

  const [customer, setCustomer] = useState<any | null>(null)
  const [counselingData, setCounselingData] = useState<any[]>([])
  const [loadingCounseling, setLoadingCounseling] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (customerId === "new" || customerId === "create") {
      router.push("/customers/new")
      return
    }

    async function fetchCustomer() {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single()

      if (error) {
        console.error("顧客取得エラー:", error)
        return
      }

      setCustomer(data)
    }

    async function fetchCounselingData() {
      setLoadingCounseling(true)
      const { data, error } = await supabase
        .from("counseling_data")
        .select("*")
        .eq("customer_id", customerId)
        .order("date", { ascending: false })

      if (error) {
        console.error("カウンセリングデータ取得エラー:", error)
      } else {
        setCounselingData(data || [])
      }
      setLoadingCounseling(false)
    }

    fetchCustomer()
    fetchCounselingData()
  }, [customerId])

  // 削除処理
  const handleDelete = async () => {
    const confirmed = window.confirm("本当に削除してもよろしいですか？")
    if (!confirmed) return

    setDeleting(true)
    // ① counseling_dataを削除
    const { error: counselingError } = await supabase
      .from("counseling_data")
      .delete()
      .eq("customer_id", customerId)

    if (counselingError) {
      setDeleting(false)
      alert("カウンセリングデータの削除に失敗しました：" + counselingError.message)
      return
    }

    // ② customers本体を削除
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId)
    setDeleting(false)

    if (error) {
      alert("削除に失敗しました：" + error.message)
    } else {
      alert("削除が完了しました")
      router.push("/customers")
    }
  }

  if (!customer) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader title="顧客詳細" description="読み込み中..." />
        <div className="text-center py-8">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="顧客詳細" description={`ID: ${customerId}`} />
      <div className="space-y-4 text-gray-800">
        <div>名前: {customer.name_kanji}</div>
        <div>ふりがな: {customer.name_kana}</div>
        <div>電話番号: {customer.phone_number}</div>
        <div>メール: {customer.email}</div>
        <div>最終来店: {customer.last_visit || "未来店"}</div>
        <div>メモ: {customer.notes}</div>
      </div>

      {/* 編集・削除ボタン */}
      <div className="mt-6 flex gap-4">
        <Button onClick={() => router.push(`/customers/${customerId}/edit`)}>
          顧客情報を編集
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "削除中..." : "顧客を削除"}
        </Button>
      </div>

      {/* counseling_data 表示部分 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">カウンセリング履歴</h2>
        {loadingCounseling ? (
          <p>読み込み中...</p>
        ) : counselingData.length === 0 ? (
          <p>カウンセリング履歴はありません。</p>
        ) : (
          counselingData.map((record, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded p-4 mb-4 bg-white shadow-sm"
            >
              <p><strong>日付:</strong> {record.date}</p>
              <p><strong>髪の悩み:</strong> {
                Array.isArray(record.hair_concerns)
                  ? record.hair_concerns.join(", ")
                  : typeof record.hair_concerns === "string"
                  ? record.hair_concerns
                  : "未入力"
              }</p>
              <p><strong>シャンプー強さ:</strong> {record.shampoo_strength ?? "未入力"}</p>
              <p><strong>ドリンクサービス:</strong> {record.drink_service ?? "未入力"}</p>
              <p><strong>会話希望:</strong> {record.conversation_preference ?? "未入力"}</p>
              <p><strong>備考:</strong> {record.additional_notes ?? "未入力"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
