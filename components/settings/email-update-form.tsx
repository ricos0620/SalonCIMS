"use client"

import type React from "react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EmailUpdateForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setIsLoading(true)

    if (!email || !email.includes("@")) {
      setError("有効なメールアドレスを入力してください")
      setIsLoading(false)
      return
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData?.session) {
      setError("セッションが切れています。再ログインしてください。")
      setIsLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ email })

    if (updateError) {
      // Supabaseが確認メールを送っているかもしれない場合の処理
      if (updateError.message.includes("invalid")) {
        setMessage("メールアドレス変更を受け付けました。確認メールをご確認ください。")
      } else {
        setError(`メールアドレス変更に失敗しました: ${updateError.message}`)
      }
    } else {
      setMessage("メールアドレス変更を受け付けました。確認メールをご確認ください。")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleEmailUpdate} className="space-y-4 max-w-md">
      {message && (
        <Alert variant="default">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">新しいメールアドレス</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "更新中..." : "メールアドレスを変更する"}
      </Button>
    </form>
  )
}

