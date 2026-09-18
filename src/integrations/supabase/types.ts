export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ad_spend: {
        Row: {
          agency_id: string | null
          amount: number
          created_at: string
          id: string
          notes: string | null
          source: string
          spend_date: string
        }
        Insert: {
          agency_id?: string | null
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          source?: string
          spend_date: string
        }
        Update: {
          agency_id?: string | null
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          source?: string
          spend_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_spend_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agencies: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      agency_users: {
        Row: {
          agency_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_users_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          agency_id: string | null
          created_at: string
          duration_minutes: number
          id: string
          lead_id: string | null
          notes: string | null
          scheduled_at: string
          status: string
        }
        Insert: {
          agency_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string
        }
        Update: {
          agency_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_timeline: {
        Row: {
          created_at: string
          done: boolean | null
          event_date: string | null
          id: string
          label: string
          lead_id: string | null
        }
        Insert: {
          created_at?: string
          done?: boolean | null
          event_date?: string | null
          id?: string
          label: string
          lead_id?: string | null
        }
        Update: {
          created_at?: string
          done?: boolean | null
          event_date?: string | null
          id?: string
          label?: string
          lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_timeline_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agency_id: string | null
          ai_summary: string | null
          bedrooms: number | null
          budget: number | null
          budget_label: string | null
          closed_at: string | null
          closed_result: string | null
          created_at: string
          email: string | null
          id: string
          location: string | null
          matches: string[] | null
          move_in: string | null
          name: string
          phone: string | null
          project: string | null
          property_type: string | null
          sale_amount: number | null
          score: number | null
          source: string | null
          stage: string | null
          status: string | null
        }
        Insert: {
          agency_id?: string | null
          ai_summary?: string | null
          bedrooms?: number | null
          budget?: number | null
          budget_label?: string | null
          closed_at?: string | null
          closed_result?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          matches?: string[] | null
          move_in?: string | null
          name: string
          phone?: string | null
          project?: string | null
          property_type?: string | null
          sale_amount?: number | null
          score?: number | null
          source?: string | null
          stage?: string | null
          status?: string | null
        }
        Update: {
          agency_id?: string | null
          ai_summary?: string | null
          bedrooms?: number | null
          budget?: number | null
          budget_label?: string | null
          closed_at?: string | null
          closed_result?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          matches?: string[] | null
          move_in?: string | null
          name?: string
          phone?: string | null
          project?: string | null
          property_type?: string | null
          sale_amount?: number | null
          score?: number | null
          source?: string | null
          stage?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string | null
          agency_id: string | null
          available: boolean | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          features: string[] | null
          gallery: string[] | null
          highlights: string[] | null
          id: string
          image_url: string | null
          location: string
          name: string
          price: number
          surface: number | null
          transaction: string
          type: string
        }
        Insert: {
          address?: string | null
          agency_id?: string | null
          available?: boolean | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          gallery?: string[] | null
          highlights?: string[] | null
          id: string
          image_url?: string | null
          location: string
          name: string
          price: number
          surface?: number | null
          transaction: string
          type: string
        }
        Update: {
          address?: string | null
          agency_id?: string | null
          available?: boolean | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          gallery?: string[] | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          price?: number
          surface?: number | null
          transaction?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_novarys_admin: { Args: never; Returns: boolean }
      user_agency_ids: { Args: never; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
