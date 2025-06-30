import { ReactNode } from "react"

export default function CounselingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white px-4 py-6 md:px-8">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">カウンセリング</h1>
        <p className="text-gray-500 text-sm">お客様のご要望や状態を記録・確認するセクションです</p>
      </header>
      <main>{children}</main>
    </div>
  )
}

