// Supabaseデータベースのテーブル型定義
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at?: string
          display_name?: string
          avatar_url?: string
          preferences?: any
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          display_name?: string
          avatar_url?: string
          preferences?: any
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          display_name?: string
          avatar_url?: string
          preferences?: any
        }
      }
      formulas: {
        Row: {
          id: string
          user_id: string
          name: string
          formula_data: any
          latex_content: string
          created_at: string
          updated_at?: string
          is_public: boolean
          tags: string[]
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          formula_data: any
          latex_content?: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          tags?: string[]
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          formula_data?: any
          latex_content?: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          tags?: string[]
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          created_at: string
          expires_at: string
          ip_address?: string
          user_agent?: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          expires_at: string
          ip_address?: string
          user_agent?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          expires_at?: string
          ip_address?: string
          user_agent?: string
          is_active?: boolean
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          description: string
          metadata?: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          description: string
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          description?: string
          metadata?: any
          created_at?: string
        }
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
  }
}

// Supabaseクライアントの型
export type SupabaseClient = any

// リアルタイム関連の型
export interface RealtimeChannel {
  subscribe: (callback: (payload: any) => void) => void
  unsubscribe: () => void
}

export interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: any
  old: any
  table: string
  schema: string
}

// エラーハンドリング
export interface SupabaseError {
  message: string
  details?: string
  hint?: string
  code?: string
} 