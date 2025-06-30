"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export function AccountDeleteForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAccountDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // 確認テキストのチェック
    if (confirmText !== "アカウントを削除する") {
      setError("確認テキストが正しくありません")
      setIsLoading(false)
      return
    }

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData?.session) {
        setError("セッションが切れています。再ログインしてください。")
        setIsLoading(false)
        return
      }

      const currentUser = sessionData.session.user

      // メールアドレスの確認
      if (email !== currentUser.email) {
        setError("入力されたメールアドレスが現在のアカウントと一致しません")
        setIsLoading(false)
        return
      }

      // アカウント削除のAPIを呼び出す
      // 注意: Supabaseの標準APIにはアカウント削除機能がないため、
      // カスタムAPIエンドポイントを作成する必要があります
      const { error: deleteError } = await supabase.functions.invoke("delete-account", {
        body: { userId: currentUser.id },
      })

      if (deleteError) {
        setError(`アカウント削除に失敗しました: ${deleteError.message}`)
      } else {
        // ログアウトしてホームページにリダイレクト
        await supabase.auth.signOut()
        router.push("/account-deleted")
      }
    } catch (err) {
      setError("予期しないエラーが発生しました")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleAccountDelete} className="space-y-4 max-w-md">
      <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
        <AlertDescription>
          アカウントを削除すると、すべてのデータが完全に削除され、この操作は元に戻せません。
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">現在のメールアドレスを入力</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your-email@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-text">確認のため「アカウントを削除する」と入力してください</Label>
        <Input
          id="confirm-text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="アカウントを削除する"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="confirm-delete"
          checked={confirmDelete}
          onCheckedChange={(checked) => setConfirmDelete(!!checked)}
        />
        <Label htmlFor="confirm-delete" className="text-sm">
          私はこの操作が取り消せないことを理解し、アカウントを完全に削除することに同意します
        </Label>
      </div>

      <Button
        type="submit"
        variant="destructive"
        className="w-full"
        disabled={isLoading || !confirmDelete || confirmText !== "アカウントを削除する" || !email}
      >
        {isLoading ? "処理中..." : "アカウントを完全に削除する"}
      </Button>
    </form>
  )
}

