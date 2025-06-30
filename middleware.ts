// middleware.ts（プロジェクトルート直下。※拡張子含め絶対に"middleware.ts"で）
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return res
}

// すべてのパスで発動（APIも含む。下記のmatcherを必ずセット）
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
