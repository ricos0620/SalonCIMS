// hooks/use-auth.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase" // ← 修正点

interface AuthContextType {
  user: any
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 認証状態の初期確認
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error)
      }
      setUser(data?.session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // 認証状態の監視
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === "SIGNED_OUT") {
        router.push("/login")
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

