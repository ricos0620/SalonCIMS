"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Download, Upload, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function DataMigration() {
  const [status, setStatus] = useState<"idle" | "exporting" | "importing" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [exportedData, setExportedData] = useState<any>(null)

  const exportLocalData = () => {
    setStatus("exporting")
    setProgress(0)
    setMessage("ローカルストレージからデータを取得中...")

    try {
      // ローカルストレージからデータを取得
      const data: Record<string, any> = {}
      const keys = [
        "salon_branches",
        "staff_members",
        "treatment_menus",
        "membership_ranks",
        "counseling_items",
        "custom_counseling_items",
      ]

      let completedItems = 0
      keys.forEach((key) => {
        const item = localStorage.getItem(key)
        if (item) {
          try {
            data[key] = JSON.parse(item)
          } catch (e) {
            data[key] = item
          }
        } else {
          data[key] = null
        }

        completedItems++
        setProgress(Math.floor((completedItems / keys.length) * 100))
      })

      setExportedData(data)
      setStatus("success")
      setMessage("データのエクスポートが完了しました。Supabaseにインポートするか、JSONとしてダウンロードできます。")
    } catch (error) {
      console.error("データエクスポートエラー:", error)
      setStatus("error")
      setMessage("データのエクスポート中にエラーが発生しました。")
    }
  }

  const importToSupabase = async () => {
    if (!exportedData) return

    setStatus("importing")
    setProgress(0)
    setMessage("Supabaseにデータをインポート中...")

    try {
      // 各データ型をSupabaseにインポート
      const totalOperations = Object.keys(exportedData).filter((key) => exportedData[key] !== null).length
      let completedOperations = 0

      // 店舗データのインポート
      if (exportedData.salon_branches) {
        const { error } = await supabase.from("salon_branches").upsert(exportedData.salon_branches)
        if (error) throw error
        completedOperations++
        setProgress(Math.floor((completedOperations / totalOperations) * 100))
      }

      // スタッフデータのインポート
      if (exportedData.staff_members) {
        const { error } = await supabase.from("staff_members").upsert(exportedData.staff_members)
        if (error) throw error
        completedOperations++
        setProgress(Math.floor((completedOperations / totalOperations) * 100))
      }

      // メニューデータのインポート
      if (exportedData.treatment_menus) {
        const { error } = await supabase.from("treatment_menus").upsert(exportedData.treatment_menus)
        if (error) throw error
        completedOperations++
        setProgress(Math.floor((completedOperations / totalOperations) * 100))
      }

      // 会員ランクデータのインポート
      if (exportedData.membership_ranks) {
        const { error } = await supabase.from("membership_ranks").upsert(exportedData.membership_ranks)
        if (error) throw error
        completedOperations++
        setProgress(Math.floor((completedOperations / totalOperations) * 100))
      }

      // カウンセリング項目データのインポート
      if (exportedData.counseling_items) {
        const { error } = await supabase.from("counseling_items").upsert(exportedData.counseling_items)
        if (error) throw error
        completedOperations++
        setProgress(Math.floor((completedOperations / totalOperations) * 100))
      }

      // カスタムカウンセリング項目データのインポート
      if (exportedData.custom_counseling_items) {
        const { error } = await supabase.from("custom_counseling_items").upsert(exportedData.custom_counseling_items)
        if (error) throw error
        completedOperations++
        setProgress(Math.floor((completedOperations / totalOperations) * 100))
      }

      setStatus("success")
      setMessage("データのインポートが完了しました。")
    } catch (error) {
      console.error("データインポートエラー:", error)
      setStatus("error")
      setMessage("データのインポート中にエラーが発生しました。")
    }
  }

  const downloadJson = () => {
    if (!exportedData) return

    const dataStr = JSON.stringify(exportedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `salon-data-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearLocalStorage = () => {
    if (window.confirm("ローカルストレージのデータをすべて削除しますか？この操作は元に戻せません。")) {
      const keys = [
        "salon_branches",
        "staff_members",
        "treatment_menus",
        "membership_ranks",
        "counseling_items",
        "custom_counseling_items",
      ]

      keys.forEach((key) => {
        localStorage.removeItem(key)
      })

      setMessage("ローカルストレージのデータを削除しました。")
      setStatus("idle")
      setExportedData(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>データ移行ツール</CardTitle>
          <CardDescription>ローカルストレージのデータをSupabaseに移行します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "idle" && (
            <div className="text-center py-8">
              <p className="mb-6 text-muted-foreground">
                このツールを使用して、ブラウザのローカルストレージに保存されているデータをSupabaseデータベースに移行できます。
              </p>
              <Button onClick={exportLocalData} className="mx-auto">
                <Download className="mr-2 h-4 w-4" />
                ローカルデータをエクスポート
              </Button>
            </div>
          )}

          {(status === "exporting" || status === "importing") && (
            <div className="space-y-4 py-4">
              <p className="text-center text-muted-foreground">{message}</p>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {status === "success" && exportedData && (
            <div className="space-y-4">
              <Alert variant="success" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>成功</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>

              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2">エクスポートされたデータの概要:</h3>
                <ul className="space-y-1 text-sm">
                  {Object.keys(exportedData).map((key) => (
                    <li key={key} className="flex items-center justify-between">
                      <span>{key}:</span>
                      <span className="font-mono">
                        {exportedData[key]
                          ? Array.isArray(exportedData[key])
                            ? `${exportedData[key].length}件`
                            : "データあり"
                          : "なし"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          {status === "success" && exportedData && (
            <>
              <Button onClick={importToSupabase} className="w-full sm:w-auto">
                <Upload className="mr-2 h-4 w-4" />
                Supabaseにインポート
              </Button>
              <Button variant="outline" onClick={downloadJson} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                JSONとしてダウンロード
              </Button>
              <Button variant="destructive" onClick={clearLocalStorage} className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                ローカルデータを削除
              </Button>
            </>
          )}
          {status === "idle" && (
            <Button variant="destructive" onClick={clearLocalStorage} className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              ローカルデータを削除
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

