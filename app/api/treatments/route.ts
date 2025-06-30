import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = supabase
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    let supabaseQuery = supabase.from("treatments").select("*").order("date", { ascending: false })

    if (customerId) {
      supabaseQuery = supabaseQuery.eq("customer_id", customerId)
    }

    const { data: treatments, error } = await supabaseQuery

    if (error) {
      console.error("施術データ取得エラー:", error)
      return NextResponse.json({ success: false, message: "データ取得に失敗しました" }, { status: 500 })
    }

    // データ形式を既存のフォーマットに変換
    const formattedTreatments =
      treatments?.map((treatment) => ({
        id: treatment.id,
        customerId: treatment.customer_id,
        date: treatment.date,
        type: treatment.type,
        description: treatment.description,
        products: treatment.products || [],
        stylist: treatment.stylist,
        price: treatment.price,
        notes: treatment.notes,
        images: treatment.images || [],
      })) || []

    return NextResponse.json(formattedTreatments)
  } catch (error) {
    console.error("施術データ取得エラー:", error)
    return NextResponse.json({ success: false, message: "エラーが発生しました" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = supabase
    const treatmentData = await request.json()

    // データ形式をSupabase用に変換
    const supabaseData = {
      customer_id: treatmentData.customerId,
      date: treatmentData.date,
      type: treatmentData.type,
      description: treatmentData.description,
      products: treatmentData.products || [],
      stylist: treatmentData.stylist,
      price: treatmentData.price,
      notes: treatmentData.notes,
      images: treatmentData.images || [],
    }

    const { data, error } = await supabase.from("treatments").insert([supabaseData]).select().single()

    if (error) {
      console.error("施術データ保存エラー:", error)
      return NextResponse.json({ success: false, message: "データ保存に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "施術データが保存されました",
      treatment: data,
    })
  } catch (error) {
    console.error("施術データ保存エラー:", error)
    return NextResponse.json({ success: false, message: "エラーが発生しました" }, { status: 500 })
  }
}

