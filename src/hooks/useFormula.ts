import { useState, useCallback } from 'react'
import { FormulaPiece, FormulaNode } from '../types/formula'

export const useFormula = () => {
  const [formulaTree, setFormulaTree] = useState<FormulaNode | null>(null)
  const [selectedPiece, setSelectedPiece] = useState<FormulaPiece | null>(null)

  // 数式ピースを追加
  const addPiece = useCallback((piece: FormulaPiece, parentId?: string) => {
    setFormulaTree(prevTree => {
      if (!prevTree) {
        return {
          id: piece.id,
          piece,
          children: [],
        }
      }

      const addToNode = (node: FormulaNode): FormulaNode => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...node.children, { id: piece.id, piece, children: [] }],
          }
        }

        return {
          ...node,
          children: node.children.map(child => addToNode(child)),
        }
      }

      return addToNode(prevTree)
    })
  }, [])

  // 数式ピースを削除
  const removePiece = useCallback((pieceId: string) => {
    setFormulaTree(prevTree => {
      if (!prevTree) return null

      const removeFromNode = (node: FormulaNode): FormulaNode | null => {
        if (node.id === pieceId) {
          return null
        }

        return {
          ...node,
          children: node.children
            .map(child => removeFromNode(child))
            .filter((child): child is FormulaNode => child !== null),
        }
      }

      return removeFromNode(prevTree)
    })
  }, [])

  // 数式ピースを更新
  const updatePiece = useCallback((pieceId: string, updates: Partial<FormulaPiece>) => {
    setFormulaTree(prevTree => {
      if (!prevTree) return null

      const updateNode = (node: FormulaNode): FormulaNode => {
        if (node.id === pieceId) {
          return {
            ...node,
            piece: { ...node.piece, ...updates },
          }
        }

        return {
          ...node,
          children: node.children.map(child => updateNode(child)),
        }
      }

      return updateNode(prevTree)
    })
  }, [])

  // 数式をLaTeXに変換
  const toLaTeX = useCallback((node: FormulaNode | null = formulaTree): string => {
    if (!node) return ''

    const { piece } = node
    const childrenLaTeX = node.children.map(child => toLaTeX(child)).join('')

    switch (piece.type) {
      case 'number':
        return piece.value
      case 'variable':
        return piece.value
      case 'operator':
        return piece.value
      case 'function':
        return `${piece.value}(${childrenLaTeX})`
      case 'fraction':
        return `\\frac{${node.children[0] ? toLaTeX(node.children[0]) : ''}}{${node.children[1] ? toLaTeX(node.children[1]) : ''}}`
      case 'power':
        return `${node.children[0] ? toLaTeX(node.children[0]) : ''}^{${node.children[1] ? toLaTeX(node.children[1]) : ''}}`
      case 'root':
        return `\\sqrt{${childrenLaTeX}}`
      case 'sum':
        return `\\sum_{${node.children[0] ? toLaTeX(node.children[0]) : ''}}^{${node.children[1] ? toLaTeX(node.children[1]) : ''}} ${node.children[2] ? toLaTeX(node.children[2]) : ''}`
      default:
        return childrenLaTeX
    }
  }, [formulaTree])

  return {
    formulaTree,
    selectedPiece,
    setSelectedPiece,
    addPiece,
    removePiece,
    updatePiece,
    toLaTeX,
  }
} 