console.log("staff-invite API start")

import { NextResponse } from "next/server";
import { import { supabase } from "@/lib/supabase"
 } from "@supabase/supabase-js";

// サービスロールキーでサーバーサイド専用クライアント
const supabaseAdmin = import { supabase } from "@/lib/supabase"
(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { email, name, role } = await request.json();

  // 1. Supabase Authで新規ユーザー（招待メール送信）を作成
  const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: false, // trueなら即ログイン可能
    password: Math.random().toString(36).slice(-8),
    user_metadata: { name },
  });

  if (userError || !user) {
    return NextResponse.json({ success: false, message: userError?.message }, { status: 400 });
  }

  // 2. staffテーブルにINSERT
  const { error: staffError } = await supabaseAdmin.from("staff").insert([
    {
      id: user.user.id,
      name,
      email,
      role: role || "staff"
    }
  ]);

  if (staffError) {
    return NextResponse.json({ success: false, message: staffError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, userId: user.user.id });
}
