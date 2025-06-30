"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfileUpdateForm() {
  const [displayName, setDisplayName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  // ユーザーデータの取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionData.session.user.id)
          .single()

        if (data) {
          setUserData(data)
          setDisplayName(data.display_name || "")
          setAvatarUrl(data.avatar_url || "")
        }
      }
    }

    fetchUserProfile()
  }, [])

  // アバター画像のプレビュー
  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile)
      setAvatarPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [avatarFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setIsLoading(true)

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData?.session) {
        setError("セッションが切れています。再ログインしてください。")
        setIsLoading(false)
        return
      }

      const userId = sessionData.session.user.id

      // アバター画像のアップロード（ファイルが選択されている場合）
      let newAvatarUrl = avatarUrl
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop()
        const fileName = `${userId}-${Math.random()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, avatarFile)

        if (uploadError) {
          setError(`アバター画像のアップロードに失敗しました: ${uploadError.message}`)
          setIsLoading(false)
          return
        }

        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
        newAvatarUrl = urlData.publicUrl
      }

      // プロフィール情報の更新
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        setError(`プロフィール更新に失敗しました: ${updateError.message}`)
      } else {
        setMessage("プロフィールが正常に更新されました")
        setAvatarUrl(newAvatarUrl)
        setAvatarFile(null)
        setAvatarPreview(null)
      }
    } catch (err) {
      setError("予期しないエラーが発生しました")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
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

      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarPreview || avatarUrl} />
            <AvatarFallback>{displayName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-2">
            <Label htmlFor="avatar" className="cursor-pointer px-4 py-2 border rounded-md hover:bg-gray-100">
              アバターを選択
            </Label>
            <Input id="avatar" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {(avatarPreview || avatarUrl) && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAvatarFile(null)
                  setAvatarPreview(null)
                  setAvatarUrl("")
                }}
              >
                削除
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display-name">表示名</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="表示名を入力"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "更新中..." : "プロフィールを更新する"}
        </Button>
      </div>
    </form>
  )
}

