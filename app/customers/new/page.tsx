"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nameKanji: "",
    nameKana: "",
    gender: "",
    phoneNumber: "",
    phoneNumber2: "",
    email: "",
    postalCode: "",
    address: "",
    birthdate: "",
    occupation: "",
    notes: "",
    manualRankId: "none", // 初期値を"none"に
    hairThickness: "",
    hairCurliness: "",
    hairDamage: "",
    allergies: "",
  })

  // 会員ランクをDBから動的取得
  const [membershipRanks, setMembershipRanks] = useState<{ id: string, name: string, color?: string }[]>([])

  useEffect(() => {
    async function fetchMembershipRanks() {
      const { data, error } = await supabase
        .from("membership_ranks")
        .select("id, name, color")
        .order("required_points", { ascending: true })
      if (!error && data) setMembershipRanks(data)
    }
    fetchMembershipRanks()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const membershipNumber = `M${Date.now().toString().slice(-8)}`

      const customerData: any = {
        name_kanji: formData.nameKanji,
        name_kana: formData.nameKana,
        gender: formData.gender,
        membership_number: membershipNumber,
        phone_number: formData.phoneNumber,
        phone_number2: formData.phoneNumber2 || null,
        email: formData.email || null,
        postal_code: formData.postalCode || null,
        address: formData.address || null,
        birthdate: formData.birthdate || null,
        occupation: formData.occupation || null,
        notes: formData.notes || null,
        hair_thickness: formData.hairThickness || null,
        hair_curliness: formData.hairCurliness || null,
        hair_damage: formData.hairDamage || null,
        allergies: formData.allergies || null,
        last_visit: null,
      }
      // manual_rank_idの処理
      if (formData.manualRankId && formData.manualRankId !== "none") {
        customerData.manual_rank_id = formData.manualRankId
      } else {
        customerData.manual_rank_id = null
      }

      const { error } = await supabase.from("customers").insert([customerData])

      if (error) throw error

      router.push("/customers")
    } catch (error) {
      console.error("顧客登録に失敗:", error)
      alert("顧客登録に失敗しました。もう一度お試しください。")
    } finally {
      setLoading(false)
    }
  }

  // 選択中のランク情報
  const selectedRank =
    formData.manualRankId !== "none"
      ? membershipRanks.find((rank) => rank.id === formData.manualRankId)
      : undefined

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="新規顧客登録" description="新しい顧客の情報を登録します" />

      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            顧客一覧に戻る
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nameKanji">氏名（漢字）*</Label>
                  <Input
                    id="nameKanji"
                    value={formData.nameKanji}
                    onChange={(e) => handleInputChange("nameKanji", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nameKana">氏名（かな）*</Label>
                  <Input
                    id="nameKana"
                    value={formData.nameKana}
                    onChange={(e) => handleInputChange("nameKana", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender">性別</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="性別を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="男性">男性</SelectItem>
                    <SelectItem value="女性">女性</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">電話番号*</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber2">電話番号2</Label>
                  <Input
                    id="phoneNumber2"
                    value={formData.phoneNumber2}
                    onChange={(e) => handleInputChange("phoneNumber2", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="birthdate">生年月日</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => handleInputChange("birthdate", e.target.value)}
                />
              </div>

              {/* ▼ここだけ書き換え！ */}
<div>
  <Label htmlFor="manualRankId">会員ランク</Label>
  <select
    id="manualRankId"
    value={formData.manualRankId}
    onChange={(e) => handleInputChange("manualRankId", e.target.value)}
    className="w-full border rounded p-2"
  >
    <option value="none">選択なし</option>
    {membershipRanks.map(rank => (
      <option key={rank.id} value={rank.id}>{rank.name}</option>
    ))}
  </select>
</div>
              {/* ▲ここまで */}

            </CardContent>
          </Card>

          {/* 住所・その他情報 */}
          <Card>
            <CardHeader>
              <CardTitle>住所・その他情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="postalCode">郵便番号</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  placeholder="123-4567"
                />
              </div>

              <div>
                <Label htmlFor="address">住所</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="occupation">職業</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="hairThickness">髪の太さ</Label>
                <Select
                  value={formData.hairThickness}
                  onValueChange={(value) => handleInputChange("hairThickness", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="細い">細い</SelectItem>
                    <SelectItem value="普通">普通</SelectItem>
                    <SelectItem value="太い">太い</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="hairCurliness">髪のクセ</Label>
                <Select
                  value={formData.hairCurliness}
                  onValueChange={(value) => handleInputChange("hairCurliness", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="直毛">直毛</SelectItem>
                    <SelectItem value="軽いクセ">軽いクセ</SelectItem>
                    <SelectItem value="強いクセ">強いクセ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="hairDamage">髪のダメージ</Label>
                <Select value={formData.hairDamage} onValueChange={(value) => handleInputChange("hairDamage", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="なし">なし</SelectItem>
                    <SelectItem value="軽度">軽度</SelectItem>
                    <SelectItem value="中度">中度</SelectItem>
                    <SelectItem value="重度">重度</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="allergies">アレルギー・注意事項</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">備考</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/customers">キャンセル</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "登録中..." : "顧客を登録"}
          </Button>
        </div>
      </form>
    </div>
  )
}
