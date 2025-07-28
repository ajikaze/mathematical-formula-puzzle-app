// ユーザー基本情報
export interface User {
  id: string
  email: string
  created_at: string
  updated_at?: string
  display_name?: string
  avatar_url?: string
  preferences?: UserPreferences
}

// ユーザー設定
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'ja' | 'en'
  formulaDisplayMode: 'inline' | 'block'
  autoSave: boolean
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  showRulers: boolean
  showGuides: boolean
  defaultFormulaCategory: string
  keyboardShortcuts: Record<string, string>
}

// ユーザー統計情報
export interface UserStats {
  totalFormulas: number
  totalSaves: number
  lastActive: string
  favoriteCategories: string[]
  mostUsedPieces: string[]
  averageFormulaComplexity: number
}

// ユーザーセッション
export interface UserSession {
  id: string
  user_id: string
  created_at: string
  expires_at: string
  ip_address?: string
  user_agent?: string
  is_active: boolean
}

// ユーザーアクティビティ
export interface UserActivity {
  id: string
  user_id: string
  activity_type: 'login' | 'logout' | 'create_formula' | 'save_formula' | 'delete_formula' | 'export_formula'
  description: string
  metadata?: Record<string, any>
  created_at: string
}

// 認証関連の型
export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  displayName?: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordUpdate {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
} 