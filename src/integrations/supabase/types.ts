export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      crawl_progress: {
        Row: {
          completed: boolean | null
          id: number
          last_updated: string | null
          page_number: number
          temple_index: number
        }
        Insert: {
          completed?: boolean | null
          id?: number
          last_updated?: string | null
          page_number: number
          temple_index: number
        }
        Update: {
          completed?: boolean | null
          id?: number
          last_updated?: string | null
          page_number?: number
          temple_index?: number
        }
        Relationships: []
      }
      temple_stay_details: {
        Row: {
          cost_adult: string | null
          created_at: string | null
          description: string | null
          id: number
          public_transportation: string | null
          temple_stay_id: number | null
        }
        Insert: {
          cost_adult?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          public_transportation?: string | null
          temple_stay_id?: number | null
        }
        Update: {
          cost_adult?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          public_transportation?: string | null
          temple_stay_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "temple_stay_details_temple_stay_id_fkey"
            columns: ["temple_stay_id"]
            isOneToOne: false
            referencedRelation: "temple_stays"
            referencedColumns: ["id"]
          },
        ]
      }
      temple_stays: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: number
          image_url: string | null
          name: string
          region: string | null
          reservation_link: string | null
          start_date: string | null
          temple_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          image_url?: string | null
          name: string
          region?: string | null
          reservation_link?: string | null
          start_date?: string | null
          temple_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          image_url?: string | null
          name?: string
          region?: string | null
          reservation_link?: string | null
          start_date?: string | null
          temple_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "temple_stays_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      temples: {
        Row: {
          address: string | null
          contact: string | null
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          name: string
          region: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          region?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          region?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      timelines: {
        Row: {
          content: string | null
          created_at: string | null
          day: number | null
          id: number
          temple_stay_id: number | null
          time: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          day?: number | null
          id?: number
          temple_stay_id?: number | null
          time?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          day?: number | null
          id?: number
          temple_stay_id?: number | null
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timelines_temple_stay_id_fkey"
            columns: ["temple_stay_id"]
            isOneToOne: false
            referencedRelation: "temple_stays"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
