import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, LogIn } from "lucide-react"

export default function LogoutCompletePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">ログアウト完了</CardTitle>
          <CardDescription>
            正常にログアウトしました。
            <br />
            ご利用ありがとうございました。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              再度ログイン
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

