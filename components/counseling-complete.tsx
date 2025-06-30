"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, RotateCcw } from "lucide-react"
import Link from "next/link"

interface CounselingCompleteProps {
  customerData: any
  onRestart: () => void
}

export function CounselingComplete({ customerData, onRestart }: CounselingCompleteProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">カウンセリングシート送信完了</CardTitle>
          <CardDescription>
            {customerData?.nameKanji}様、ご記入ありがとうございました。お客様の情報を正常に保存いたしました。<br />
            この端末をスタッフにお渡しください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">ご記入いただいた情報</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">お名前:</span> {customerData?.nameKanji} ({customerData?.nameKana})
              </div>
              <div>
                <span className="font-medium">電話番号:</span> {customerData?.phoneNumber}
              </div>
              {customerData?.email && (
                <div>
                  <span className="font-medium">メールアドレス:</span> {customerData?.email}
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-900">次のステップ</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• スタッフがカウンセリング内容を確認いたします</li>
              <li>• ご来店時に詳細なご相談をさせていただきます</li>
              <li>• お客様に最適な施術プランをご提案いたします</li>
            </ul>
          </div>

          {/* ★ここに文言を追加★ */}
          <p className="text-sm text-muted-foreground mb-4">
            ご入力いただいた情報は、お客様に最適な施術をご提供するために活用させていただきます。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                ホームに戻る
              </Link>
            </Button>
            <Button variant="outline" onClick={onRestart} className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              新しいカウンセリングを開始
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
