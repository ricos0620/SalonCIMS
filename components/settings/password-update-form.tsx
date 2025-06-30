"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

export function PasswordUpdateForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setIsLoading(true)

    // 基本的なバリデーション
    if (newPassword.length < 8) {
      setError("新しいパスワードは8文字以上である必要があります")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("新しいパスワードと確認用パスワードが一致しません")
      setIsLoading(false)
      return
    }

    try {
      // 現在のパスワードで認証を試みる
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData?.session) {
        setError("セッションが切れています。再ログインしてください。")
        setIsLoading(false)
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(`パスワード変更に失敗しました: ${updateError.message}`)
      } else {
        setMessage("パスワードが正常に変更されました")
        // フォームをリセット
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (err) {
      setError("予期しないエラーが発生しました")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
      {message && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="current-password">現在のパスワード</Label>
        <div className="relative">
          <Input
            id="current-password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showCurrentPassword ? "パスワードを隠す" : "パスワードを表示"}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">新しいパスワード</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showNewPassword ? "パスワードを隠す" : "パスワードを表示"}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showConfirmPassword ? "パスワードを隠す" : "パスワードを表示"}</span>
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "更新中..." : "パスワードを変更する"}
      </Button>
    </form>
  )
}

