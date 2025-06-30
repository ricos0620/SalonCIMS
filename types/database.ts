export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name_kanji: string
          name_kana: string
          gender: string | null
          membership_number: string | null
          membership_rank: string | null
          phone_number: string
          phone_number2: string | null
          email: string | null
          postal_code: string | null
          address: string | null
          birthdate: string | null
          occupation: string | null
          notes: string | null
          hair_thickness: string | null
          hair_curliness: string | null
          hair_damage: string | null
          allergies: string | null
          last_visit: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_kanji: string
          name_kana: string
          gender?: string | null
          membership_number?: string | null
          membership_rank?: string | null
          phone_number: string
          phone_number2?: string | null
          email?: string | null
          postal_code?: string | null
          address?: string | null
          birthdate?: string | null
          occupation?: string | null
          notes?: string | null
          hair_thickness?: string | null
          hair_curliness?: string | null
          hair_damage?: string | null
          allergies?: string | null
          last_visit?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_kanji?: string
          name_kana?: string
          gender?: string | null
          membership_number?: string | null
          membership_rank?: string | null
          phone_number?: string
          phone_number2?: string | null
          email?: string | null
          postal_code?: string | null
          address?: string | null
          birthdate?: string | null
          occupation?: string | null
          notes?: string | null
          hair_thickness?: string | null
          hair_curliness?: string | null
          hair_damage?: string | null
          allergies?: string | null
          last_visit?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      treatments: {
        Row: {
          id: string
          customer_id: string
          date: string
          type: string
          description: string | null
          products: string[] | null
          stylist: string
          price: number
          notes: string | null
          images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          date: string
          type: string
          description?: string | null
          products?: string[] | null
          stylist: string
          price: number
          notes?: string | null
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          date?: string
          type?: string
          description?: string | null
          products?: string[] | null
          stylist?: string
          price?: number
          notes?: string | null
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      counseling_data: {
        Row: {
          id: string
          customer_id: string
          date: string
          how_did_you_find_us: string[] | null
          why_choose_us: string[] | null
          allergies: string | null
          last_visit: string | null
          preferred_finish_time: any | null
          shampoo_strength: string | null
          drink_service: string | null
          conversation_preference: string | null
          styling_tools: string | null
          hair_concerns: string[] | null
          product_recommendation: string | null
          other_menu_interest: string | null
          additional_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          date: string
          how_did_you_find_us?: string[] | null
          why_choose_us?: string[] | null
          allergies?: string | null
          last_visit?: string | null
          preferred_finish_time?: any | null
          shampoo_strength?: string | null
          drink_service?: string | null
          conversation_preference?: string | null
          styling_tools?: string | null
          hair_concerns?: string[] | null
          product_recommendation?: string | null
          other_menu_interest?: string | null
          additional_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          date?: string
          how_did_you_find_us?: string[] | null
          why_choose_us?: string[] | null
          allergies?: string | null
          last_visit?: string | null
          preferred_finish_time?: any | null
          shampoo_strength?: string | null
          drink_service?: string | null
          conversation_preference?: string | null
          styling_tools?: string | null
          hair_concerns?: string[] | null
          product_recommendation?: string | null
          other_menu_interest?: string | null
          additional_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

