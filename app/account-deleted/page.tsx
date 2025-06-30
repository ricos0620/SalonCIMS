import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function AccountDeletedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">アカウント削除完了</CardTitle>
          <CardDescription>
            アカウントが正常に削除されました。
            <br />
            ご利用ありがとうございました。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            アカウントとすべての関連データが完全に削除されました。
          </p>
          <Button asChild className="w-full">
            <Link href="/">トップページに戻る</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

