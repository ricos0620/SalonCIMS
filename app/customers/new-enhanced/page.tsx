"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// ② default importに修正
import CustomerForm from "@/components/customer-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function NewEnhancedCustomerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // フロントエンド形式からSupabase形式に変換
      const dataForDb = {
        name_kanji: data.nameKanji,
        name_kana: data.nameKana,
        gender: data.gender || null,
        membership_number: data.membershipNumber || null,
        membership_rank: data.membershipRank || null,
        phone_number: data.phoneNumber,
        phone_number2: data.phoneNumber2 || null,
        email: data.email || null,
        postal_code: data.postalCode || null,
        address: data.address || null,
        birthdate: data.birthdate || null,
        occupation: data.occupation || null,
        notes: data.notes || null,
        hair_thickness: data.hairThickness || null,
        hair_curliness: data.hairCurliness || null,
        hair_damage: data.hairDamage || null,
        allergies: data.allergies || null,
        last_visit: new Date().toISOString().split("T")[0],
      }

      const { data: newCustomer, error } = await supabase.from("customers").insert([dataForDb]).select().single()

      if (error) throw error

      toast({
        title: "顧客登録完了",
        description: "新規顧客が正常に登録されました。",
      })

      router.push(`/customers/${newCustomer.id}`)
    } catch (error) {
      console.error("顧客登録エラー:", error)
      toast({
        title: "エラー",
        description: "顧客登録に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新規顧客登録</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  )
}
