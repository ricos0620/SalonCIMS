"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { supabase } from "@/lib/supabase"

export default function CustomerEditPage() {
  const params = useParams()
  const customerId = params.customerId as string

  const router = useRouter()
  const [customer, setCustomer] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // フォーム状態
  const [nameKanji, setNameKanji] = useState("")
  const [nameKana, setNameKana] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")

  // 会員ランク用
  const [membershipRanks, setMembershipRanks] = useState<any[]>([])
  const [selectedManualRankId, setSelectedManualRankId] = useState<string | null>(null)

  useEffect(() => {
    // 顧客取得
    async function fetchCustomer() {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single()
      if (error || !data) {
        setError("顧客データの取得に失敗: " + (error?.message ?? "データなし"))
        setLoading(false)
        return
      }
      setCustomer(data)
      setNameKanji(data.name_kanji || "")
      setNameKana(data.name_kana || "")
      setPhoneNumber(data.phone_number || "")
      setEmail(data.email || "")
      setNotes(data.notes || "")
      setSelectedManualRankId(data.manual_rank_id || "")
      setLoading(false)
    }
    // 会員ランク一覧取得
    async function fetchMembershipRanks() {
      const { data, error } = await supabase
        .from("membership_ranks")
        .select("id, name")
        .order("required_points", { ascending: true })
      if (!error && data) {
        setMembershipRanks(data)
      }
    }
    fetchMembershipRanks()
    fetchCustomer()
  }, [customerId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { error } = await supabase
      .from("customers")
      .update({
        name_kanji: nameKanji,
        name_kana: nameKana,
        phone_number: phoneNumber,
        email,
        notes,
        manual_rank_id: selectedManualRankId || null,
      })
      .eq("id", customerId)
    setSaving(false)
    if (error) {
      setError("保存に失敗しました: " + error.message)
      return
    }
    router.push(`/customers/${customerId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">顧客が見つかりません</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title={`${customer.name_kanji ?? "顧客"}様の情報編集`}
        description="顧客情報を編集・更新します"
      />
      <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
        <div>
          <label className="block font-bold mb-1">名前（漢字）</label>
          <input
            className="w-full border rounded p-2"
            value={nameKanji}
            onChange={e => setNameKanji(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">ふりがな</label>
          <input
            className="w-full border rounded p-2"
            value={nameKana}
            onChange={e => setNameKana(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-bold mb-1">電話番号</label>
          <input
            className="w-full border rounded p-2"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-bold mb-1">メール</label>
          <input
            className="w-full border rounded p-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">会員ランク</label>
          <select
            className="w-full border rounded p-2"
            value={selectedManualRankId || ""}
            onChange={e => setSelectedManualRankId(e.target.value)}
          >
            <option value="">選択なし</option>
            {membershipRanks.map(rank => (
              <option key={rank.id} value={rank.id}>
                {rank.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">メモ</label>
          <textarea
            className="w-full border rounded p-2"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {saving ? "保存中..." : "保存"}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => router.back()}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
