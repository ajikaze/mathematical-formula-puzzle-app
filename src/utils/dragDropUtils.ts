import { FormulaPiece, FormulaCategory } from '../types/formula'

// ドラッグ可能なアイテムの型
export interface DraggableItem {
  id: string
  type: string
  piece: FormulaPiece
}

// ドロップ可能なエリアの型
export interface DroppableArea {
  id: string
  type: string
  accepts: string[]
  position: { x: number; y: number }
  size: { width: number; height: number }
}

// ドラッグ状態の管理
export interface DragState {
  isDragging: boolean
  draggedItem: DraggableItem | null
  dragOffset: { x: number; y: number }
  dropTarget: DroppableArea | null
}

// ドラッグ開始時の処理
export const handleDragStart = (
  event: any,
  item: DraggableItem,
  setDragState: (state: DragState) => void
) => {
  const rect = event.target.getBoundingClientRect()
  const offset = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }

  setDragState({
    isDragging: true,
    draggedItem: item,
    dragOffset: offset,
    dropTarget: null,
  })

  // ドラッグ中のカーソルスタイルを設定
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(item))
  }
}

// ドラッグ中の処理
export const handleDragOver = (
  event: any,
  dropArea: DroppableArea,
  setDragState: (state: DragState) => void
) => {
  event.preventDefault()
  
  setDragState(prevState => ({
    ...prevState,
    dropTarget: dropArea,
  }))
}

// ドロップ時の処理
export const handleDrop = (
  event: any,
  dropArea: DroppableArea,
  onDrop: (item: DraggableItem, target: DroppableArea) => void,
  setDragState: (state: DragState) => void
) => {
  event.preventDefault()

  try {
    const itemData = event.dataTransfer.getData('application/json')
    const item: DraggableItem = JSON.parse(itemData)

    if (canDrop(item, dropArea)) {
      onDrop(item, dropArea)
    }
  } catch (error) {
    console.error('Drop handling error:', error)
  }

  setDragState({
    isDragging: false,
    draggedItem: null,
    dragOffset: { x: 0, y: 0 },
    dropTarget: null,
  })
}

// ドラッグ終了時の処理
export const handleDragEnd = (setDragState: (state: DragState) => void) => {
  setDragState({
    isDragging: false,
    draggedItem: null,
    dragOffset: { x: 0, y: 0 },
    dropTarget: null,
  })
}

// ドロップ可能かどうかをチェック
export const canDrop = (item: DraggableItem, dropArea: DroppableArea): boolean => {
  return dropArea.accepts.includes(item.type)
}

// 数式ピースのカテゴリに基づくドロップ可能エリアの判定
export const getDropAcceptanceRules = (category: FormulaCategory): string[] => {
  switch (category) {
    case 'basic':
      return ['number', 'variable', 'operator', 'bracket']
    case 'structure':
      return ['number', 'variable', 'operator', 'function', 'bracket']
    case 'calculus':
      return ['number', 'variable', 'operator', 'function', 'bracket']
    case 'empty':
      return ['number', 'variable', 'operator', 'function', 'bracket']
    default:
      return []
  }
}

// ドラッグ中の視覚的フィードバック
export const getDragFeedback = (dragState: DragState): string => {
  if (!dragState.isDragging || !dragState.draggedItem) {
    return ''
  }

  if (dragState.dropTarget && canDrop(dragState.draggedItem, dragState.dropTarget)) {
    return 'drop-allowed'
  }

  return 'drop-forbidden'
}

// ドラッグ中の位置計算
export const calculateDragPosition = (
  event: any,
  dragOffset: { x: number; y: number }
): { x: number; y: number } => {
  return {
    x: event.clientX - dragOffset.x,
    y: event.clientY - dragOffset.y,
  }
}

// ドロップエリアの衝突判定
export const isPointInArea = (
  point: { x: number; y: number },
  area: DroppableArea
): boolean => {
  return (
    point.x >= area.position.x &&
    point.x <= area.position.x + area.size.width &&
    point.y >= area.position.y &&
    point.y <= area.position.y + area.size.height
  )
}

// ドラッグ中のスナップ機能
export const snapToGrid = (
  position: { x: number; y: number },
  gridSize: number = 20
): { x: number; y: number } => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  }
}

// ドラッグ中の制約（境界内に制限）
export const constrainToBounds = (
  position: { x: number; y: number },
  bounds: { width: number; height: number },
  itemSize: { width: number; height: number }
): { x: number; y: number } => {
  return {
    x: Math.max(0, Math.min(position.x, bounds.width - itemSize.width)),
    y: Math.max(0, Math.min(position.y, bounds.height - itemSize.height)),
  }
} 