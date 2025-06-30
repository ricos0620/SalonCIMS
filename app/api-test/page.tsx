"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 有効なデータ
  const validData = {
    nameKanji: "山田 花子",
    nameKana: "やまだ はなこ",
    phoneNumber: "090-1234-5678",
    gender: "女性",
    postalCode: "123-4567",
    address: "東京都渋谷区",
    howDidYouFindUs: ["website", "instagram"],
    allergies: "なし",
  }

  // 無効なデータ（必須フィールドが欠けている）
  const invalidData = {
    nameKanji: "",
    nameKana: "やまだ はなこ",
    phoneNumber: "",
    gender: "女性",
  }

  const testValidData = async () => {
    setLoading(true)
    setError(null)
    setResult(null) // 結果をリセット

    // プレビュー環境ではAPIを呼び出さずにモックレスポンスを返す
    setTimeout(() => {
      // 有効なデータの場合の成功レスポンス
      const mockResponse = {
        success: true,
        message: "カウンセリングデータが保存されました",
        customer: {
          id: `mock-${Date.now()}`,
          ...validData,
          lastVisit: new Date().toISOString().split("T")[0],
          counselingData: {
            date: new Date().toISOString().split("T")[0],
            howDidYouFindUs: validData.howDidYouFindUs,
            allergies: validData.allergies,
          },
        },
      }

      setResult(mockResponse)
      setLoading(false)
    }, 1000)

    /* 実際の環境では以下のコードを使用
    try {
      const response = await fetch("/api/customers/counseling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          setResult(errorJson);
          setError(`エラー (${response.status}): ${errorJson.message || "不明なエラー"}`);
        } catch (e) {
          setError(`エラー (${response.status}): ${errorText}`);
        }
        return;
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
    */
  }

  const testInvalidData = async () => {
    setLoading(true)
    setError(null)
    setResult(null) // 結果をリセット

    // プレビュー環境ではAPIを呼び出さずにモックエラーレスポンスを返す
    setTimeout(() => {
      // 無効なデータの場合のエラーレスポンス
      const mockErrorResponse = {
        success: false,
        message: "必須項目が入力されていません",
        errors: "氏名（漢字）、電話番号は必須です",
      }

      setResult(mockErrorResponse)
      setError(`エラー (400): ${mockErrorResponse.message}`)
      setLoading(false)
    }, 1000)

    /* 実際の環境では以下のコードを使用
    try {
      const response = await fetch("/api/customers/counseling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          setResult(errorJson);
          setError(`エラー (${response.status}): ${errorJson.message || "不明なエラー"}`);
        } catch (e) {
          setError(`エラー (${response.status}): ${errorText}`);
        }
        return;
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
    */
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>APIテスト（プレビュー用モック）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex space-x-4">
            <Button onClick={testValidData} disabled={loading}>
              有効なデータをテスト
            </Button>
            <Button onClick={testInvalidData} disabled={loading} variant="outline">
              無効なデータをテスト
            </Button>
          </div>

          {loading && <div>読み込み中...</div>}

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-md">
              <h3 className="font-bold">エラー</h3>
              <p>{error}</p>
              <p className="text-sm mt-2">
                注: これはプレビュー環境用のモックエラーです。実際の環境では実際のAPIレスポンスが表示されます。
              </p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-bold mb-2">結果:</h3>
              <pre className="whitespace-pre-wrap overflow-auto max-h-96">{JSON.stringify(result, null, 2)}</pre>
              {!error && result.success && (
                <p className="text-sm mt-2 text-green-600">
                  ✓ 成功:
                  これはプレビュー環境用のモックレスポンスです。実際の環境では実際のAPIレスポンスが表示されます。
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

