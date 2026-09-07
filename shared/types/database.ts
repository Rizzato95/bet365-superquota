import type { Offer } from './offer'
import type { Database as GeneratedDatabase } from '../../supabase/database.types'

export type { Json } from '../../supabase/database.types'
// The generated schema uses strings for CHECK-constrained sport and outcome columns.
// Refine these fields with the same validated domain values used by the app.
export type Database = Omit<GeneratedDatabase, 'public'> & {
  public: Omit<GeneratedDatabase['public'], 'Tables'> & {
    Tables: Omit<GeneratedDatabase['public']['Tables'], 'offers'> & {
      offers: {
        Row: Offer
        Insert: Omit<Offer, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'source_key'> &
          Partial<Pick<Offer, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'source_key'>>
        Update: Partial<Offer>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
