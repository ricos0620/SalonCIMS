export interface CounselingData {
  date: string
  howDidYouFindUs?: string[]
  whyChooseUs?: string[]
  allergies?: string
  lastVisit?: string
  preferredFinishTime?: {
    hasPreference: boolean
    time?: string
  }
  shampooStrength?: string
  drinkService?: string
  conversationPreference?: string
  stylingTools?: string
  hairConcerns?: string[]
  productRecommendation?: string
  otherMenuInterest?: string
  additionalNotes?: string
}

export interface Customer {
  id: string
  nameKanji: string
  nameKana: string
  gender?: string
  membershipNumber?: string
  membershipRank?: string
  /** 追加ここから */
  membershipColor?: string
  membershipDiscountRate?: number
  /** 追加ここまで */
  phoneNumber: string
  phoneNumber2?: string
  email: string
  postalCode?: string
  address?: string
  lastVisit: string
  birthdate?: string
  occupation?: string
  notes?: string
  hairThickness?: string
  hairCurliness?: string
  hairDamage?: string
  allergies?: string
  counselingData?: CounselingData
}
