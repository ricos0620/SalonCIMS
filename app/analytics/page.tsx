"use client"

import { useState, Suspense, lazy } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { DateRangeInput } from "@/components/date-range-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

// チャートコンポーネントを遅延読み込み
const LazyCharts = lazy(() => import("@/components/analytics/charts"))

// サンプルデータ
const salesData = [
  { name: "1月", amount: 420000 },
  { name: "2月", amount: 380000 },
  { name: "3月", amount: 450000 },
  { name: "4月", amount: 520000 },
  { name: "5月", amount: 490000 },
  { name: "6月", amount: 580000 },
]

const menuData = [
  { name: "カット", value: 35 },
  { name: "カラー", value: 25 },
  { name: "パーマ", value: 20 },
  { name: "トリートメント", value: 15 },
  { name: "ヘッドスパ", value: 5 },
]

const customerData = [
  { name: "新規", value: 120 },
  { name: "リピーター", value: 350 },
]

function ChartSkeleton() {
  return (
    <div className="h-[400px] w-full">
      <Skeleton className="h-full w-full" />
    </div>
  )
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("sales")
  const [dateRange, setDateRange] = useState({ from: new Date(2023, 0, 1), to: new Date() })
  const [chartType, setChartType] = useState("monthly")

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="分析・レポート" description="売上や顧客データの分析" />

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start">
        <DateRangeInput value={dateRange} onChange={setDateRange} className="w-full md:w-auto" />
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="表示期間" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">日次</SelectItem>
            <SelectItem value="weekly">週次</SelectItem>
            <SelectItem value="monthly">月次</SelectItem>
            <SelectItem value="yearly">年次</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 h-auto">
          <TabsTrigger value="sales">売上分析</TabsTrigger>
          <TabsTrigger value="menu">メニュー分析</TabsTrigger>
          <TabsTrigger value="customer">顧客分析</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>売上推移</CardTitle>
              <CardDescription>期間ごとの売上金額の推移</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <LazyCharts type="bar" data={salesData} />
              </Suspense>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">総売上</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">¥6,460,000</p>
                <p className="text-sm text-green-600">前年比 +12.5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">平均客単価</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">¥8,500</p>
                <p className="text-sm text-green-600">前年比 +5.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">来店数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">760</p>
                <p className="text-sm text-green-600">前年比 +8.3%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>メニュー別売上比率</CardTitle>
              <CardDescription>メニューごとの売上構成比</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <LazyCharts type="pie" data={menuData} />
              </Suspense>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>人気メニューランキング</CardTitle>
                <CardDescription>予約数の多いメニュー</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuData
                    .sort((a, b) => b.value - a.value)
                    .map((menu, index) => (
                      <div key={menu.name} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-bold mr-2">{index + 1}.</span>
                          <span>{menu.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{menu.value}%</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>売上貢献メニュー</CardTitle>
                <CardDescription>売上金額の大きいメニュー</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-bold mr-2">1.</span>
                      <span>パーマ</span>
                    </div>
                    <span className="text-sm text-muted-foreground">¥1,440,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-bold mr-2">2.</span>
                      <span>カラー</span>
                    </div>
                    <span className="text-sm text-muted-foreground">¥1,250,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-bold mr-2">3.</span>
                      <span>カット</span>
                    </div>
                    <span className="text-sm text-muted-foreground">¥1,050,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>顧客構成</CardTitle>
                <CardDescription>新規・リピーター比率</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ChartSkeleton />}>
                  <LazyCharts type="customer-pie" data={customerData} />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>顧客統計</CardTitle>
                <CardDescription>顧客データの概要</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>総顧客数</span>
                    <span className="font-bold">470人</span>
                  </div>
                  <div className="flex justify-between">
                    <span>新規顧客（今月）</span>
                    <span className="font-bold">28人</span>
                  </div>
                  <div className="flex justify-between">
                    <span>リピート率</span>
                    <span className="font-bold">74.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平均来店頻度</span>
                    <span className="font-bold">45日</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

