import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

// Supabaseクライアントの作成
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase接続状態を管理するカスタムフック
export const useSupabase = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('_dummy_table').select('*').limit(1)
        // エラーが発生しても接続自体は成功している場合がある
        setIsConnected(!error || error.code !== 'PGRST116')
      } catch (error) {
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  return { supabase, isConnected, isLoading }
} 