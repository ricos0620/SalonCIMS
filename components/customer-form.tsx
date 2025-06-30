"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Customer } from "@/types/customer"

// ↓ export defaultに変更
interface CustomerFormProps {
  // 新規登録: onSubmitを受け取る
  onSubmit?: (data: any) => Promise<void>
  isSubmitting?: boolean
  // 編集: customerを受け取る
  customer?: Customer
  // 編集時: 保存処理を外部から渡したい場合（拡張用）
  onSaveEdit?: (data: any) => Promise<void>
}

const CustomerForm = ({
  onSubmit,
  isSubmitting = false,
  customer,
  onSaveEdit,
}: CustomerFormProps) => {
  const { toast } = useToast()
  // 初期値: 新規→空、編集→customer
  const [formData, setFormData] = useState(
    customer
      ? {
          nameKanji: customer.nameKanji || "",
          nameKana: customer.nameKana || "",
          gender: customer.gender || "",
          phoneNumber: customer.phoneNumber || "",
          email: customer.email || "",
          occupation: customer.occupation || "",
          notes: customer.notes || "",
        }
      : {
          nameKanji: "",
          nameKana: "",
          gender: "",
          phoneNumber: "",
          email: "",
          occupation: "",
          notes: "",
        }
  )

  // 編集フォームの状態管理
  const [isEditing, setIsEditing] = useState(customer ? false : true)

  // 編集モード切替時に初期値反映
  useEffect(() => {
    if (customer) {
      setFormData({
        nameKanji: customer.nameKanji || "",
        nameKana: customer.nameKana || "",
        gender: customer.gender || "",
        phoneNumber: customer.phoneNumber || "",
        email: customer.email || "",
        occupation: customer.occupation || "",
        notes: customer.notes || "",
      })
    }
  }, [customer])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 新規登録 or 編集保存
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    if (onSubmit) {
      await onSubmit(formData)
    } else if (onSaveEdit) {
      await onSaveEdit(formData)
      setIsEditing(false)
    } else {
      // ローカルのみ
      toast({ title: "保存", description: "フォームデータ: " + JSON.stringify(formData) })
      setIsEditing(false)
    }
  }

  // 編集キャンセル
  const handleCancel = () => {
    if (customer) {
      setFormData({
        nameKanji: customer.nameKanji || "",
        nameKana: customer.nameKana || "",
        gender: customer.gender || "",
        phoneNumber: customer.phoneNumber || "",
        email: customer.email || "",
        occupation: customer.occupation || "",
        notes: customer.notes || "",
      })
    }
    setIsEditing(false)
  }

  // 表示: 編集フォーム or 閲覧表示
  if (customer && !isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">基本情報</h3>
          <Button onClick={() => setIsEditing(true)}>編集</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>お名前（漢字）</Label>
            <div className="mt-1 text-sm">{customer.nameKanji}</div>
          </div>
          <div>
            <Label>お名前（かな）</Label>
            <div className="mt-1 text-sm">{customer.nameKana}</div>
          </div>
          <div>
            <Label>性別</Label>
            <div className="mt-1 text-sm">{customer.gender || "未設定"}</div>
          </div>
          <div>
            <Label>電話番号</Label>
            <div className="mt-1 text-sm">{customer.phoneNumber}</div>
          </div>
          <div>
            <Label>メールアドレス</Label>
            <div className="mt-1 text-sm">{customer.email || "未設定"}</div>
          </div>
          <div>
            <Label>職業</Label>
            <div className="mt-1 text-sm">{customer.occupation || "未設定"}</div>
          </div>
        </div>
        {customer.notes && (
          <div>
            <Label>備考</Label>
            <div className="mt-1 text-sm whitespace-pre-wrap">{customer.notes}</div>
          </div>
        )}
      </div>
    )
  }

  // 編集 or 新規登録フォーム
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nameKanji">お名前（漢字）</Label>
          <Input
            id="nameKanji"
            value={formData.nameKanji}
            onChange={(e) => handleChange("nameKanji", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="nameKana">お名前（かな）</Label>
          <Input
            id="nameKana"
            value={formData.nameKana}
            onChange={(e) => handleChange("nameKana", e.target.value)}
            required
          />
        </div>
        <div>
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
        <div>
          <Label htmlFor="phoneNumber">電話番号</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="occupation">職業</Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => handleChange("occupation", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">備考</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
        />
      </div>
      <div className="text-right space-x-2">
        {customer && (
          <Button variant="outline" type="button" onClick={handleCancel}>
            キャンセル
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : customer ? "保存" : "登録"}
        </Button>
      </div>
    </form>
  )
}

// ★ ここだけexport default
export default CustomerForm
