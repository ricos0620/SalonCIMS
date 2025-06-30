import { Card, CardContent } from "@/components/ui/card"

export function CustomerSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:p-6 flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-36 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 md:p-6 flex md:flex-col justify-end items-center gap-3">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TreatmentSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:p-6 flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-44 bg-gray-200 rounded"></div>
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
              <div className="h-4 w-36 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 md:p-6 flex md:flex-col justify-end items-center gap-3">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

