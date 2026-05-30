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
      feedback: {
        Row: {
          author_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          subject_id: string
          transaction_id: string
        }
        Insert: {
          author_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          subject_id: string
          transaction_id: string
        }
        Update: {
          author_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          subject_id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          body_type: string | null
          created_at: string
          currency: string
          customizable: boolean
          customization_fee_cents: number
          description: string | null
          fabric: string | null
          id: string
          images: string[]
          is_premium: boolean
          price_cents: number
          region: string | null
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string
          view_count: number
          wear_duration: string | null
        }
        Insert: {
          body_type?: string | null
          created_at?: string
          currency?: string
          customizable?: boolean
          customization_fee_cents?: number
          description?: string | null
          fabric?: string | null
          id?: string
          images?: string[]
          is_premium?: boolean
          price_cents: number
          region?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string
          view_count?: number
          wear_duration?: string | null
        }
        Update: {
          body_type?: string | null
          created_at?: string
          currency?: string
          customizable?: boolean
          customization_fee_cents?: number
          description?: string | null
          fabric?: string | null
          id?: string
          images?: string[]
          is_premium?: boolean
          price_cents?: number
          region?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string
          view_count?: number
          wear_duration?: string | null
        }
        Relationships: []
      }
      premium_memberships: {
        Row: {
          active: boolean
          amount_cents: number
          created_at: string
          ends_at: string
          id: string
          starts_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          amount_cents: number
          created_at?: string
          ends_at: string
          id?: string
          starts_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          amount_cents?: number
          created_at?: string
          ends_at?: string
          id?: string
          starts_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_band: string | null
          avatar_url: string | null
          bio: string | null
          body_type: string | null
          country: string | null
          created_at: string
          display_name: string
          id: string
          premium_until: string | null
          updated_at: string
          verification: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          age_band?: string | null
          avatar_url?: string | null
          bio?: string | null
          body_type?: string | null
          country?: string | null
          created_at?: string
          display_name: string
          id: string
          premium_until?: string | null
          updated_at?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          age_band?: string | null
          avatar_url?: string | null
          bio?: string | null
          body_type?: string | null
          country?: string | null
          created_at?: string
          display_name?: string
          id?: string
          premium_until?: string | null
          updated_at?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_cents: number
          buyer_id: string
          created_at: string
          customization_notes: string | null
          delivered_at: string | null
          dispute_reason: string | null
          disputed_at: string | null
          fee_cents: number
          id: string
          listing_id: string
          release_due_at: string | null
          released_at: string | null
          seller_id: string
          shipped_at: string | null
          status: Database["public"]["Enums"]["tx_status"]
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          buyer_id: string
          created_at?: string
          customization_notes?: string | null
          delivered_at?: string | null
          dispute_reason?: string | null
          disputed_at?: string | null
          fee_cents?: number
          id?: string
          listing_id: string
          release_due_at?: string | null
          released_at?: string | null
          seller_id: string
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["tx_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          buyer_id?: string
          created_at?: string
          customization_notes?: string | null
          delivered_at?: string | null
          dispute_reason?: string | null
          disputed_at?: string | null
          fee_cents?: number
          id?: string
          listing_id?: string
          release_due_at?: string | null
          released_at?: string | null
          seller_id?: string
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["tx_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "seller" | "buyer"
      listing_status: "active" | "sold" | "withdrawn"
      tx_status:
        | "pending"
        | "paid"
        | "shipped"
        | "delivered"
        | "released"
        | "disputed"
        | "refunded"
      verification_status: "unverified" | "verified" | "verified_plus"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "seller", "buyer"],
      listing_status: ["active", "sold", "withdrawn"],
      tx_status: [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "released",
        "disputed",
        "refunded",
      ],
      verification_status: ["unverified", "verified", "verified_plus"],
    },
  },
} as const
