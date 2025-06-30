import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-2 mb-8">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start">
        <Skeleton className="h-10 w-full md:w-[300px]" />
        <Skeleton className="h-10 w-full md:w-[180px]" />
      </div>

      <Skeleton className="h-10 w-full mb-4" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-[120px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[100px]" />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

