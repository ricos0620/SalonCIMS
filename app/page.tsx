"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Settings, BarChart3, Scissors, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// プライバシーポリシーモーダル部分（必要な分だけ抽出）
function PrivacyPolicyModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>プライバシーポリシー</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="space-y-4 text-sm text-gray-700 max-h-[70vh] overflow-y-auto">
            <p>本システム（以下、「当システム」といいます）は、お客様の個人情報の重要性を認識し、その保護の徹底を図るため、以下のとおりプライバシーポリシーを定めます。</p>
            <h4 className="font-semibold mt-4">1. 取得する個人情報について</h4>
            <ul className="list-disc pl-5">
              <li>氏名</li>
              <li>電話番号</li>
              <li>メールアドレス</li>
              <li>住所</li>
              <li>生年月日</li>
              <li>性別</li>
              <li>来店履歴・施術履歴</li>
              <li>カウンセリング情報</li>
              <li>その他、ご利用・ご相談に関する情報</li>
            </ul>
            <h4 className="font-semibold mt-4">2. 利用目的</h4>
            <p>
              取得した個人情報は、以下の目的の範囲で利用いたします。
              <br />
              ・サロンでの適切なサービス提供
              <br />
              ・予約管理・顧客管理・履歴管理
              <br />
              ・施術やカウンセリングの内容確認・記録
              <br />
              ・ご案内や連絡、必要に応じたお問い合わせ対応
              <br />
              ・サービス向上のための分析・統計処理（個人を特定できない形式で）
            </p>
            <h4 className="font-semibold mt-4">3. 個人情報の管理</h4>
            <p>
              当システムは、個人情報への不正アクセス・紛失・漏えい・改ざん等を防止するため、適切な安全管理措置を講じます。
            </p>
            <h4 className="font-semibold mt-4">4. 個人情報の第三者提供について</h4>
            <p>
              取得した個人情報は、以下の場合を除き、第三者に提供することはありません。
              <br />
              ・本人の同意がある場合
              <br />
              ・法令等に基づく場合
              <br />
              ・生命・身体・財産の保護のため緊急に必要な場合
            </p>
            <h4 className="font-semibold mt-4">5. 個人情報の開示・訂正・削除等</h4>
            <p>
              ご本人からご自身の個人情報について開示・訂正・削除等のご希望があった場合、所定の手続きにより速やかに対応いたします。
            </p>
            <h4 className="font-semibold mt-4">6. プライバシーポリシーの改定</h4>
            <p>
              本プライバシーポリシーは、法令等の変更やサービス内容の見直し等により、必要に応じて改定することがあります。
            </p>
            <h4 className="font-semibold mt-4">7. お問い合わせ窓口</h4>
            <p>
              個人情報の取扱いに関するご相談・ご質問は、下記までご連絡ください。
              <br />
              【お問い合わせ先】SalonCIMS運営事務局
              <br />
              （※実際の連絡先・担当者名等をご記入ください）
            </p>
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function HomePage() {
  const [user, setUser] = useState<any | null>(null)
  const [showPrivacy, setShowPrivacy] = useState(false) // ← 追加

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error("ユーザー取得エラー:", error)
      } else {
        setUser(user)
      }
    }

    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* ヒーローセクション */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">美容室顧客管理システム</h1>
          <p className="text-xl text-gray-600 mb-8">
            顧客管理からカウンセリングまで、サロン運営を効率化する総合管理システム
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="px-12 py-6 text-xl">
              <Link href="/counseling">カウンセリング開始</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 主要機能セクション */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">主要機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 顧客管理 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  顧客管理
                </CardTitle>
                <CardDescription>お客様情報・履歴管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  顧客情報や来店履歴、会員ランク、各種連絡先を一元管理。検索・フィルタ・編集も簡単。
                </p>
                <Button asChild className="w-full">
                  <Link href="/customers">顧客管理を始める</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 施術管理 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-purple-600" />
                  施術管理
                </CardTitle>
                <CardDescription>施術履歴・記録管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  施術内容、使用薬剤、担当者、料金を詳細に記録。ビフォーアフター画像も管理。
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/treatments">施術履歴</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 分析・レポート */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  分析・レポート
                </CardTitle>
                <CardDescription>売上・顧客分析</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  売上推移、顧客動向、人気メニューなどを視覚的に分析。経営判断をサポート。
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/analytics">分析画面</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 設定管理 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  設定管理
                </CardTitle>
                <CardDescription>システム設定・スタッフ管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  スタッフ権限管理、システム設定、カウンセリング項目のカスタマイズ。
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/settings">管理画面</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- ↓↓↓ プライバシーポリシーボタン・モーダル部分 ↓↓↓ --- */}
      <footer className="w-full py-8 mt-16 border-t text-center text-sm text-gray-500 bg-white">
        <Button
          variant="outline"
          onClick={() => setShowPrivacy(true)}
          className="inline-block rounded-xl border px-6 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition"
        >
          プライバシーポリシーを表示
        </Button>
        <PrivacyPolicyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
      </footer>
      {/* --- ↑↑↑ ここまで ↑↑↑ --- */}
    </div>
  )
}
