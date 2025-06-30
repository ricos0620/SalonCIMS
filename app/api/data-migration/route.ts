import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { customers, treatments, staff, menus } = await request.json()
    const supabase = createServerClient()

    // 顧客データの移行
    const customerMigrationResults = []
    for (const customer of customers) {
      const { data, error } = await supabase
        .from("customers")
        .insert({
          name_kanji: customer.nameKanji,
          name_kana: customer.nameKana,
          gender: customer.gender,
          membership_number: customer.membershipNumber,
          membership_rank: customer.membershipRank,
          phone_number: customer.phoneNumber,
          phone_number2: customer.phoneNumber2,
          email: customer.email,
          postal_code: customer.postalCode,
          address: customer.address,
          birthdate: customer.birthdate,
          occupation: customer.occupation,
          notes: customer.notes,
          hair_thickness: customer.hairThickness,
          hair_curliness: customer.hairCurliness,
          hair_damage: customer.hairDamage,
          allergies: customer.allergies,
          last_visit: customer.lastVisit,
        })
        .select()
        .single()

      if (error) {
        console.error("顧客データ移行エラー:", error)
        customerMigrationResults.push({
          originalId: customer.id,
          success: false,
          error: error.message,
        })
      } else {
        customerMigrationResults.push({
          originalId: customer.id,
          newId: data.id,
          success: true,
        })

        // カウンセリングデータがある場合は移行
        if (customer.counselingData) {
          const { error: counselingError } = await supabase.from("counseling_data").insert({
            customer_id: data.id,
            date: customer.counselingData.date,
            how_did_you_find_us: customer.counselingData.howDidYouFindUs,
            why_choose_us: customer.counselingData.whyChooseUs,
            allergies: customer.counselingData.allergies,
            last_visit: customer.counselingData.lastVisit,
            preferred_finish_time: customer.counselingData.preferredFinishTime,
            shampoo_strength: customer.counselingData.shampooStrength,
            drink_service: customer.counselingData.drinkService,
            conversation_preference: customer.counselingData.conversationPreference,
            styling_tools: customer.counselingData.stylingTools,
            hair_concerns: customer.counselingData.hairConcerns,
            product_recommendation: customer.counselingData.productRecommendation,
            other_menu_interest: customer.counselingData.otherMenuInterest,
            additional_notes: customer.counselingData.additionalNotes,
          })

          if (counselingError) {
            console.error("カウンセリングデータ移行エラー:", counselingError)
          }
        }
      }
    }

    // 施術データの移行
    const treatmentMigrationResults = []
    for (const treatment of treatments) {
      // 対応する新しい顧客IDを見つける
      const customerMapping = customerMigrationResults.find(
        (result) => result.originalId === treatment.customerId && result.success,
      )

      if (!customerMapping) {
        treatmentMigrationResults.push({
          originalId: treatment.id,
          success: false,
          error: "対応する顧客が見つかりません",
        })
        continue
      }

      const { data, error } = await supabase
        .from("treatments")
        .insert({
          customer_id: customerMapping.newId,
          date: treatment.date,
          type: treatment.type,
          description: treatment.description,
          products: treatment.products,
          stylist: treatment.stylist,
          price: treatment.price,
          notes: treatment.notes,
          images: treatment.images,
        })
        .select()
        .single()

      if (error) {
        console.error("施術データ移行エラー:", error)
        treatmentMigrationResults.push({
          originalId: treatment.id,
          success: false,
          error: error.message,
        })
      } else {
        treatmentMigrationResults.push({
          originalId: treatment.id,
          newId: data.id,
          success: true,
        })
      }
    }

    // スタッフデータの移行
    const staffMigrationResults = []
    if (staff && staff.length > 0) {
      for (const staffMember of staff) {
        const { data, error } = await supabase
          .from("staff")
          .insert({
            name: staffMember.name,
            role: staffMember.position,
            active: true,
          })
          .select()
          .single()

        if (error) {
          console.error("スタッフデータ移行エラー:", error)
          staffMigrationResults.push({
            originalId: staffMember.id,
            success: false,
            error: error.message,
          })
        } else {
          staffMigrationResults.push({
            originalId: staffMember.id,
            newId: data.id,
            success: true,
          })
        }
      }
    }

    // メニューデータの移行
    const menuMigrationResults = []
    if (menus && menus.length > 0) {
      for (const menu of menus) {
        const { data, error } = await supabase
          .from("menus")
          .insert({
            name: menu.name,
            category: menu.category,
            price: Number.parseInt(menu.price),
            description: menu.description,
            sort_order: menu.order,
            active: true,
          })
          .select()
          .single()

        if (error) {
          console.error("メニューデータ移行エラー:", error)
          menuMigrationResults.push({
            originalId: menu.id,
            success: false,
            error: error.message,
          })
        } else {
          menuMigrationResults.push({
            originalId: menu.id,
            newId: data.id,
            success: true,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "データ移行が完了しました",
      results: {
        customers: customerMigrationResults,
        treatments: treatmentMigrationResults,
        staff: staffMigrationResults,
        menus: menuMigrationResults,
      },
    })
  } catch (error) {
    console.error("データ移行エラー:", error)
    return NextResponse.json({ success: false, message: "データ移行に失敗しました" }, { status: 500 })
  }
}

