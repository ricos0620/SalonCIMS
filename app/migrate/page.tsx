import { DataMigration } from "@/components/data-migration"

export default function MigratePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">データ移行</h1>
        <p className="text-muted-foreground mt-2">ローカルストレージからSupabaseへデータを移行します</p>
      </div>
      <DataMigration />
    </div>
  )
}

