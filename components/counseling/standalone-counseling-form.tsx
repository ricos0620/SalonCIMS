"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface StandaloneCounselingData {
  // 基本情報
  nameKanji: string
  nameKana: string
  phoneNumber: string
  email?: string
  gender?: string
  birthdate?: string
  postalCode?: string
  address?: string

  // カウンセリング項目
  howDidYouFindUs?: string[]
  whyChooseUs?: string[]
  allergies?: string
  lastVisit?: string
  preferredFinishTime?: {
    hasPreference: boolean
    time?: string
  }
  shampooStrength?: string
  drinkService?: string
  conversationPreference?: string
  stylingTools?: string
  hairConcerns?: string[]
  productRecommendation?: string
  otherMenuInterest?: string
  additionalNotes?: string
}

export function StandaloneCounselingForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<StandaloneCounselingData>({
    nameKanji: "",
    nameKana: "",
    phoneNumber: "",
    email: "",
    gender: "",
    birthdate: "",
    postalCode: "",
    address: "",
    howDidYouFindUs: [],
    whyChooseUs: [],
    allergies: "",
    lastVisit: "",
    preferredFinishTime: {
      hasPreference: false,
      time: "",
    },
    shampooStrength: "",
    drinkService: "",
    conversationPreference: "",
    stylingTools: "",
    hairConcerns: [],
    productRecommendation: "",
    otherMenuInterest: "",
    additionalNotes: "",
  })

  const handleCheckboxChange = (field: "howDidYouFindUs" | "whyChooseUs" | "hairConcerns", value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field] || []
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [field]: updatedValues,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/counseling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // ←★追加ここだけ！
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "カウンセリングデータを保存しました",
          description: "お客様の情報が正常に保存されました。",
        })

        // 顧客詳細ページにリダイレクト
        router.push(`/customers/${result.customerId}`)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("カウンセリングデータの保存に失敗:", error)
      toast({
        title: "エラーが発生しました",
        description: "データの保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>お客様の基本的な情報をお聞かせください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameKanji">お名前（漢字）*</Label>
              <Input
                id="nameKanji"
                value={formData.nameKanji}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameKanji: e.target.value }))}
                placeholder="山田 太郎"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameKana">お名前（ひらがな）*</Label>
              <Input
                id="nameKana"
                value={formData.nameKana}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameKana: e.target.value }))}
                placeholder="やまだ たろう"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">電話番号*</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="090-1234-5678"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">性別</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
              >
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
                onChange={(e) => setFormData((prev) => ({ ...prev, birthdate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">郵便番号</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                placeholder="123-4567"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="東京都渋谷区..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* カウンセリング項目（既存のカウンセリングフォームと同じ内容） */}
      <Card>
        <CardHeader>
          <CardTitle>当サロンをお知りになったきっかけ</CardTitle>
          <CardDescription>該当するものをすべてお選びください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {["ホットペッパービューティー", "インターネット検索", "SNS（Instagram、X等）", "ご紹介", "通りがかり", "当店ホームページ、公式ブログ", "その他"].map(
            (option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`find-us-${option}`}
                  checked={formData.howDidYouFindUs?.includes(option) || false}
                  onCheckedChange={() => handleCheckboxChange("howDidYouFindUs", option)}
                />
                <Label htmlFor={`find-us-${option}`}>{option}</Label>
              </div>
            ),
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>当サロンをお選びいただいた理由</CardTitle>
          <CardDescription>該当するものをすべてお選びください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {["技術力の高さ", "立地の良さ", "価格", "雰囲気", "スタッフの対応", "口コミ・評判", "その他"].map(
            (option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`choose-us-${option}`}
                  checked={formData.whyChooseUs?.includes(option) || false}
                  onCheckedChange={() => handleCheckboxChange("whyChooseUs", option)}
                />
                <Label htmlFor={`choose-us-${option}`}>{option}</Label>
              </div>
            ),
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>アレルギー・注意事項</CardTitle>
          <CardDescription>薬剤アレルギーや注意事項があればお書きください</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.allergies}
            onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
            placeholder="アレルギーや注意事項をご記入ください"
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>前回の施術時期</CardTitle>
          <CardDescription>前回美容室で施術を受けたのはいつ頃ですか？</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.lastVisit}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, lastVisit: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="前回の施術時期を選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1ヶ月以内">1ヶ月以内</SelectItem>
              <SelectItem value="2-3ヶ月前">2-3ヶ月前</SelectItem>
              <SelectItem value="4-6ヶ月前">4-6ヶ月前</SelectItem>
              <SelectItem value="半年以上前">半年以上前</SelectItem>
              <SelectItem value="1年以上前">1年以上前</SelectItem>
              </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>お仕上がり時間のご希望</CardTitle>
          <CardDescription>特定の時間までに仕上げる必要がありますか？</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="time-preference"
              checked={formData.preferredFinishTime?.hasPreference || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  preferredFinishTime: {
                    hasPreference: checked,
                    time: checked ? prev.preferredFinishTime?.time || "" : "",
                  },
                }))
              }
            />
            <Label htmlFor="time-preference">時間指定あり</Label>
          </div>

          {formData.preferredFinishTime?.hasPreference && (
            <div className="space-y-2">
              <Label htmlFor="finish-time">希望時間</Label>
              <Input
                id="finish-time"
                type="time"
                value={formData.preferredFinishTime.time || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preferredFinishTime: {
                      hasPreference: true,
                      time: e.target.value,
                    },
                  }))
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>シャンプーの強さ</CardTitle>
          <CardDescription>お好みのシャンプーの強さをお選びください</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.shampooStrength}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, shampooStrength: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="弱め" id="shampoo-weak" />
              <Label htmlFor="shampoo-weak">弱め</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="普通" id="shampoo-normal" />
              <Label htmlFor="shampoo-normal">普通</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="強め" id="shampoo-strong" />
              <Label htmlFor="shampoo-strong">強め</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

