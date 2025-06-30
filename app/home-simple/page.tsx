// import { CustomerList } from "@/components/customer-list"
// import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">美容室顧客管理システム</h1>
          <p className="text-muted-foreground mt-2">効率的な顧客管理でサロン運営をサポート</p>
        </div>
        {/* <CustomerList /> */}
      </main>
    </div>
  )
}
