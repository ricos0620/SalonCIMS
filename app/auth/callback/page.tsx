'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          if (!error) {
            router.replace("/"); // ログイン済み状態に遷移
          } else {
            alert("認証エラー: " + error.message);
          }
        });
    } else {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div>認証処理中です...</div>
    </div>
  );
}
