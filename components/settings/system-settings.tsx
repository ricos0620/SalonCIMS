import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function SystemSettings() {
  const [language, setLanguage] = useState("ja")
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleBackup = () => {
    alert("バックアップを開始します（仮動作）")
  }

  const handleEmailChange = async () => {
    if (email !== confirmEmail) {
      alert("メールアドレスが一致しません")
      return
    }

    const { data, error } = await supabase.auth.updateUser({ email })
    if (error) {
      console.error("メールアドレス更新エラー:", error)
      alert("メールアドレスの変更に失敗しました")
    } else {
      alert("メールアドレスを変更しました")
    }
  }

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      alert("パスワードが一致しません")
      return
    }

    const { data, error } = await supabase.auth.updateUser({ password })
    if (error) {
      console.error("パスワード更新エラー:", error)
      alert("パスワードの変更に失敗しました")
    } else {
      alert("パスワードを変更しました")
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">表示言語</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">登録メールアドレスの変更</h2>
        <div className="space-y-1">
          <Label>新しいメールアドレス</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Label>確認用メールアドレス</Label>
          <Input type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
          <Button onClick={handleEmailChange}>メールアドレスを変更</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">パスワードの変更</h2>
        <div className="space-y-1">
          <Label>新しいパスワード</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Label>確認用パスワード</Label>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Button onClick={handlePasswordChange}>パスワードを変更</Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">バックアップ</h2>
        <Button onClick={handleBackup}>データバックアップ</Button>
      </div>
    </div>
  )
}

