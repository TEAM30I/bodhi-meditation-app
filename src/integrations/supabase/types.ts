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
          id: string
          last_updated: string | null
          page_number: number
          temple_index: number
        }
        Insert: {
          completed?: boolean | null
          id?: string
          last_updated?: string | null
          page_number: number
          temple_index: number
        }
        Update: {
          completed?: boolean | null
          id?: string
          last_updated?: string | null
          page_number?: number
          temple_index?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: string | null
          created_at: string | null
          entity_id: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          entity_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          entity_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reading_history: {
        Row: {
          id: string
          page_number: number
          read_at: string | null
          scripture_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          page_number: number
          read_at?: string | null
          scripture_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          page_number?: number
          read_at?: string | null
          scripture_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_history_scripture_id_fkey"
            columns: ["scripture_id"]
            isOneToOne: false
            referencedRelation: "scriptures"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_progress: {
        Row: {
          id: string
          last_chapter_id: string | null
          last_chapter_title: string | null
          last_page: number
          last_read_at: string | null
          progress: number | null
          scripture_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          last_chapter_id?: string | null
          last_chapter_title?: string | null
          last_page: number
          last_read_at?: string | null
          progress?: number | null
          scripture_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          last_chapter_id?: string | null
          last_chapter_title?: string | null
          last_page?: number
          last_read_at?: string | null
          progress?: number | null
          scripture_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_scripture_id_fkey"
            columns: ["scripture_id"]
            isOneToOne: false
            referencedRelation: "scriptures"
            referencedColumns: ["id"]
          },
        ]
      }
      scripture_journey: {
        Row: {
          action_type: string
          chapter_id: string | null
          chapter_title: string | null
          created_at: string | null
          id: string
          page_number: number | null
          scripture_id: string
          user_id: string
        }
        Insert: {
          action_type: string
          chapter_id?: string | null
          chapter_title?: string | null
          created_at?: string | null
          id?: string
          page_number?: number | null
          scripture_id: string
          user_id: string
        }
        Update: {
          action_type?: string
          chapter_id?: string | null
          chapter_title?: string | null
          created_at?: string | null
          id?: string
          page_number?: number | null
          scripture_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripture_journey_scripture_id_fkey"
            columns: ["scripture_id"]
            isOneToOne: false
            referencedRelation: "scriptures"
            referencedColumns: ["id"]
          },
        ]
      }
      scripture_pages: {
        Row: {
          content: string
          id: string
          page_number: number
          scripture_id: string | null
        }
        Insert: {
          content: string
          id?: string
          page_number: number
          scripture_id?: string | null
        }
        Update: {
          content?: string
          id?: string
          page_number?: number
          scripture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scripture_pages_scripture_id_fkey"
            columns: ["scripture_id"]
            isOneToOne: false
            referencedRelation: "scriptures"
            referencedColumns: ["id"]
          },
        ]
      }
      scriptures: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          title: string
          total_pages: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          total_pages: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          total_pages?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      search_history: {
        Row: {
          id: string
          searched_at: string
          temple_id: string | null
        }
        Insert: {
          id?: string
          searched_at?: string
          temple_id?: string | null
        }
        Update: {
          id?: string
          searched_at?: string
          temple_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_history_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      search_stay_history: {
        Row: {
          id: string
          searched_at: string
          temple_stay_id: string | null
        }
        Insert: {
          id?: string
          searched_at?: string
          temple_stay_id?: string | null
        }
        Update: {
          id?: string
          searched_at?: string
          temple_stay_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_stay_history_temple_stay_id_fkey"
            columns: ["temple_stay_id"]
            isOneToOne: false
            referencedRelation: "temple_stays"
            referencedColumns: ["id"]
          },
        ]
      }
      temple_stays: {
        Row: {
          cost_adult: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          follower_count: number | null
          id: string
          image_url: string | null
          name: string
          public_transportation: string | null
          region: string | null
          reservation_link: string | null
          search_count: number
          start_date: string | null
          temple_id: string | null
          updated_at: string | null
        }
        Insert: {
          cost_adult?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          follower_count?: number | null
          id?: string
          image_url?: string | null
          name: string
          public_transportation?: string | null
          region?: string | null
          reservation_link?: string | null
          search_count?: number
          start_date?: string | null
          temple_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cost_adult?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          follower_count?: number | null
          id?: string
          image_url?: string | null
          name?: string
          public_transportation?: string | null
          region?: string | null
          reservation_link?: string | null
          search_count?: number
          start_date?: string | null
          temple_id?: string | null
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
          follower_count: number | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          region: string | null
          search_count: number
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          description?: string | null
          follower_count?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          region?: string | null
          search_count?: number
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          description?: string | null
          follower_count?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          region?: string | null
          search_count?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      timelines: {
        Row: {
          content: string | null
          created_at: string | null
          day: number | null
          id: string
          temple_stay_id: string | null
          time: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          day?: number | null
          id?: string
          temple_stay_id?: string | null
          time?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          day?: number | null
          id?: string
          temple_stay_id?: string | null
          time?: string | null
        }
        Relationships: []
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
      user_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          page_number: number
          scripture_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_number: number
          scripture_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_number?: number
          scripture_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_scripture_id_fkey"
            columns: ["scripture_id"]
            isOneToOne: false
            referencedRelation: "scriptures"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follow_temple_stays: {
        Row: {
          created_at: string | null
          temple_stay_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          temple_stay_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          temple_stay_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follow_temple_stays_temple_stay_id_fkey"
            columns: ["temple_stay_id"]
            isOneToOne: false
            referencedRelation: "temple_stays"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follow_temples: {
        Row: {
          created_at: string | null
          temple_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          temple_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          temple_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follow_temples_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          font_family: string | null
          font_size: number | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          font_family?: string | null
          font_size?: number | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          font_family?: string | null
          font_size?: number | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
