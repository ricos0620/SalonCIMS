"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Database, ArrowRight } from "lucide-react"

interface MigrationConfig {
  oldProjectUrl: string
  oldProjectKey: string
  newProjectUrl: string
  newProjectKey: string
}

interface MigrationStep {
  name: string
  status: "pending" | "running" | "completed" | "error"
  message?: string
}

export default function DataMigrationTool() {
  const [config, setConfig] = useState<MigrationConfig>({
    oldProjectUrl: "",
    oldProjectKey: "",
    newProjectUrl: "",
    newProjectKey: "",
  })

  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [steps, setSteps] = useState<MigrationStep[]>([
    { name: "古いプロジェクトからデータ取得", status: "pending" },
    { name: "顧客データの移行", status: "pending" },
    { name: "施術データの移行", status: "pending" },
    { name: "カウンセリングデータの移行", status: "pending" },
    { name: "スタッフデータの移行", status: "pending" },
    { name: "メニューデータの移行", status: "pending" },
    { name: "データ整合性の確認", status: "pending" },
  ])

  const updateStep = (index: number, status: MigrationStep["status"], message?: string) => {
    setSteps((prev) => prev.map((step, i) => (i === index ? { ...step, status, message } : step)))
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const migrateData = async () => {
    setIsRunning(true)
    setProgress(0)

    try {
      // 古いプロジェクトのクライアント作成
      const { import { supabase } from "@/lib/supabase"
 } = await import("@supabase/supabase-js")
      const oldSupabase = import { supabase } from "@/lib/supabase"
(config.oldProjectUrl, config.oldProjectKey)
      const newSupabase = import { supabase } from "@/lib/supabase"
(config.newProjectUrl, config.newProjectKey)

      // ステップ1: データ取得テスト
      updateStep(0, "running")
      const { data: testData, error: testError } = await oldSupabase.from("customers").select("count").single()

      if (testError) {
        updateStep(0, "error", "古いプロジェクトに接続できません")
        return
      }

      updateStep(0, "completed")
      setProgress(15)

      // ステップ2: 顧客データ移行
      updateStep(1, "running")
      const { data: customers, error: customersError } = await oldSupabase.from("customers").select("*")

      if (customersError) {
        updateStep(1, "error", customersError.message)
        return
      }

      if (customers && customers.length > 0) {
        const { error: insertError } = await newSupabase.from("customers").insert(customers)

        if (insertError) {
          updateStep(1, "error", insertError.message)
          return
        }
      }

      updateStep(1, "completed", `${customers?.length || 0}件の顧客データを移行`)
      setProgress(30)
      await sleep(500)

      // ステップ3: 施術データ移行
      updateStep(2, "running")
      const { data: treatments, error: treatmentsError } = await oldSupabase.from("treatments").select("*")

      if (treatmentsError) {
        updateStep(2, "error", treatmentsError.message)
        return
      }

      if (treatments && treatments.length > 0) {
        const { error: insertError } = await newSupabase.from("treatments").insert(treatments)

        if (insertError) {
          updateStep(2, "error", insertError.message)
          return
        }
      }

      updateStep(2, "completed", `${treatments?.length || 0}件の施術データを移行`)
      setProgress(45)
      await sleep(500)

      // ステップ4: カウンセリングデータ移行
      updateStep(3, "running")
      const { data: counseling, error: counselingError } = await oldSupabase.from("counseling_data").select("*")

      if (counselingError) {
        updateStep(3, "error", counselingError.message)
        return
      }

      if (counseling && counseling.length > 0) {
        const { error: insertError } = await newSupabase.from("counseling_data").insert(counseling)

        if (insertError) {
          updateStep(3, "error", insertError.message)
          return
        }
      }

      updateStep(3, "completed", `${counseling?.length || 0}件のカウンセリングデータを移行`)
      setProgress(60)
      await sleep(500)

      // ステップ5: スタッフデータ移行
      updateStep(4, "running")
      const { data: staff, error: staffError } = await oldSupabase.from("staff").select("*")

      if (staffError) {
        updateStep(4, "error", staffError.message)
        return
      }

      if (staff && staff.length > 0) {
        const { error: insertError } = await newSupabase.from("staff").insert(staff)

        if (insertError) {
          updateStep(4, "error", insertError.message)
          return
        }
      }

      updateStep(4, "completed", `${staff?.length || 0}件のスタッフデータを移行`)
      setProgress(75)
      await sleep(500)

      // ステップ6: メニューデータ移行
      updateStep(5, "running")
      const { data: menus, error: menusError } = await oldSupabase.from("menus").select("*")

      if (menusError) {
        updateStep(5, "error", menusError.message)
        return
      }

      if (menus && menus.length > 0) {
        const { error: insertError } = await newSupabase.from("menus").insert(menus)

        if (insertError) {
          updateStep(5, "error", insertError.message)
          return
        }
      }

      updateStep(5, "completed", `${menus?.length || 0}件のメニューデータを移行`)
      setProgress(90)
      await sleep(500)

      // ステップ7: データ整合性確認
      updateStep(6, "running")
      const { count: newCustomerCount } = await newSupabase
        .from("customers")
        .select("*", { count: "exact", head: true })

      const { count: newTreatmentCount } = await newSupabase
        .from("treatments")
        .select("*", { count: "exact", head: true })

      updateStep(6, "completed", `顧客: ${newCustomerCount}件, 施術: ${newTreatmentCount}件`)
      setProgress(100)
    } catch (error) {
      console.error("Migration error:", error)
      updateStep(
        steps.findIndex((s) => s.status === "running"),
        "error",
        "エラーが発生しました",
      )
    } finally {
      setIsRunning(false)
    }
  }

  const getStepIcon = (status: MigrationStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="h-8 w-8" />
          データ移行ツール
        </h1>
        <p className="text-gray-600">古いSupabaseプロジェクトから新しいプロジェクトにデータを安全に移行します</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 設定パネル */}
        <Card>
          <CardHeader>
            <CardTitle>プロジェクト設定</CardTitle>
            <CardDescription>古いプロジェクトと新しいプロジェクトの接続情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldUrl">古いプロジェクトURL</Label>
              <Input
                id="oldUrl"
                placeholder="https://xxx.supabase.co"
                value={config.oldProjectUrl}
                onChange={(e) => setConfig((prev) => ({ ...prev, oldProjectUrl: e.target.value }))}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldKey">古いプロジェクトAPIキー</Label>
              <Textarea
                id="oldKey"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={config.oldProjectKey}
                onChange={(e) => setConfig((prev) => ({ ...prev, oldProjectKey: e.target.value }))}
                disabled={isRunning}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newUrl">新しいプロジェクトURL</Label>
              <Input
                id="newUrl"
                placeholder="https://yyy.supabase.co"
                value={config.newProjectUrl}
                onChange={(e) => setConfig((prev) => ({ ...prev, newProjectUrl: e.target.value }))}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newKey">新しいプロジェクトAPIキー</Label>
              <Textarea
                id="newKey"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={config.newProjectKey}
                onChange={(e) => setConfig((prev) => ({ ...prev, newProjectKey: e.target.value }))}
                disabled={isRunning}
                rows={3}
              />
            </div>

            <Button
              onClick={migrateData}
              disabled={
                isRunning ||
                !config.oldProjectUrl ||
                !config.oldProjectKey ||
                !config.newProjectUrl ||
                !config.newProjectKey
              }
              className="w-full"
            >
              {isRunning ? "移行中..." : "データ移行を開始"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* 進捗パネル */}
        <Card>
          <CardHeader>
            <CardTitle>移行進捗</CardTitle>
            <CardDescription>データ移行の進捗状況をリアルタイムで確認できます</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>進捗</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.name}</div>
                    {step.message && (
                      <div className={`text-xs ${step.status === "error" ? "text-red-600" : "text-gray-600"}`}>
                        {step.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 注意事項 */}
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>重要:</strong> 移行前に新しいプロジェクトのテーブルが正しく作成されていることを確認してください。
          移行中はブラウザを閉じないでください。
        </AlertDescription>
      </Alert>
    </div>
  )
}

