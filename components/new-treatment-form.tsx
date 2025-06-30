"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface NewTreatmentFormProps {
  customerId: string
}

export function NewTreatmentForm({ customerId }: NewTreatmentFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    stylist: "",
    price: "",
    notes: "",
    products: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // ここで実際の保存処理を行う
    console.log("新規施術データ:", { customerId, ...formData })

    toast({
      title: "施術記録を追加しました",
      description: "新しい施術記録が保存されました。",
    })

    // フォームをリセット
    setFormData({
      type: "",
      description: "",
      stylist: "",
      price: "",
      notes: "",
      products: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">施術タイプ</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="施術タイプを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="カット">カット</SelectItem>
              <SelectItem value="カラー">カラー</SelectItem>
              <SelectItem value="パーマ">パーマ</SelectItem>
              <SelectItem value="ストレートパーマ">ストレートパーマ</SelectItem>
              <SelectItem value="トリートメント">トリートメント</SelectItem>
              <SelectItem value="ヘッドスパ">ヘッドスパ</SelectItem>
              <SelectItem value="セット">セット</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stylist">担当者</Label>
          <Input
            id="stylist"
            value={formData.stylist}
            onChange={(e) => setFormData({ ...formData, stylist: e.target.value })}
            placeholder="担当者名"
          />
        </div>
        <div>
          <Label htmlFor="price">料金</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="料金（円）"
          />
        </div>
        <div>
          <Label htmlFor="products">使用薬剤・商品</Label>
          <Input
            id="products"
            value={formData.products}
            onChange={(e) => setFormData({ ...formData, products: e.target.value })}
            placeholder="商品名（カンマ区切り）"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">施術内容</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="施術の詳細内容"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="notes">備考</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="その他メモ"
          rows={2}
        />
      </div>
      <Button type="submit" className="w-full">
        施術記録を追加
      </Button>
    </form>
  )
}

