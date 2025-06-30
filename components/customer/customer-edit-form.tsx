"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Customer } from "@/types/customer"

interface CustomerEditFormProps {
  customer: Customer
}

export function CustomerEditForm({ customer }: CustomerEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nameKanji: customer.nameKanji,
    nameKana: customer.nameKana,
    gender: customer.gender || "",
    membershipNumber: customer.membershipNumber || "",
    membershipRank: customer.membershipRank || "",
    phoneNumber: customer.phoneNumber,
    phoneNumber2: customer.phoneNumber2 || "",
    email: customer.email || "",
    postalCode: customer.postalCode || "",
    address: customer.address || "",
    birthdate: customer.birthdate || "",
    occupation: customer.occupation || "",
    notes: customer.notes || "",
    hairThickness: customer.hairThickness || "",
    hairCurliness: customer.hairCurliness || "",
    hairDamage: customer.hairDamage || "",
    allergies: customer.allergies || "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "顧客情報を更新しました",
          description: "顧客情報が正常に更新されました。",
        })
        router.push(`/customers/${customer.id}`)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("顧客情報更新に失敗:", error)
      toast({
        title: "エラーが発生しました",
        description: "顧客情報の更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>お客様の基本的な情報を編集してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameKanji">お名前（漢字）*</Label>
              <Input
                id="nameKanji"
                value={formData.nameKanji}
                onChange={(e) => handleChange("nameKanji", e.target.value)}
                placeholder="山田 太郎"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameKana">お名前（ひらがな）*</Label>
              <Input
                id="nameKana"
                value={formData.nameKana}
                onChange={(e) => handleChange("nameKana", e.target.value)}
                placeholder="やまだ たろう"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">性別</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
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
            <div className="space-y-2">
              <Label htmlFor="birthdate">生年月日</Label>
              <Input
                id="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={(e) => handleChange("birthdate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">電話番号*</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="090-1234-5678"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber2">電話番号2</Label>
              <Input
                id="phoneNumber2"
                value={formData.phoneNumber2}
                onChange={(e) => handleChange("phoneNumber2", e.target.value)}
                placeholder="03-1234-5678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">郵便番号</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                placeholder="123-4567"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="東京都渋谷区..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">職業</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => handleChange("occupation", e.target.value)}
              placeholder="会社員"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>会員情報</CardTitle>
          <CardDescription>会員番号・ランク情報</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membershipNumber">会員番号</Label>
              <Input
                id="membershipNumber"
                value={formData.membershipNumber}
                onChange={(e) => handleChange("membershipNumber", e.target.value)}
                placeholder="A10001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="membershipRank">会員ランク</Label>
              <Select value={formData.membershipRank} onValueChange={(value) => handleChange("membershipRank", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="ランクを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ブロンズ">ブロンズ</SelectItem>
                  <SelectItem value="シルバー">シルバー</SelectItem>
                  <SelectItem value="ゴールド">ゴールド</SelectItem>
                  <SelectItem value="プラチナ">プラチナ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>髪質情報</CardTitle>
          <CardDescription>お客様の髪質に関する情報</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hairThickness">髪の太さ</Label>
              <Select value={formData.hairThickness} onValueChange={(value) => handleChange("hairThickness", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="髪の太さ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="細め">細め</SelectItem>
                  <SelectItem value="普通">普通</SelectItem>
                  <SelectItem value="太め">太め</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hairCurliness">髪のクセ</Label>
              <Select value={formData.hairCurliness} onValueChange={(value) => handleChange("hairCurliness", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="髪のクセ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="直毛">直毛</SelectItem>
                  <SelectItem value="弱め">弱め</SelectItem>
                  <SelectItem value="くせあり">くせあり</SelectItem>
                  <SelectItem value="強め">強め</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hairDamage">ダメージレベル</Label>
              <Select value={formData.hairDamage} onValueChange={(value) => handleChange("hairDamage", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="ダメージレベル" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="なし">なし</SelectItem>
                  <SelectItem value="毛先もしくは部分的に少しある">毛先もしくは部分的に少しある</SelectItem>
                  <SelectItem value="中間～毛先まである">中間～毛先まである</SelectItem>
                  <SelectItem value="根元～毛先まである">根元～毛先まである</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">アレルギー・注意事項</Label>
            <Textarea
              id="allergies"
              value={formData.allergies}
              onChange={(e) => handleChange("allergies", e.target.value)}
              placeholder="薬剤アレルギーや注意事項があれば記入してください"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>備考</CardTitle>
          <CardDescription>その他の情報・メモ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">備考</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="その他の情報やメモを記入してください"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting} className="px-8">
          {isSubmitting ? "更新中..." : "顧客情報を更新"}
        </Button>
      </div>
    </form>
  )
}

