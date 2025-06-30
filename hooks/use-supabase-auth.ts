"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 現在のセッションを取得
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setLoading(false)
    }

    getSession()

    // 認証状態の変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    return { data, error }
  }

  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    return { error }
  }

  return { user, loading, login, logout }
}

