"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TestLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log("ログイン試行:", { email, password })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("ログイン結果:", { data, error })

      setResult({
        success: !error,
        data,
        error: error?.message || null,
      })
    } catch (err) {
      console.error("ログインエラー:", err)
      setResult({
        success: false,
        error: "予期しないエラーが発生しました",
      })
    }

    setLoading(false)
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase認証テスト</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="test@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="password"
          />
        </div>

        <button
          onClick={handleTest}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "テスト中..." : "ログインテスト"}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold mb-2">結果:</h3>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

