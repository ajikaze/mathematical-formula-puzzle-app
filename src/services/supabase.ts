import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabaseクライアントの設定
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Supabaseクライアントの作成
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// データベース接続テスト
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('_dummy_table').select('*').limit(1)
    return { success: !error || error.code !== 'PGRST116', error }
  } catch (error) {
    return { success: false, error }
  }
}

// リアルタイム接続の設定
export const setupRealtime = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe()
} 