"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

interface Rank {
  id?: number
  name: string
  description: string
  discount_rate: number
  required_points: number
  color: string
  criteria_type: "" | "visit_date" | "total_spent"
  min_spent?: number
  min_visit_date?: string
}

export default function MembershipRanks() {
  const [form, setForm] = useState<Rank>({
    name: "",
    description: "",
    discount_rate: 0,
    required_points: 0,
    color: "",
    criteria_type: "",
  })
  const [ranks, setRanks] = useState<Rank[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  // 12色のカラーパレット
  const colorPalette = [
    "#f87171", // 赤
    "#fb923c", // オレンジ
    "#facc15", // 黄
    "#4ade80", // 緑
    "#2dd4bf", // ティール
    "#38bdf8", // 青
    "#818cf8", // インディゴ
    "#a78bfa", // パープル
    "#f472b6", // ピンク
    "#d4d4d4", // グレー
    "#1e293b", // ブラック
    "#fff",    // ホワイト
  ]

  const fetchRanks = async () => {
    const { data, error } = await supabase
      .from("membership_ranks")
      .select("*")
      .order("required_points", { ascending: false })
    if (error) {
      console.error("一覧取得エラー:", error)
    } else {
      setRanks(data as Rank[])
    }
  }

  useEffect(() => {
    fetchRanks()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "discount_rate" || name === "required_points" || name === "min_spent" ? Number(value) : value,
    }))
  }

  // カラーパレット選択時
  const handleColorSelect = (color: string) => {
    setForm((prev) => ({
      ...prev,
      color,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.criteria_type) {
      alert("ランク判定基準を選択してください")
      return
    }

    if (!form.color) {
      alert("色を選択してください")
      return
    }

    const submitData = { ...form }
    if (form.criteria_type === "visit_date") {
      delete submitData.min_spent
    } else {
      delete submitData.min_visit_date
    }

    if (editingId) {
      const { error } = await supabase.from("membership_ranks").update(submitData).eq("id", editingId)
      if (error) {
        console.error("更新エラー:", error)
        alert("更新に失敗しました")
      } else {
        alert("更新に成功しました")
        setEditingId(null)
      }
    } else {
      const { error } = await supabase.from("membership_ranks").insert([submitData])
      if (error) {
        console.error("保存エラー:", error)
        alert("保存に失敗しました")
      } else {
        alert("保存に成功しました")
      }
    }

    setForm({
      name: "",
      description: "",
      discount_rate: 0,
      required_points: 0,
      color: "",
      criteria_type: "",
    })
    fetchRanks()
  }

  const handleEdit = (rank: Rank) => {
    setForm({
      ...rank,
      criteria_type: rank.criteria_type || "",
    })
    setEditingId(rank.id || null)
  }

  const handleDelete = async (id: number) => {
    if (confirm("本当に削除しますか？")) {
      const { error } = await supabase.from("membership_ranks").delete().eq("id", id)
      if (error) {
        console.error("削除エラー:", error)
        alert("削除に失敗しました")
      } else {
        alert("削除に成功しました")
        fetchRanks()
      }
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">会員ランク設定</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>ランク名</Label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label>説明</Label>
          <Input name="description" value={form.description} onChange={handleChange} />
        </div>
        <div>
          <Label>割引率 (%)</Label>
          <Input type="number" name="discount_rate" value={form.discount_rate} onChange={handleChange} required />
        </div>
        <div>
          <Label>色</Label>
          <div className="flex gap-2 mt-1 flex-wrap">
            {colorPalette.map((color) => (
              <button
                type="button"
                key={color}
                className={`w-8 h-8 rounded-full border-2 ${form.color === color ? "border-black scale-110" : "border-gray-300"} transition`}
                style={{ backgroundColor: color }}
                aria-label={`色: ${color}`}
                onClick={() => handleColorSelect(color)}
              >
                {form.color === color && (
                  <span className="block w-3 h-3 mx-auto my-auto rounded-full bg-white border border-black" />
                )}
              </button>
            ))}
          </div>
          {/* 選択中のカラー値表示 */}
          {form.color && (
            <div className="mt-1 text-xs text-gray-500">選択中: <span style={{ color: form.color }}>{form.color}</span></div>
          )}
        </div>
        <div>
          <Label>ランク判定基準</Label>
          <select
            name="criteria_type"
            value={form.criteria_type}
            onChange={handleChange}
            required
            className="border rounded px-2 py-1"
          >
            <option value="">-- 選択してください --</option>
            <option value="visit_date">初回来店日</option>
            <option value="total_spent">累計支払額</option>
          </select>
        </div>
        {form.criteria_type === "visit_date" ? (
          <div>
            <Label>◉ 初回来店日（以降は除外）</Label>
            <Input type="date" name="min_visit_date" value={form.min_visit_date || ""} onChange={handleChange} />
          </div>
        ) : form.criteria_type === "total_spent" ? (
          <div>
            <Label>◉ 必要累計支払額</Label>
            <Input
              type="number"
              name="min_spent"
              value={form.min_spent ?? 0}
              onChange={handleChange}
            />
          </div>
        ) : null}

        <Button type="submit">{editingId ? "更新" : "登録"}</Button>
      </form>

      <div className="pt-6">
        <h3 className="text-lg font-bold mb-2">登録済みランク一覧</h3>
        {ranks.length === 0 ? (
          <p>登録されているランクはありません。</p>
        ) : (
          <ul className="space-y-2">
            {ranks.map((rank, index) => (
              <li key={index} className="border p-2 rounded flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-6 h-6 rounded-full border"
                    style={{ backgroundColor: rank.color, borderColor: "#ccc" }}
                    title={rank.color}
                  />
                  <strong>{rank.name}</strong>（{rank.description}） - 割引率: {rank.discount_rate}% 
                  <br />
                  ▷ 判定基準:{" "}
                  {rank.criteria_type === "visit_date"
                    ? `初回来店日 < ${rank.min_visit_date}`
                    : `支払額 >= ¥${rank.min_spent}`}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleEdit(rank)}>
                    編集
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(rank.id!)}>
                    削除
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
