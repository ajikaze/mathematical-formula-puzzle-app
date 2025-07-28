import { FormulaPiece, FormulaNode, FormulaPieceType, FormulaCategory } from '../types/formula'

// 数式ピースの生成
export const createFormulaPiece = (
  type: FormulaPieceType,
  value: string,
  category: FormulaCategory,
  id?: string
): FormulaPiece => ({
  id: id || generateId(),
  type,
  value,
  category,
  position: { x: 0, y: 0 },
  size: { width: 50, height: 50 },
  isSelected: false,
  isDragging: false,
})

// 数式ノードの生成
export const createFormulaNode = (piece: FormulaPiece): FormulaNode => ({
  id: piece.id,
  piece,
  children: [],
})

// ユニークIDの生成
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// 数式ピースの複製
export const cloneFormulaPiece = (piece: FormulaPiece): FormulaPiece => ({
  ...piece,
  id: generateId(),
  position: { x: piece.position?.x || 0, y: piece.position?.y || 0 },
  isSelected: false,
  isDragging: false,
})

// 数式ノードの複製
export const cloneFormulaNode = (node: FormulaNode): FormulaNode => ({
  id: generateId(),
  piece: cloneFormulaPiece(node.piece),
  children: node.children.map(child => cloneFormulaNode(child)),
})

// 数式ツリーの深さを取得
export const getTreeDepth = (node: FormulaNode): number => {
  if (node.children.length === 0) return 1
  return 1 + Math.max(...node.children.map(child => getTreeDepth(child)))
}

// 数式ツリーのノード数を取得
export const getNodeCount = (node: FormulaNode): number => {
  return 1 + node.children.reduce((count, child) => count + getNodeCount(child), 0)
}

// 数式ピースの接続可能性をチェック
export const canConnect = (source: FormulaPiece, target: FormulaPiece): boolean => {
  // 基本的な接続ルール
  const connectionRules: Record<FormulaPieceType, FormulaPieceType[]> = {
    number: ['operator', 'function', 'bracket'],
    variable: ['operator', 'function', 'bracket'],
    operator: ['number', 'variable', 'function', 'bracket'],
    function: ['number', 'variable', 'bracket'],
    fraction: ['number', 'variable', 'operator', 'function'],
    power: ['number', 'variable', 'operator', 'function'],
    root: ['number', 'variable', 'operator', 'function'],
    sum: ['number', 'variable', 'operator', 'function'],
    product: ['number', 'variable', 'operator', 'function'],
    integral: ['number', 'variable', 'operator', 'function'],
    bracket: ['number', 'variable', 'operator', 'function'],
    empty: ['number', 'variable', 'operator', 'function', 'bracket'],
  }

  return connectionRules[source.type]?.includes(target.type) || false
}

// 数式ピースの位置を更新
export const updatePiecePosition = (
  piece: FormulaPiece,
  x: number,
  y: number
): FormulaPiece => ({
  ...piece,
  position: { x, y },
})

// 数式ピースのサイズを更新
export const updatePieceSize = (
  piece: FormulaPiece,
  width: number,
  height: number
): FormulaPiece => ({
  ...piece,
  size: { width, height },
})

// 数式ピースの選択状態を更新
export const updatePieceSelection = (
  piece: FormulaPiece,
  isSelected: boolean
): FormulaPiece => ({
  ...piece,
  isSelected,
})

// 数式ピースのドラッグ状態を更新
export const updatePieceDragging = (
  piece: FormulaPiece,
  isDragging: boolean
): FormulaPiece => ({
  ...piece,
  isDragging,
}) 