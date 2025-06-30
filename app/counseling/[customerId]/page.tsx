"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { PageHeader } from "@/components/page-header"
import { StandaloneCounselingForm } from "@/components/counseling/standalone-counseling-form"

export default function CounselingPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.customerId as string

  const [customer, setCustomer] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (customerId === "new" || customerId === "create") {
      router.push("/customers/new")
      return
    }

    const fetchCustomer = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single()

      if (error) {
        console.error("顧客情報の取得に失敗:", error)
      } else {
        setCustomer(data)
      }

      setLoading(false)
    }

    fetchCustomer()
  }, [customerId])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader title="カウンセリングシート" description="読み込み中..." />
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader title="カウンセリングシート" description="該当する顧客が見つかりませんでした。" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="カウンセリングシート"
        description={`お客様名: ${customer.name_kanji}（ID: ${customerId}）`}
      />
      <div className="mt-6">
        <StandaloneCounselingForm customerId={customerId} />
      </div>
    </div>
  )
}
