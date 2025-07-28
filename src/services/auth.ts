import { supabase } from './supabase'
import { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthService {
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  getCurrentUser: () => Promise<{ user: User | null; error: AuthError | null }>
  getCurrentSession: () => Promise<{ session: Session | null; error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

export const authService: AuthService = {
  // サインイン
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { user: data.user, error }
  },

  // サインアップ
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { user: data.user, error }
  },

  // サインアウト
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 現在のユーザーを取得
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // 現在のセッションを取得
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // パスワードリセット
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  },
} 