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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          tournament_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          tournament_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          id: string
          match_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          match_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          match_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          bracket_type: string | null
          completed_at: string | null
          created_at: string | null
          deadline: string | null
          id: string
          match_number: number
          player1_id: string | null
          player1_score: number | null
          player1_screenshot: string | null
          player1_submitted: boolean | null
          player2_id: string | null
          player2_score: number | null
          player2_screenshot: string | null
          player2_submitted: boolean | null
          round: number
          status: string
          tournament_id: string
          updated_at: string | null
          winner_id: string | null
        }
        Insert: {
          bracket_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          match_number: number
          player1_id?: string | null
          player1_score?: number | null
          player1_screenshot?: string | null
          player1_submitted?: boolean | null
          player2_id?: string | null
          player2_score?: number | null
          player2_screenshot?: string | null
          player2_submitted?: boolean | null
          round: number
          status?: string
          tournament_id: string
          updated_at?: string | null
          winner_id?: string | null
        }
        Update: {
          bracket_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          match_number?: number
          player1_id?: string | null
          player1_score?: number | null
          player1_screenshot?: string | null
          player1_submitted?: boolean | null
          player2_id?: string | null
          player2_score?: number | null
          player2_screenshot?: string | null
          player2_submitted?: boolean | null
          round?: number
          status?: string
          tournament_id?: string
          updated_at?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats: {
        Row: {
          created_at: string | null
          matches_lost: number | null
          matches_won: number | null
          total_earnings: number | null
          total_matches: number | null
          tournaments_played: number | null
          tournaments_won: number | null
          updated_at: string | null
          user_id: string
          win_rate: number | null
        }
        Insert: {
          created_at?: string | null
          matches_lost?: number | null
          matches_won?: number | null
          total_earnings?: number | null
          total_matches?: number | null
          tournaments_played?: number | null
          tournaments_won?: number | null
          updated_at?: string | null
          user_id: string
          win_rate?: number | null
        }
        Update: {
          created_at?: string | null
          matches_lost?: number | null
          matches_won?: number | null
          total_earnings?: number | null
          total_matches?: number | null
          tournaments_played?: number | null
          tournaments_won?: number | null
          updated_at?: string | null
          user_id?: string
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          device_fingerprint: string | null
          email: string
          full_name: string
          id: string
          phone: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          email: string
          full_name: string
          id: string
          phone: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          id: string
          payment_status: string | null
          position_finished: number | null
          prize_amount: number | null
          registered_at: string | null
          status: string
          tournament_id: string
          user_id: string
        }
        Insert: {
          id?: string
          payment_status?: string | null
          position_finished?: number | null
          prize_amount?: number | null
          registered_at?: string | null
          status?: string
          tournament_id: string
          user_id: string
        }
        Update: {
          id?: string
          payment_status?: string | null
          position_finished?: number | null
          prize_amount?: number | null
          registered_at?: string | null
          status?: string
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          bracket_data: Json | null
          created_at: string | null
          created_by: string
          current_players: number | null
          description: string | null
          end_date: string | null
          entry_fee: number
          format: string
          id: string
          max_slots: number
          mode: string
          name: string
          poster_url: string | null
          prize_pool: number | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          bracket_data?: Json | null
          created_at?: string | null
          created_by: string
          current_players?: number | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number
          format: string
          id?: string
          max_slots: number
          mode: string
          name: string
          poster_url?: string | null
          prize_pool?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          bracket_data?: Json | null
          created_at?: string | null
          created_by?: string
          current_players?: number | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number
          format?: string
          id?: string
          max_slots?: number
          mode?: string
          name?: string
          poster_url?: string | null
          prize_pool?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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

