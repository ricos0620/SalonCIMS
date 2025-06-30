"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Save, Plus, Trash2 } from "lucide-react"

interface SalonBranch {
  id: string
  name: string
  branchName: string
  postalCode: string
  address: string
  phoneNumber: string
  email: string
  businessHours: string
  description: string
}

export function SalonInfoForm() {
  const [branches, setBranches] = useState<SalonBranch[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    const storedBranches = localStorage.getItem("salon_branches")
    if (storedBranches) {
      setBranches(JSON.parse(storedBranches))
    } else {
      // デフォルトの店舗情報
      setBranches([
        {
          id: "1",
          name: "美容室サンプル",
          branchName: "本店",
          postalCode: "100-0001",
          address: "東京都千代田区千代田1-1-1",
          phoneNumber: "03-1234-5678",
          email: "info@salon-sample.com",
          businessHours: "9:00-19:00（定休日：月曜日）",
          description: "お客様一人ひとりに寄り添った丁寧なサービスを提供いたします。",
        },
      ])
    }
  }, [])

  // 店舗情報を保存
  const saveBranches = () => {
    setIsLoading(true)
    try {
      localStorage.setItem("salon_branches", JSON.stringify(branches))
      toast({
        title: "保存完了",
        description: "サロン情報を保存しました。",
      })
    } catch (error) {
      toast({
        title: "保存エラー",
        description: "サロン情報の保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 新しい店舗を追加
  const addBranch = () => {
    const newBranch: SalonBranch = {
      id: Date.now().toString(),
      name: "",
      branchName: "",
      postalCode: "",
      address: "",
      phoneNumber: "",
      email: "",
      businessHours: "",
      description: "",
    }
    setBranches([...branches, newBranch])
  }

  // 店舗を削除
  const deleteBranch = (id: string) => {
    if (branches.length <= 1) {
      toast({
        title: "削除できません",
        description: "最低1つの店舗情報が必要です。",
        variant: "destructive",
      })
      return
    }
    setBranches(branches.filter((branch) => branch.id !== id))
  }

  // 店舗情報を更新
  const updateBranch = (id: string, field: keyof SalonBranch, value: string) => {
    setBranches(branches.map((branch) => (branch.id === id ? { ...branch, [field]: value } : branch)))
  }

  return (
    <div className="space-y-6">
      {branches.map((branch, index) => (
        <Card key={branch.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{branches.length > 1 ? `店舗 ${index + 1}` : "店舗情報"}</CardTitle>
            {branches.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteBranch(branch.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${branch.id}`}>サロン名</Label>
                <Input
                  id={`name-${branch.id}`}
                  value={branch.name}
                  onChange={(e) => updateBranch(branch.id, "name", e.target.value)}
                  placeholder="美容室サンプル"
                />
              </div>
              <div>
                <Label htmlFor={`branchName-${branch.id}`}>店舗名</Label>
                <Input
                  id={`branchName-${branch.id}`}
                  value={branch.branchName}
                  onChange={(e) => updateBranch(branch.id, "branchName", e.target.value)}
                  placeholder="本店"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`postalCode-${branch.id}`}>郵便番号</Label>
                <Input
                  id={`postalCode-${branch.id}`}
                  value={branch.postalCode}
                  onChange={(e) => updateBranch(branch.id, "postalCode", e.target.value)}
                  placeholder="100-0001"
                />
              </div>
              <div>
                <Label htmlFor={`phoneNumber-${branch.id}`}>電話番号</Label>
                <Input
                  id={`phoneNumber-${branch.id}`}
                  value={branch.phoneNumber}
                  onChange={(e) => updateBranch(branch.id, "phoneNumber", e.target.value)}
                  placeholder="03-1234-5678"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`address-${branch.id}`}>住所</Label>
              <Input
                id={`address-${branch.id}`}
                value={branch.address}
                onChange={(e) => updateBranch(branch.id, "address", e.target.value)}
                placeholder="東京都千代田区千代田1-1-1"
              />
            </div>

            <div>
              <Label htmlFor={`email-${branch.id}`}>メールアドレス</Label>
              <Input
                id={`email-${branch.id}`}
                type="email"
                value={branch.email}
                onChange={(e) => updateBranch(branch.id, "email", e.target.value)}
                placeholder="info@salon-sample.com"
              />
            </div>

            <div>
              <Label htmlFor={`businessHours-${branch.id}`}>営業時間</Label>
              <Input
                id={`businessHours-${branch.id}`}
                value={branch.businessHours}
                onChange={(e) => updateBranch(branch.id, "businessHours", e.target.value)}
                placeholder="9:00-19:00（定休日：月曜日）"
              />
            </div>

            <div>
              <Label htmlFor={`description-${branch.id}`}>サロン紹介</Label>
              <Textarea
                id={`description-${branch.id}`}
                value={branch.description}
                onChange={(e) => updateBranch(branch.id, "description", e.target.value)}
                placeholder="お客様一人ひとりに寄り添った丁寧なサービスを提供いたします。"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-4">
        <Button onClick={addBranch} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          店舗を追加
        </Button>
        <Button onClick={saveBranches} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  )
}

