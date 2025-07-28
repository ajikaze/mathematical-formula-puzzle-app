// 数式ピースの基本型
export interface FormulaPiece {
  id: string
  type: FormulaPieceType
  value: string
  category: FormulaCategory
  position?: { x: number; y: number }
  size?: { width: number; height: number }
  color?: string
  isSelected?: boolean
  isDragging?: boolean
}

// 数式ピースの種類
export type FormulaPieceType = 
  | 'number'
  | 'variable'
  | 'operator'
  | 'function'
  | 'fraction'
  | 'power'
  | 'root'
  | 'sum'
  | 'product'
  | 'integral'
  | 'bracket'
  | 'empty'

// 数式カテゴリ
export type FormulaCategory = 
  | 'basic'      // 基本記号（青色系）
  | 'structure'  // 基本関数・構造記号（緑色系）
  | 'calculus'   // 微積分・総和（紫色系）
  | 'empty'      // 空ブロック（グレー系）

// 数式ノード（AST構造）
export interface FormulaNode {
  id: string
  piece: FormulaPiece
  children: FormulaNode[]
}

// ドラッグ＆ドロップ関連の型
export interface DragItem {
  id: string
  type: string
  piece: FormulaPiece
}

export interface DropResult {
  accepted: boolean
  droppedAt: { x: number; y: number }
  targetId?: string
}

// 数式の接続ルール
export interface ConnectionRule {
  sourceType: FormulaPieceType
  targetType: FormulaPieceType
  allowed: boolean
  autoGenerate?: boolean
  generateType?: FormulaPieceType
}

// 数式の検証結果
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// LaTeX変換オプション
export interface LaTeXOptions {
  displayMode?: boolean
  throwOnError?: boolean
  errorColor?: string
  macros?: Record<string, string>
} 