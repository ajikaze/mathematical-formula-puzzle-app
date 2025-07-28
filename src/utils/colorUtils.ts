import { FormulaCategory } from '../types/formula'

// 数式カテゴリの色定義
export const CATEGORY_COLORS: Record<FormulaCategory, string> = {
  basic: '#3B82F6',      // 青色系（基本記号）
  structure: '#10B981',  // 緑色系（基本関数・構造記号）
  calculus: '#8B5CF6',   // 紫色系（微積分・総和）
  empty: '#6B7280',      // グレー系（空ブロック）
}

// カテゴリの背景色（薄い色）
export const CATEGORY_BG_COLORS: Record<FormulaCategory, string> = {
  basic: '#DBEAFE',      // 薄い青色
  structure: '#D1FAE5',  // 薄い緑色
  calculus: '#EDE9FE',   // 薄い紫色
  empty: '#F3F4F6',      // 薄いグレー
}

// カテゴリのボーダー色
export const CATEGORY_BORDER_COLORS: Record<FormulaCategory, string> = {
  basic: '#2563EB',      // 濃い青色
  structure: '#059669',  // 濃い緑色
  calculus: '#7C3AED',   // 濃い紫色
  empty: '#4B5563',      // 濃いグレー
}

// カテゴリのホバー色
export const CATEGORY_HOVER_COLORS: Record<FormulaCategory, string> = {
  basic: '#1D4ED8',      // より濃い青色
  structure: '#047857',  // より濃い緑色
  calculus: '#6D28D9',   // より濃い紫色
  empty: '#374151',      // より濃いグレー
}

// カテゴリから色を取得
export const getCategoryColor = (category: FormulaCategory): string => {
  return CATEGORY_COLORS[category]
}

// カテゴリから背景色を取得
export const getCategoryBgColor = (category: FormulaCategory): string => {
  return CATEGORY_BG_COLORS[category]
}

// カテゴリからボーダー色を取得
export const getCategoryBorderColor = (category: FormulaCategory): string => {
  return CATEGORY_BORDER_COLORS[category]
}

// カテゴリからホバー色を取得
export const getCategoryHoverColor = (category: FormulaCategory): string => {
  return CATEGORY_HOVER_COLORS[category]
}

// 色の明度を調整
export const adjustBrightness = (color: string, amount: number): string => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  const newR = Math.max(0, Math.min(255, r + amount))
  const newG = Math.max(0, Math.min(255, g + amount))
  const newB = Math.max(0, Math.min(255, b + amount))

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// 色の透明度を調整
export const adjustOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// 色のコントラスト比を計算
export const getContrastRatio = (color1: string, color2: string): number => {
  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)

  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)

  return (lighter + 0.05) / (darker + 0.05)
}

// 色の輝度を計算
export const getLuminance = (color: string): number => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB
}

// テキスト色を自動決定（背景色に基づいて）
export const getTextColor = (backgroundColor: string): string => {
  const luminance = getLuminance(backgroundColor)
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// 選択状態の色を取得
export const getSelectionColor = (category: FormulaCategory): string => {
  const baseColor = getCategoryColor(category)
  return adjustBrightness(baseColor, 30)
}

// ドラッグ状態の色を取得
export const getDragColor = (category: FormulaCategory): string => {
  const baseColor = getCategoryColor(category)
  return adjustOpacity(baseColor, 0.7)
}

// 無効状態の色を取得
export const getDisabledColor = (category: FormulaCategory): string => {
  const baseColor = getCategoryColor(category)
  return adjustBrightness(baseColor, -50)
}

// グラデーション色を生成
export const createGradient = (color1: string, color2: string, direction: 'horizontal' | 'vertical' = 'horizontal'): string => {
  const directionValue = direction === 'horizontal' ? 'to right' : 'to bottom'
  return `linear-gradient(${directionValue}, ${color1}, ${color2})`
}

// カテゴリのグラデーション色を取得
export const getCategoryGradient = (category: FormulaCategory): string => {
  const baseColor = getCategoryColor(category)
  const lighterColor = adjustBrightness(baseColor, 30)
  return createGradient(baseColor, lighterColor)
} 