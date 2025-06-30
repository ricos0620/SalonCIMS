"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"

interface Treatment {
  id: string
  date: string
  stylist: string
  notes: string
  customer: {
    name_kanji: string
  } | null
}

export default function CreateTreatmentPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTreatments() {
      const { data, error } = await supabase
        .from("treatments")
        .select(`
          id,
          date,
          stylist,
          notes,
          customers!fk_customer (
            name_kanji
          )
        `)
        .order("date", { ascending: false })

      if (error) {
        console.error("施術データの取得に失敗:", error)
      } else {
        const formatted = data.map((item: any) => ({
          id: item.id,
          date: item.date,
          stylist: item.stylist,
          notes: item.notes,
          customer: item.customers || null,
        }))
        setTreatments(formatted)
      }

      setLoading(false)
    }

    fetchTreatments()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="施術履歴" description="施術内容の一覧と管理" />
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/treatments/new">新規施術を追加</Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center">読み込み中...</div>
      ) : treatments.length === 0 ? (
        <div className="text-center text-gray-600">施術データが存在しません。</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>施術一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>担当者</TableHead>
                  <TableHead>備考</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatments.map((treatment) => (
                  <TableRow
                    key={treatment.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => window.location.href = `/treatments/${treatment.id}/edit`}
                  >
                    <TableCell>{treatment.date}</TableCell>
                    <TableCell>{treatment.customer?.name_kanji ?? "不明"}</TableCell>
                    <TableCell>{treatment.stylist}</TableCell>
                    <TableCell>{treatment.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
