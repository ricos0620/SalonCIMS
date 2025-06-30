"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerForm } from "@/components/customer-form"
import { TreatmentHistory } from "@/components/treatment-history"
import { NewTreatmentForm } from "@/components/new-treatment-form"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import type { Customer } from "@/types/customer"
import type { Treatment } from "@/types/treatment"

export default function EnhancedCustomerPage({ params }: { params: { customerId: string } }) {
  const router = useRouter()
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  
  // 顧客データを取得する関数
  const fetchCustomerData = async () => {
    try {
      const { data, error } = await supabase.from("customers").select("*").eq("id", params.customerId).single()

      if (error) throw error

      // Supabaseのデータ形式をフロントエンド形式に変換
      const customerData: Customer = {
        id: data.id,
        nameKanji: data.name_kanji,
        nameKana: data.name_kana,
        gender: data.gender,
        membershipNumber: data.membership_number,
        membershipRank: data.membership_rank,
        phoneNumber: data.phone_number,
        phoneNumber2: data.phone_number2,
        email: data.email,
        postalCode: data.postal_code,
        address: data.address,
        lastVisit: data.last_visit,
        birthdate: data.birthdate,
        occupation: data.occupation,
        notes: data.notes,
        hairThickness: data.hair_thickness,
        hairCurliness: data.hair_curliness,
        hairDamage: data.hair_damage,
        allergies: data.allergies,
      }

      setCustomerData(customerData)
    } catch (error) {
      console.error("顧客データの取得に失敗:", error)
    }
  }

  // 施術履歴を取得する関数
  const fetchTreatments = async () => {
    try {
      const { data, error } = await supabase
        .from("treatments")
        .select("*")
        .eq("customer_id", params.customerId)
        .order("date", { ascending: false })

      if (error) throw error

      // Supabaseのデータ形式をフロントエンド形式に変換
      const treatmentsData: Treatment[] =
        data?.map((item) => ({
          id: item.id,
          customerId: item.customer_id,
          date: item.date,
          type: item.type,
          description: item.description,
          products: item.products || [],
          stylist: item.stylist,
          price: item.price,
          notes: item.notes,
          images: item.images || [],
        })) || []

      setTreatments(treatmentsData)
    } catch (error) {
      console.error("施術履歴の取得に失敗:", error)
    }
  }

  // データを再取得する関数
  const refreshData = async () => {
    setIsRefreshing(true)
    await Promise.all([fetchCustomerData(), fetchTreatments()])
    setIsRefreshing(false)
  }

  // 初期データ取得
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCustomerData(), fetchTreatments()])
      setLoading(false)
    }
    loadData()
  }, [params.customerId])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  if (!customerData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">顧客が見つかりません</h1>
        <Button asChild>
          <Link href="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            顧客一覧に戻る
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>

        <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          データを更新
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>{customerData.nameKanji}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">氏名（かな）:</span> {customerData.nameKana}
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="font-medium">会員番号:</span> {customerData.membershipNumber || "-"}
                  </div>
                  <div>
                    <span className="font-medium">会員ランク:</span> {customerData.membershipRank || "-"}
                  </div>
                </div>
                {customerData.gender && (
                  <div>
                    <span className="font-medium">性別:</span> {customerData.gender}
                  </div>
                )}
                <div>
                  <span className="font-medium">電話番号1:</span> {customerData.phoneNumber}
                </div>
                {customerData.phoneNumber2 && (
                  <div>
                    <span className="font-medium">電話番号2:</span> {customerData.phoneNumber2}
                  </div>
                )}
                <div>
                  <span className="font-medium">メール:</span> {customerData.email || "-"}
                </div>
                {customerData.postalCode && (
                  <div>
                    <span className="font-medium">郵便番号:</span> {customerData.postalCode}
                  </div>
                )}
                {customerData.address && (
                  <div>
                    <span className="font-medium">住所:</span> {customerData.address}
                  </div>
                )}
                {customerData.occupation && (
                  <div>
                    <span className="font-medium">職業:</span> {customerData.occupation}
                  </div>
                )}
                <div>
                  <span className="font-medium">最終来店日:</span> {customerData.lastVisit || "-"}
                </div>
                <div className="pt-2">
                  <span className="font-medium">髪質情報:</span>
                  <div className="pl-4 pt-1">
                    <div>
                      <span className="font-medium">髪の太さ:</span> {customerData.hairThickness || "-"}
                    </div>
                    <div>
                      <span className="font-medium">くせ:</span> {customerData.hairCurliness || "-"}
                    </div>
                    <div>
                      <span className="font-medium">ダメージ:</span> {customerData.hairDamage || "-"}
                    </div>
                  </div>
                </div>
                {customerData.counselingData && (
                  <div className="pt-2">
                    <span className="font-medium text-primary">カウンセリング情報あり</span>
                    <div className="text-xs text-muted-foreground">最終更新: {customerData.counselingData.date}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">プロフィール</TabsTrigger>
              <TabsTrigger value="counseling">カウンセリング</TabsTrigger>
              <TabsTrigger value="history">施術履歴</TabsTrigger>
              <TabsTrigger value="new-treatment">新規施術</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>顧客情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomerForm customer={customerData} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="counseling">
              <Card>
                <CardHeader>
                  <CardTitle>カウンセリング情報</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerData.counselingData ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">基本情報</h4>
                        <div className="text-sm space-y-1">
                          <div>記録日: {customerData.counselingData.date}</div>
                          {customerData.counselingData.allergies && (
                            <div>アレルギー: {customerData.counselingData.allergies}</div>
                          )}
                          {customerData.counselingData.lastVisit && (
                            <div>前回来店: {customerData.counselingData.lastVisit}</div>
                          )}
                        </div>
                      </div>
                      {customerData.counselingData.hairConcerns &&
                        customerData.counselingData.hairConcerns.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">髪の悩み</h4>
                            <div className="text-sm">{customerData.counselingData.hairConcerns.join(", ")}</div>
                          </div>
                        )}
                      {customerData.counselingData.additionalNotes && (
                        <div>
                          <h4 className="font-semibold mb-2">その他の要望</h4>
                          <div className="text-sm">{customerData.counselingData.additionalNotes}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">カウンセリング情報がありません</p>
                      <Button asChild>
                        <Link href={`/counseling/${customerData.id}`}>カウンセリング実施</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>施術履歴</CardTitle>
                </CardHeader>
                <CardContent>
                  <TreatmentHistory treatments={treatments} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="new-treatment">
              <Card>
                <CardHeader>
                  <CardTitle>新規施術登録</CardTitle>
                </CardHeader>
                <CardContent>
                  <NewTreatmentForm customerId={customerData.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
