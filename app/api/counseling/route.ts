import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  // Next.js 15 API Route 公式・型エラーなしパターン（cookies関数をそのまま渡す）
  const supabase = createRouteHandlerClient({ cookies })

  // ユーザー情報の取得とログ出力
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  console.log("現在の認証ユーザー:", user)
  if (userError) {
    console.error("ユーザー取得エラー:", userError)
    return NextResponse.json({ success: false, message: "認証ユーザーの取得に失敗しました" }, { status: 401 })
  }
  if (!user) {
    console.error("認証情報が見つかりません")
    return NextResponse.json({ success: false, message: "認証情報が見つかりません" }, { status: 401 })
  }

  try {
    function mapDrinkService(input: string | undefined | null): string | null {
      switch (input) {
        case "希望する":
          return "コーヒー"
        case "ドリンクのみ希望する":
          return "紅茶"
        case "希望しない":
          return "不要"
        default:
          return null
      }
    }

    console.log("カウンセリングAPI開始")

    const counselingData = await request.json()
    console.log("受信したカウンセリングデータ:", JSON.stringify(counselingData, null, 2))

    // 必須項目の検証
    if (!counselingData.nameKanji || !counselingData.nameKana || !counselingData.phoneNumber) {
      console.log("必須項目チェック失敗")
      return NextResponse.json({ success: false, message: "必須項目が入力されていません" }, { status: 400 })
    }

    // 既存の顧客を検索（電話番号で照合）
    const { data: existingCustomers, error: searchError } = await supabase
      .from("customers")
      .select("*")
      .eq("phone_number", counselingData.phoneNumber)

    if (searchError) {
      console.error("顧客検索エラー:", searchError)
      return NextResponse.json(
        { success: false, message: `顧客検索に失敗しました: ${searchError.message}` },
        { status: 500 },
      )
    }

    let customerId: string

    if (existingCustomers && existingCustomers.length > 0) {
      // 既存顧客の場合、情報を更新
      const customer = existingCustomers[0]
      console.log("既存顧客を更新:", customer.id)
      const updatedCustomerData = {
        name_kanji: counselingData.nameKanji,
        name_kana: counselingData.nameKana,
        gender: counselingData.gender || customer.gender,
        phone_number: counselingData.phoneNumber,
        postal_code: counselingData.postalCode || customer.postal_code,
        address: counselingData.address || customer.address,
        birthdate: counselingData.birthdate || customer.birthdate,
        email: counselingData.email || customer.email,
        updated_at: new Date().toISOString(),
      }
      const { error: updateError } = await supabase.from("customers").update(updatedCustomerData).eq("id", customer.id)
      if (updateError) {
        console.error("顧客データ更新エラー:", updateError)
        return NextResponse.json(
          { success: false, message: `顧客データ更新に失敗しました: ${updateError.message}` },
          { status: 500 },
        )
      }
      customerId = customer.id
    } else {
      // 新規顧客の場合
      console.log("新規顧客を作成")
      const newCustomerData = {
        name_kanji: counselingData.nameKanji,
        name_kana: counselingData.nameKana,
        gender: counselingData.gender || null,
        phone_number: counselingData.phoneNumber,
        email: counselingData.email || null,
        postal_code: counselingData.postalCode || null,
        address: counselingData.address || null,
        birthdate: counselingData.birthdate || null,
        last_visit: new Date().toISOString().split("T")[0],
      }
      const { data: newCustomer, error: insertError } = await supabase
        .from("customers")
        .insert([newCustomerData])
        .select()
        .single()
      if (insertError) {
        console.error("新規顧客作成エラー:", insertError)
        return NextResponse.json(
          { success: false, message: `新規顧客作成に失敗しました: ${insertError.message}` },
          { status: 500 },
        )
      }
      customerId = newCustomer.id
    }

    // counseling_dataへのINSERT
    const counselingRecord = {
      customer_id: customerId,
      date: new Date().toISOString().split("T")[0],
      how_did_you_find_us: counselingData.howDidYouFindUs || [],
      why_choose_us: counselingData.whyChooseUs || [],
      allergies: counselingData.allergies || null,
      last_visit: counselingData.lastVisit || null,
      preferred_finish_time: counselingData.preferredFinishTime || null,
      shampoo_strength: counselingData.shampooStrength || null,
      drink_service: mapDrinkService(counselingData.drinkService),
      conversation_preference: counselingData.conversationPreference || null,
      styling_tools: Array.isArray(counselingData.stylingTools)
        ? counselingData.stylingTools.join(", ")
        : counselingData.stylingTools || null,
      hair_concerns: counselingData.hairConcerns || [],
      product_recommendation: counselingData.productRecommendation || null,
      other_menu_interest: counselingData.otherMenuInterest || null,
      additional_notes: counselingData.additionalNotes || null,
    }

    const { error: counselingError } = await supabase.from("counseling_data").insert([counselingRecord])

    if (counselingError) {
      console.error("カウンセリングデータ保存エラー:", counselingError)
      return NextResponse.json(
        {
          success: false,
          message: `カウンセリングデータ保存に失敗しました: ${counselingError.message}`,
          error: counselingError.details || JSON.stringify(counselingError),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "カウンセリングデータが保存されました",
      customerId: customerId,
    })
  } catch (error) {
    console.error("カウンセリングデータ保存エラー:", error)
    return NextResponse.json(
      {
        success: false,
        message: "エラーが発生しました",
        error:
          error instanceof Error
            ? (error.stack || error.message)
            : typeof error === "object"
            ? JSON.stringify(error)
            : String(error),
      },
      { status: 500 },
    )
  }
}
