import type React from "react"

export default function CreateTreatmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 施術作成ページ専用のレイアウト
  // ローディングUIやデータ取得は一切行わない
  return <>{children}</>
}

