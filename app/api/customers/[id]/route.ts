import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
        const { data: customer, error } = await supabase.from("customers").select("*").eq("id", params.id).single()

    if (error) {
      console.error("顧客データ取得エラー:", error)
      return NextResponse.json({ success: false, message: "顧客が見つかりません" }, { status: 404 })
    }

    // カウンセリングデータも取得
    const { data: counselingData } = await supabase
      .from("counseling_data")
      .select("*")
      .eq("customer_id", params.id)
      .single()

    // データ形式を既存のフォーマットに変換
    const formattedCustomer = {
      id: customer.id,
      nameKanji: customer.name_kanji,
      nameKana: customer.name_kana,
      gender: customer.gender,
      membershipNumber: customer.membership_number,
      membershipRank: customer.membership_rank,
      phoneNumber: customer.phone_number,
      phoneNumber2: customer.phone_number2,
      email: customer.email,
      postalCode: customer.postal_code,
      address: customer.address,
      birthdate: customer.birthdate,
      occupation: customer.occupation,
      notes: customer.notes,
      hairThickness: customer.hair_thickness,
      hairCurliness: customer.hair_curliness,
      hairDamage: customer.hair_damage,
      allergies: customer.allergies,
      lastVisit: customer.last_visit,
      counselingData: counselingData
        ? {
            date: counselingData.date,
            howDidYouFindUs: counselingData.how_did_you_find_us,
            whyChooseUs: counselingData.why_choose_us,
            allergies: counselingData.allergies,
            lastVisit: counselingData.last_visit,
            preferredFinishTime: counselingData.preferred_finish_time,
            shampooStrength: counselingData.shampoo_strength,
            drinkService: counselingData.drink_service,
            conversationPreference: counselingData.conversation_preference,
            stylingTools: counselingData.styling_tools,
            hairConcerns: counselingData.hair_concerns,
            productRecommendation: counselingData.product_recommendation,
            otherMenuInterest: counselingData.other_menu_interest,
            additionalNotes: counselingData.additional_notes,
          }
        : null,
    }

    return NextResponse.json(formattedCustomer)
  } catch (error) {
    console.error("顧客データ取得エラー:", error)
    return NextResponse.json({ success: false, message: "エラーが発生しました" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
        const customerData = await request.json()

    // データ形式をSupabase用に変換
    const supabaseData = {
      name_kanji: customerData.nameKanji,
      name_kana: customerData.nameKana,
      gender: customerData.gender,
      membership_number: customerData.membershipNumber,
      membership_rank: customerData.membershipRank,
      phone_number: customerData.phoneNumber,
      phone_number2: customerData.phoneNumber2,
      email: customerData.email,
      postal_code: customerData.postalCode,
      address: customerData.address,
      birthdate: customerData.birthdate,
      occupation: customerData.occupation,
      notes: customerData.notes,
      hair_thickness: customerData.hairThickness,
      hair_curliness: customerData.hairCurliness,
      hair_damage: customerData.hairDamage,
      allergies: customerData.allergies,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("customers").update(supabaseData).eq("id", params.id).select().single()

    if (error) {
      console.error("顧客データ更新エラー:", error)
      return NextResponse.json({ success: false, message: "データ更新に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "顧客データが更新されました",
      customer: data,
    })
  } catch (error) {
    console.error("顧客データ更新エラー:", error)
    return NextResponse.json({ success: false, message: "エラーが発生しました" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    
    const { error } = await supabase.from("customers").delete().eq("id", params.id)

    if (error) {
      console.error("顧客データ削除エラー:", error)
      return NextResponse.json({ success: false, message: "データ削除に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "顧客データが削除されました",
    })
  } catch (error) {
    console.error("顧客データ削除エラー:", error)
    return NextResponse.json({ success: false, message: "エラーが発生しました" }, { status: 500 })
  }
}
