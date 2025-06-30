"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage("登録失敗: " + error.message)
    } else {
      setMessage("登録完了！ご登録いただいたメールに認証リンクを送信しました。")
      setEmail("")
      setPassword("")
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl mb-4">新規登録</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border px-2 py-1 w-full"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border px-2 py-1 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded">
          新規登録
        </button>
      </form>
      {message && <div className="mt-4 text-center">{message}</div>}
    </div>
  )
}
