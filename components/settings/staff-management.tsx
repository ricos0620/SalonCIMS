"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Save, Plus, Trash2, User } from "lucide-react"

// staffテーブルと一致
interface StaffMember {
  id?: string   // 新規追加時は一時的にundefined
  name: string
  nameKana: string
  role: string
  email: string
  phoneNumber: string
  permissions: string[]
  isActive: boolean
}

const roles = [
  { value: "owner", label: "オーナー" },
  { value: "manager", label: "店長" },
  { value: "stylist", label: "スタイリスト" },
  { value: "assistant", label: "アシスタント" },
  { value: "receptionist", label: "受付" },
]

const permissions = [
  { value: "customer_management", label: "顧客管理" },
  { value: "counseling_management", label: "カウンセリング管理" },
  { value: "treatment_management", label: "施術管理" },
  { value: "staff_management", label: "スタッフ管理" },
  { value: "settings_management", label: "設定管理" },
  { value: "analytics_view", label: "分析データ閲覧" },
]

export function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // ★ ここだけ修正（Supabaseから取得→キャメルケースへ変換してからsetStaff）
  const fetchStaff = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) {
      setStaff(
        data.map((row: any) => ({
          id: row.id,
          name: row.name,
          nameKana: row.name_kana || "", // ←ここ
          role: row.role,
          email: row.email,
          phoneNumber: row.phone_number || "", // ←ここ
          permissions: row.permissions ?? [],
          isActive: row.is_active ?? true, // ←ここ
        }))
      )
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  // 新規スタッフ追加
  const addStaff = () => {
    setStaff([
      ...staff,
      {
        name: "",
        nameKana: "",
        role: "assistant",
        email: "",
        phoneNumber: "",
        permissions: ["customer_management"],
        isActive: true,
      },
    ])
  }

  // 入力更新
  const updateStaff = (idx: number, field: keyof StaffMember, value: any) => {
    setStaff((prev) =>
      prev.map((member, i) =>
        i === idx ? { ...member, [field]: value } : member
      )
    )
  }

  // 権限チェック切替
  const togglePermission = (idx: number, permission: string) => {
    setStaff((prev) =>
      prev.map((member, i) => {
        if (i !== idx) return member
        const perms = member.permissions || []
        return {
          ...member,
          permissions: perms.includes(permission)
            ? perms.filter((p) => p !== permission)
            : [...perms, permission],
        }
      })
    )
  }

  // 保存（insert: id無し、update: id有り）
  const saveStaff = async () => {
    setIsLoading(true)
    try {
      for (const member of staff) {
        if (!member.name) continue // 氏名空は無視

        if (!member.id) {
          // 新規
          const { error } = await supabase.from("staff").insert([{
            name: member.name,
            name_kana: member.nameKana,
            role: member.role,
            email: member.email,
            phone_number: member.phoneNumber,
            permissions: member.permissions,
            is_active: member.isActive,
          }])
          if (error) throw error
        } else {
          // 既存→update
          const { error } = await supabase.from("staff").update({
            name: member.name,
            name_kana: member.nameKana,
            role: member.role,
            email: member.email,
            phone_number: member.phoneNumber,
            permissions: member.permissions,
            is_active: member.isActive,
          }).eq("id", member.id)
          if (error) throw error
        }
      }
      toast({
        title: "保存完了",
        description: "スタッフ情報をDBに保存しました。",
      })
      await fetchStaff()
    } catch (error: any) {
      toast({
        title: "保存エラー",
        description: error.message || "スタッフ情報の保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 削除
  const deleteStaff = async (id?: string, idx?: number) => {
    if (!id && idx !== undefined) {
      // 新規追加の行を削除
      setStaff(staff.filter((_, i) => i !== idx))
      return
    }
    if (!id) return
    setIsLoading(true)
    try {
      const { error } = await supabase.from("staff").delete().eq("id", id)
      if (error) throw error
      toast({ title: "削除完了", description: "スタッフを削除しました。" })
      await fetchStaff()
    } catch (error: any) {
      toast({
        title: "削除エラー",
        description: error.message || "削除に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {isLoading && <div>読み込み中...</div>}

      {staff.map((member, index) => (
        <Card key={member.id || `new-${index}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              スタッフ {index + 1}
            </CardTitle>
            {staff.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteStaff(member.id, index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${index}`}>氏名</Label>
                <Input
                  id={`name-${index}`}
                  value={member.name}
                  onChange={(e) => updateStaff(index, "name", e.target.value)}
                  placeholder="山田太郎"
                />
              </div>
              <div>
                <Label htmlFor={`nameKana-${index}`}>氏名（かな）</Label>
                <Input
                  id={`nameKana-${index}`}
                  value={member.nameKana}
                  onChange={(e) => updateStaff(index, "nameKana", e.target.value)}
                  placeholder="やまだたろう"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`role-${index}`}>役職</Label>
                <Select value={member.role} onValueChange={(value) => updateStaff(index, "role", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`email-${index}`}>メールアドレス</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  value={member.email}
                  onChange={(e) => updateStaff(index, "email", e.target.value)}
                  placeholder="yamada@salon.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`phoneNumber-${index}`}>電話番号</Label>
              <Input
                id={`phoneNumber-${index}`}
                value={member.phoneNumber}
                onChange={(e) => updateStaff(index, "phoneNumber", e.target.value)}
                placeholder="090-1234-5678"
              />
            </div>
            <div>
              <Label>権限設定</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {permissions.map((permission) => (
                  <label key={permission.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={member.permissions.includes(permission.value)}
                      onChange={() => togglePermission(index, permission.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{permission.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`isActive-${index}`}
                checked={member.isActive}
                onChange={(e) => updateStaff(index, "isActive", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor={`isActive-${index}`}>アクティブ</Label>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex gap-4">
        <Button onClick={addStaff} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          スタッフを追加
        </Button>
        <Button onClick={saveStaff} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  )
}
