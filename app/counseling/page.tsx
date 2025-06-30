import { PageHeader } from "@/components/page-header"
import { StandaloneCounselingForm } from "@/components/counseling/standalone-counseling-form"

export default function CounselingPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="カウンセリングシート"
        description="お客様の詳細なご要望をお聞かせください。既存のお客様は電話番号で自動的に情報が更新されます。"
      />

      <StandaloneCounselingForm />
    </div>
  )
}

