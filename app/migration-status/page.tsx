"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface DataCount {
  customers: number
  treatments: number
  counseling_data: number
  staff: number
  menus: number
}

export default function MigrationStatus() {
  const [oldData, setOldData] = useState<DataCount | null>(null)
  const [newData, setNewData] = useState<DataCount | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkDataCounts = async () => {
    setLoading(true)
    setError(null)

    try {
      // 現在のプロジェクト（新しいプロジェクト）のデータ数を確認
      const tables = ["customers", "treatments", "counseling_data", "staff", "menus"]
      const counts: any = {}

      for (const table of tables) {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

        if (error) {
          throw new Error(`${table}テーブルの確認でエラー: ${error.message}`)
        }

        counts[table] = count || 0
      }

      setNewData(counts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkDataCounts()
  }, [])

  const totalOld = oldData ? Object.values(oldData).reduce((sum, count) => sum + count, 0) : 0
  const totalNew = newData ? Object.values(newData).reduce((sum, count) => sum + count, 0) : 0

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="h-8 w-8" />
          移行ステータス確認
        </h1>
        <p className="text-gray-600">データ移行の結果を確認し、アプリケーションの動作をテストします</p>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* 新しいプロジェクトのデータ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              新しいプロジェクト
            </CardTitle>
            <CardDescription>移行後のデータ数</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>確認中...</span>
              </div>
            ) : newData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>顧客データ</span>
                  <span className="font-bold">{newData.customers}件</span>
                </div>
                <div className="flex justify-between">
                  <span>施術データ</span>
                  <span className="font-bold">{newData.treatments}件</span>
                </div>
                <div className="flex justify-between">
                  <span>カウンセリングデータ</span>
                  <span className="font-bold">{newData.counseling_data}件</span>
                </div>
                <div className="flex justify-between">
                  <span>スタッフデータ</span>
                  <span className="font-bold">{newData.staff}件</span>
                </div>
                <div className="flex justify-between">
                  <span>メニューデータ</span>
                  <span className="font-bold">{newData.menus}件</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>合計</span>
                  <span>{totalNew}件</span>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* 移行ステータス */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              移行ステータス
            </CardTitle>
            <CardDescription>データ移行の完了状況</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newData && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>移行完了！</strong>
                    <br />
                    {totalNew}件のデータが正常に移行されました。
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">次のステップ:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>環境変数を新しいプロジェクトに更新</li>
                  <li>アプリケーションの動作確認</li>
                  <li>古いプロジェクトの削除（任意）</li>
                </ol>
              </div>

              <Button onClick={checkDataCounts} disabled={loading} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                データ数を再確認
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 環境変数更新の案内 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>環境変数の更新</CardTitle>
          <CardDescription>アプリケーションの接続先を新しいプロジェクトに変更してください</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium mb-2">更新が必要な環境変数:</h4>
              <div className="space-y-1 text-sm font-mono">
                <div>NEXT_PUBLIC_SUPABASE_URL=新しいプロジェクトのURL</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=新しいプロジェクトのAPIキー</div>
                <div>SUPABASE_SERVICE_ROLE_KEY=新しいプロジェクトのサービスロールキー</div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>環境変数を更新後、アプリケーションを再起動してください。</AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

