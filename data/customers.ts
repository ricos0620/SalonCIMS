import type { Customer } from "@/types/customer"

// ローカルストレージからデータを取得する関数
function getCustomersFromStorage(): Customer[] {
  if (typeof window === "undefined") {
    return defaultCustomers
  }

  try {
    const storedCustomers = localStorage.getItem("salon_customers")
    if (storedCustomers) {
      return JSON.parse(storedCustomers)
    }
  } catch (error) {
    console.error("顧客データの取得に失敗しました:", error)
  }

  // ローカルストレージにデータがない場合はデフォルトデータを保存
  localStorage.setItem("salon_customers", JSON.stringify(defaultCustomers))
  return defaultCustomers
}

// デフォルトの顧客データ
const defaultCustomers: Customer[] = [
  {
    id: "1",
    nameKanji: "佐藤 美咲",
    nameKana: "さとう みさき",
    gender: "女性",
    membershipNumber: "A10001",
    membershipRank: "ゴールド",
    phoneNumber: "090-1234-5678",
    phoneNumber2: "03-1234-5678",
    email: "misaki.sato@example.com",
    postalCode: "150-0043",
    address: "東京都新宿区西新宿1-1-1",
    lastVisit: "2023-12-15",
    birthdate: "1990-05-12",
    occupation: "会社員",
    notes: "ロングヘアが好み。カラーは明るめを希望。",
    hairThickness: "普通",
    hairCurliness: "直毛",
    hairDamage: "毛先もしくは部分的に少しある",
    allergies: "なし",
  },
  {
    id: "2",
    nameKanji: "田中 健太",
    nameKana: "たなか けんた",
    gender: "男性",
    membershipNumber: "A10002",
    membershipRank: "シルバー",
    phoneNumber: "080-9876-5432",
    email: "kenta.tanaka@example.com",
    postalCode: "150-0041",
    address: "東京都渋谷区神南1-2-3",
    lastVisit: "2024-01-20",
    birthdate: "1985-11-23",
    occupation: "会社役員",
    notes: "ビジネスマン向けのスタイルを希望。",
    hairThickness: "細め",
    hairCurliness: "くせあり",
    hairDamage: "なし",
    allergies: "ヘアカラー剤（PPD）",
  },
  {
    id: "3",
    nameKanji: "鈴木 花子",
    nameKana: "すずき はなこ",
    gender: "女性",
    membershipNumber: "A10003",
    membershipRank: "プラチナ",
    phoneNumber: "070-1122-3344",
    phoneNumber2: "03-3456-7890",
    email: "hanako.suzuki@example.com",
    postalCode: "153-0051",
    address: "東京都目黒区中目黒2-4-5",
    lastVisit: "2024-02-05",
    birthdate: "1995-07-30",
    occupation: "デザイナー",
    notes: "トリートメントを定期的に受けている。",
    hairThickness: "太め",
    hairCurliness: "弱め",
    hairDamage: "中間～毛先まである",
    allergies: "なし",
  },
]

// 顧客データを保存する関数
export function saveCustomers(customers: Customer[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("salon_customers", JSON.stringify(customers))
  } catch (error) {
    console.error("顧客データの保存に失敗しました:", error)
  }
}

// 顧客データを取得
export let customers = typeof window !== "undefined" ? getCustomersFromStorage() : defaultCustomers

// 顧客データを更新する関数
export function updateCustomer(updatedCustomer: Customer): void {
  const updatedCustomers = customers.map((customer) =>
    customer.id === updatedCustomer.id ? updatedCustomer : customer,
  )

  // 既存の顧客が見つからない場合は新規追加
  if (!updatedCustomers.some((customer) => customer.id === updatedCustomer.id)) {
    updatedCustomers.push(updatedCustomer)
  }

  // 更新されたデータを保存
  customers = updatedCustomers
  saveCustomers(updatedCustomers)
}

// 新規顧客を追加する関数
export function addCustomer(newCustomer: Customer): void {
  const updatedCustomers = [...customers, newCustomer]
  customers = updatedCustomers
  saveCustomers(updatedCustomers)
}

// 顧客を削除する関数を追加
export function deleteCustomer(customerId: string): void {
  const updatedCustomers = customers.filter((customer) => customer.id !== customerId)
  customers = updatedCustomers
  saveCustomers(updatedCustomers)
}

export function searchCustomers(query: string): Customer[] {
  const lowerCaseQuery = query.toLowerCase()
  return customers.filter(
    (customer) =>
      customer.nameKanji.toLowerCase().startsWith(lowerCaseQuery) ||
      customer.nameKana.toLowerCase().startsWith(lowerCaseQuery) ||
      customer.phoneNumber.startsWith(query),
  )
}

