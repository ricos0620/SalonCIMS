"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, UserPlus, Edit, Trash2 } from "lucide-react"
import { customers, deleteCustomer } from "@/data/customers"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Customer } from "@/types/customer"
import Link from "next/link"

export default function EnhancedCustomersPage() {
  const [customerData, setCustomerData] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // 実際の環境ではAPIからデータを取得
    // ここではモックデータを使用
    const fetchCustomers = async () => {
      setIsLoading(true)
      try {
        // 実際の環境では以下のコメントアウトを解除
        // const response = await fetch(`/api/customers${searchQuery ? `?query=${searchQuery}` : ''}`);
        // const data = await response.json();
        // setCustomers(data);

        // モックデータ
        setTimeout(() => {
          let filteredCustomers = customers
          if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filteredCustomers = customers.filter(
              (customer) =>
                customer.nameKanji.toLowerCase().startsWith(query) ||
                customer.nameKana.toLowerCase().startsWith(query) ||
                customer.phoneNumber.startsWith(query),
            )
          }
          setCustomerData(filteredCustomers)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("顧客データ取得エラー:", error)
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 検索処理は useEffect で行われる
  }

  // 削除確認ダイアログを表示する関数
  const confirmDelete = (customer: Customer) => {
    setCustomerToDelete(customer)
    setIsDeleteDialogOpen(true)
  }

  // 顧客を削除する関数
  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      try {
        deleteCustomer(customerToDelete.id)
        // 顧客リストを更新
        setCustomerData(customerData.filter((c) => c.id !== customerToDelete.id))
        toast({
          title: "顧客を削除しました",
          description: `${customerToDelete.nameKanji}さんの情報を削除しました。`,
        })
      } catch (error) {
        toast({
          title: "削除に失敗しました",
          description: "顧客情報の削除中にエラーが発生しました。",
          variant: "destructive",
        })
      }
    }
    setIsDeleteDialogOpen(false)
    setCustomerToDelete(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">顧客一覧（拡張版）</h1>
        <Button asChild>
          <Link href="/customers/new">
            <UserPlus className="mr-2 h-4 w-4" />
            新規顧客登録
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>顧客検索</CardTitle>
          <form onSubmit={handleSearch} className="flex items-center space-x-2 mt-2">
            <Input
              placeholder="名前、電話番号で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit" size="sm">
              <Search className="h-4 w-4 mr-2" />
              検索
            </Button>
          </form>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>顧客一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">データを読み込み中...</div>
          ) : customerData.length === 0 ? (
            <div className="text-center py-4">顧客データがありません</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">氏名（漢字）</th>
                    <th className="text-left p-2">氏名（かな）</th>
                    <th className="text-left p-2">電話番号</th>
                    <th className="text-left p-2">最終来店日</th>
                    <th className="text-left p-2">会員ランク</th>
                    <th className="text-left p-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{customer.id}</td>
                      <td className="p-2">{customer.nameKanji}</td>
                      <td className="p-2">{customer.nameKana}</td>
                      <td className="p-2">{customer.phoneNumber}</td>
                      <td className="p-2">{customer.lastVisit || "-"}</td>
                      <td className="p-2">{customer.membershipRank || "-"}</td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/customers/${customer.id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              編集
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => confirmDelete(customer)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            削除
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>顧客を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {customerToDelete && (
                <>
                  <span className="font-medium">{customerToDelete.nameKanji}</span>
                  さんの情報を削除します。この操作は元に戻せません。
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-500 hover:bg-red-600">
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

