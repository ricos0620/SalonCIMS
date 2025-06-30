import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = supabase
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    let supabaseQuery = supabase.from("customers").select("*").order("created_at", { ascending: false })

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `name_kanji.ilike.%${query}%,name_kana.ilike.%${query}%,phone_number.ilike.%${query}%`,
      )
    }

    const { data: customers, error } = await supabaseQuery

    if (error) {
      console.error("顧客データ取得エラー:", error)
      return NextResponse.json({ success: false, message: "データ取得に失敗しました" }, { status: 500 })
    }

    // データ形式を既存のフォーマットに変換
    const formattedCustomers =
      customers?.map((customer) => ({
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
      })) || []

    return NextResponse.json(formattedCustomers)
  } catch (error) {
    console.error("顧客データ取得エラー:", error)
    return NextResponse.json({ success: false, message: "エラーが発生しました" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = supabase
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
      last_visit: new Date().toISOString().split("T")[0],
    }

    const { data, error } = await supabase.from("customers").insert([supabaseData]).select().single()

    if (error) {
      console.error("顧客データ保存エラー:", error)
      return NextResponse.json({ success: false, message: "データ保存に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "顧客データが保存されました",
      customer: data,
    })
  } catch (error) {
    console.error("顧客データ保存エラー:", error)
    return NextResponse.json({ success: false, message: "エラーが発生しました" }, { status: 500 })
  }
}