<Card>
  <CardHeader>
    <CardTitle>ドリンクサービス</CardTitle>
    <CardDescription>お飲み物とお茶菓子のサービスはご希望されますか？</CardDescription>
  </CardHeader>
  <CardContent>
    <RadioGroup
      value={formData.drinkService}
      onValueChange={(value) => setFormData((prev) => ({ ...prev, drinkService: value }))}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="希望する" id="drink-yes" />
        <Label htmlFor="drink-yes">希望する</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="ドリンクのみ希望する" id="drink-only" />
        <Label htmlFor="drink-only">ドリンクのみ希望する</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="希望しない" id="drink-no" />
        <Label htmlFor="drink-no">希望しない</Label>
      </div>
    </RadioGroup>
  </CardContent>
</Card>

      <Card>
        <CardHeader>
          <CardTitle>会話について</CardTitle>
          <CardDescription>施術中の会話についてお聞かせください</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.conversationPreference}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, conversationPreference: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="たくさん話したい" id="talk-much" />
              <Label htmlFor="talk-much">たくさん話したい</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="適度に話したい" id="talk-moderate" />
              <Label htmlFor="talk-moderate">適度に話したい</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="静かに過ごしたい" id="talk-quiet" />
              <Label htmlFor="talk-quiet">静かに過ごしたい</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>スタイリング道具</CardTitle>
          <CardDescription>普段お使いのスタイリング道具をお教えください</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.stylingTools}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, stylingTools: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="スタイリング道具をお選びください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ドライヤーのみ">ドライヤーのみ</SelectItem>
              <SelectItem value="ストレートアイロン">ストレートアイロン</SelectItem>
              <SelectItem value="カールアイロン">カールアイロン</SelectItem>
              <SelectItem value="ホットカーラー">ホットカーラー</SelectItem>
              <SelectItem value="ブラシ・コーム">ブラシ・コーム</SelectItem>
              <SelectItem value="特に使わない">特に使わない</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>髪の悩み</CardTitle>
          <CardDescription>現在の髪の悩みをお聞かせください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "くせ・うねり",
            "ボリューム不足",
            "ボリュームが出すぎる",
            "パサつき・乾燥",
            "ダメージ",
            "白髪",
            "薄毛・抜け毛",
            "スタイリングが決まらない",
            "その他",
          ].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`concern-${option}`}
                checked={formData.hairConcerns?.includes(option) || false}
                onCheckedChange={() => handleCheckboxChange("hairConcerns", option)}
              />
              <Label htmlFor={`concern-${option}`}>{option}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>商品のご案内</CardTitle>
          <CardDescription>ホームケア商品のご案内について</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.productRecommendation}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, productRecommendation: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="積極的に聞きたい" id="product-yes" />
              <Label htmlFor="product-yes">積極的に聞きたい</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="必要に応じて聞きたい" id="product-maybe" />
              <Label htmlFor="product-maybe">必要に応じて聞きたい</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="特に必要ない" id="product-no" />
              <Label htmlFor="product-no">特に必要ない</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>その他メニューへの興味</CardTitle>
          <CardDescription>本日ご予約いただいたメニュー以外で興味のあるメニューはありますか？</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.otherMenuInterest}
            onChange={(e) => setFormData((prev) => ({ ...prev, otherMenuInterest: e.target.value }))}
            placeholder="興味のあるメニューをご記入ください（例：トリートメント、ヘッドスパ、まつげエクステなど）"
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>その他・ご要望</CardTitle>
          <CardDescription>その他ご要望やお聞かせいただきたいことがあればお書きください</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.additionalNotes}
            onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
            placeholder="ご要望やご質問をご記入ください"
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isSubmitting} className="px-8">
          {isSubmitting ? "保存中..." : "カウンセリングデータを保存"}
        </Button>
      </div>
    </form>
  )
}
