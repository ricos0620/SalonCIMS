"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { supabase } from "@/lib/supabase"
import { Plus, Search, User } from "lucide-react"
import type { Customer } from "@/types/customer"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const { data: rawData, error: fetchError } = await supabase
          .from("customers")
          .select(`
            id,
            name_kanji,
            name_kana,
            gender,
            phone_number,
            email,
            last_visit,
            manual_rank_id,
            membership_ranks (
              name,
              color
            )
          `)
          .order("created_at", { ascending: false })

        if (fetchError) throw fetchError

        const customersData: Customer[] = (rawData ?? []).map((item: any) => ({
          id: item.id,
          nameKanji: item.name_kanji,
          nameKana: item.name_kana,
          gender: item.gender,
          phoneNumber: item.phone_number,
          email: item.email,
          lastVisit: item.last_visit,
          membershipRank: item.membership_ranks?.name ?? undefined,
          membershipColor: item.membership_ranks?.color ?? undefined,
        }))

        setCustomers(customersData)
      } catch (err) {
        console.error("顧客データの取得に失敗:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.nameKanji?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (customer.nameKana?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (customer.phoneNumber?.includes(searchTerm) || "") ||
      (customer.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="顧客管理" description="顧客情報の確認・編集・新規登録" />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="顧客名または電話番号で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link href="/customers/new">
            <Plus className="h-4 w-4 mr-2" />
            新規顧客登録
          </Link>
        </Button>
      </div>

      {filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "検索結果が見つかりません" : "顧客が登録されていません"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "検索条件を変更してお試しください" : "最初の顧客を登録しましょう"}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/customers/new">
                  <Plus className="h-4 w-4 mr-2" />
                  新規顧客登録
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>顧客一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>氏名</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead>会員ランク</TableHead>
                  <TableHead>最終来店</TableHead>
                  <TableHead>性別</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.nameKanji}</div>
                        <div className="text-sm text-gray-500">{customer.nameKana}</div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>
                      {customer.membershipRank ? (
                        <Badge
                          style={{
                            backgroundColor: customer.membershipColor || "#E0E7FF",
                            color: "#222",
                            border: "1px solid #eee",
                          }}
                        >
                          {customer.membershipRank}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{customer.lastVisit || "未来店"}</TableCell>
                    <TableCell>{customer.gender || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm">
                          <Link href={`/customers/${customer.id}`}>詳細</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/counseling/${customer.id}`}>カウンセリング</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-center text-sm text-gray-600">
        {filteredCustomers.length > 0 && (
          <p>{searchTerm ? `検索結果: ${filteredCustomers.length}件` : `総顧客数: ${customers.length}件`}</p>
        )}
      </div>
    </div>
  )
}
