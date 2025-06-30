export interface Treatment {
  id: string
  customerId: string
  date: string
  type: string
  description: string
  products?: string[]
  stylist: string
  price: number
  notes?: string
  images?: string[]
}

