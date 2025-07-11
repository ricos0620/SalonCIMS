﻿// 空のローディングコンポーネントを削除し、実際のローディング表示に変更

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-24">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

