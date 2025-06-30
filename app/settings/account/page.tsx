"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EmailUpdateForm from "@/components/settings/email-update-form"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, User, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase" // 追加

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  // スタッフ招待用 state
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("staff")
  const [inviteLoading, setInviteLoading] = useState(false)

  // スタッフ一覧 state
  const [staffList, setStaffList] = useState<any[]>([])
  const [staffLoading, setStaffLoading] = useState(true)

  // スタッフ一覧取得
  useEffect(() => {
    const fetchStaff = async () => {
      setStaffLoading(true)
      const { data, error } = await supabase.from("staff").select("*").order("created_at", { ascending: false })
      if (!error && data) setStaffList(data)
      setStaffLoading(false)
    }
    fetchStaff()
  }, [])

  // スタッフ招待 submit
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)
    const res = await fetch("/api/staff-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, name: inviteName, role: inviteRole }),
    })
    const data = await res.json()
    setInviteLoading(false)
    if (data.success) {
      alert("スタッフ招待メールを送信しました")
      setInviteName("")
      setInviteEmail("")
      setInviteRole("staff")
      // 再取得
      const { data: staffData } = await supabase.from("staff").select("*").order("created_at", { ascending: false })
      if (staffData) setStaffList(staffData)
    } else {
      alert("エラー: " + data.message)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">アカウント設定</h1>
        <p className="text-muted-foreground">
          アカウント情報の管理、メールアドレスやパスワードの変更、アカウントの削除などができます。
        </p>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">プロフィール</span>
            <span className="sm:hidden">プロフィール</span>
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">メールアドレス</span>
            <span className="sm:hidden">メール</span>
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">パスワード</span>
            <span className="sm:hidden">パスワード</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">危険な操作</span>
            <span className="sm:hidden">危険</span>
          </TabsTrigger>
        </TabsList>

        {/* ... 各タブ内容は省略（そのまま） ... */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>プロフィール設定</CardTitle>
              <CardDescription>表示名やプロフィール画像などの基本情報を設定します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">プロフィール設定機能は準備中です</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>メールアドレス変更</CardTitle>
              <CardDescription>
                アカウントに関連付けられたメールアドレスを変更します。変更後は確認メールが送信されます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailUpdateForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>パスワード変更</CardTitle>
              <CardDescription>
                アカウントのパスワードを変更します。定期的なパスワード変更をおすすめします。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">パスワード変更機能は準備中です</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-500">危険な操作</CardTitle>
              <CardDescription>
                アカウントの削除など、取り消しできない操作を行います。十分に注意してください。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">アカウント削除機能は準備中です</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ここからスタッフ招待フォーム追加 */}
      <Card>
        <CardHeader>
          <CardTitle>スタッフを招待</CardTitle>
          <CardDescription>
            新しいスタッフをメールアドレスで招待できます。スタッフにはログイン用リンクが送信されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInviteSubmit} className="flex flex-col gap-3 max-w-md">
            <Input
              value={inviteName}
              onChange={e => setInviteName(e.target.value)}
              placeholder="スタッフ名"
              required
            />
            <Input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="メールアドレス"
              required
            />
            <select
              className="border rounded px-3 py-2"
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
            >
              <option value="staff">スタッフ</option>
              <option value="admin">管理者</option>
            </select>
            <Button type="submit" disabled={inviteLoading}>
              {inviteLoading ? "送信中..." : "スタッフを招待"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* スタッフ一覧の表示 */}
      <Card>
        <CardHeader>
          <CardTitle>登録済みスタッフ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {staffLoading ? (
            <div>読み込み中...</div>
          ) : staffList.length === 0 ? (
            <div>スタッフがまだ登録されていません。</div>
          ) : (
            <table className="w-full border mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-1 px-2 border">名前</th>
                  <th className="py-1 px-2 border">メールアドレス</th>
                  <th className="py-1 px-2 border">権限</th>
                  <th className="py-1 px-2 border">登録日</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, i) => (
                  <tr key={staff.id || i}>
                    <td className="py-1 px-2 border">{staff.name}</td>
                    <td className="py-1 px-2 border">{staff.email}</td>
                    <td className="py-1 px-2 border">{staff.role}</td>
                    <td className="py-1 px-2 border">
                      {staff.created_at ? new Date(staff.created_at).toLocaleString("ja-JP") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {/* ここまで */}
    </div>
  )
}
