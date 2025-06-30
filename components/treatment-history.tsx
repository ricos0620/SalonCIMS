"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, User } from "lucide-react"
import type { Treatment } from "@/types/treatment"

interface TreatmentHistoryProps {
  treatments: Treatment[]
}

export function TreatmentHistory({ treatments }: TreatmentHistoryProps) {
  if (treatments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">施術履歴がありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {treatments.map((treatment) => (
        <Card key={treatment.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{treatment.type}</CardTitle>
              <Badge variant="outline">{treatment.date}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {treatment.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              担当: {treatment.stylist}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              料金: ¥{treatment.price.toLocaleString()}
            </div>
            {treatment.description && (
              <div>
                <p className="text-sm font-medium">施術内容</p>
                <p className="text-sm text-muted-foreground">{treatment.description}</p>
              </div>
            )}
            {treatment.products && treatment.products.length > 0 && (
              <div>
                <p className="text-sm font-medium">使用薬剤・商品</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {treatment.products.map((product, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {treatment.notes && (
              <div>
                <p className="text-sm font-medium">備考</p>
                <p className="text-sm text-muted-foreground">{treatment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

