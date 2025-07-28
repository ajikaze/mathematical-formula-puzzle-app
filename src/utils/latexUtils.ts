import { FormulaNode } from '../types/formula'

// 数式ノードをLaTeXに変換
export const nodeToLaTeX = (node: FormulaNode): string => {
  const { piece } = node
  const childrenLaTeX = node.children.map(child => nodeToLaTeX(child))

  switch (piece.type) {
    case 'number':
      return piece.value
    case 'variable':
      return piece.value
    case 'operator':
      return escapeOperator(piece.value)
    case 'function':
      return `${piece.value}(${childrenLaTeX.join(', ')})`
    case 'fraction':
      return `\\frac{${childrenLaTeX[0] || ''}}{${childrenLaTeX[1] || ''}}`
    case 'power':
      return `${childrenLaTeX[0] || ''}^{${childrenLaTeX[1] || ''}}`
    case 'root':
      if (childrenLaTeX.length === 1) {
        return `\\sqrt{${childrenLaTeX[0]}}`
      } else {
        return `\\sqrt[${childrenLaTeX[0]}]{${childrenLaTeX[1]}}`
      }
    case 'sum':
      return `\\sum_{${childrenLaTeX[0] || ''}}^{${childrenLaTeX[1] || ''}} ${childrenLaTeX[2] || ''}`
    case 'product':
      return `\\prod_{${childrenLaTeX[0] || ''}}^{${childrenLaTeX[1] || ''}} ${childrenLaTeX[2] || ''}`
    case 'integral':
      return `\\int_{${childrenLaTeX[0] || ''}}^{${childrenLaTeX[1] || ''}} ${childrenLaTeX[2] || ''} \\, d${childrenLaTeX[3] || 'x'}`
    case 'bracket':
      return `(${childrenLaTeX.join('')})`
    case 'empty':
      return ''
    default:
      return childrenLaTeX.join('')
  }
}

// 演算子のエスケープ
const escapeOperator = (operator: string): string => {
  const operatorMap: Record<string, string> = {
    '*': '\\cdot ',
    '/': '\\div ',
    '≠': '\\neq ',
    '≤': '\\leq ',
    '≥': '\\geq ',
    '<': '<',
    '>': '>',
    '=': '=',
    '+': '+',
    '-': '-',
  }

  return operatorMap[operator] || operator
}

// LaTeX文字列をクリーンアップ
export const cleanLaTeX = (latex: string): string => {
  return latex
    .replace(/\s+/g, ' ') // 複数の空白を単一の空白に
    .replace(/\s*\\\s*/g, '\\') // バックスラッシュ前後の空白を削除
    .trim()
}

// LaTeXの構文チェック
export const validateLaTeX = (latex: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // 基本的な構文チェック
  if (!latex.trim()) {
    errors.push('LaTeXが空です')
  }

  // 括弧のバランスチェック
  const openBraces = (latex.match(/\{/g) || []).length
  const closeBraces = (latex.match(/\}/g) || []).length
  if (openBraces !== closeBraces) {
    errors.push('括弧の数が一致しません')
  }

  // 未終了のコマンドチェック
  const unclosedCommands = latex.match(/\\[a-zA-Z]+\s*$/g)
  if (unclosedCommands) {
    errors.push('未終了のLaTeXコマンドがあります')
  }

  // 無効な文字チェック
  const invalidChars = latex.match(/[^\x00-\x7F]/g)
  if (invalidChars) {
    errors.push('無効な文字が含まれています')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// LaTeXをHTMLに変換（KaTeX使用）
export const renderLaTeX = async (latex: string, options: any = {}): Promise<string> => {
  try {
    // KaTeXが利用可能な場合
    if (typeof window !== 'undefined' && (window as any).katex) {
      const katex = (window as any).katex
      return katex.renderToString(latex, {
        displayMode: false,
        throwOnError: false,
        errorColor: '#cc0000',
        ...options,
      })
    }

    // KaTeXが利用できない場合はプレーンテキストとして返す
    return `<span class="latex">${escapeHtml(latex)}</span>`
  } catch (error) {
    console.error('LaTeX rendering error:', error)
    return `<span class="latex-error">${escapeHtml(latex)}</span>`
  }
}

// HTMLエスケープ
const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// LaTeXコマンドの一覧
export const LATEX_COMMANDS = {
  functions: ['\\sin', '\\cos', '\\tan', '\\log', '\\ln', '\\exp'],
  operators: ['\\cdot', '\\div', '\\neq', '\\leq', '\\geq'],
  structures: ['\\frac', '\\sqrt', '\\sum', '\\prod', '\\int'],
  brackets: ['(', ')', '[', ']', '\\{', '\\}'],
}

// LaTeXコマンドの説明
export const LATEX_COMMAND_DESCRIPTIONS: Record<string, string> = {
  '\\sin': '正弦関数',
  '\\cos': '余弦関数',
  '\\tan': '正接関数',
  '\\log': '対数関数',
  '\\ln': '自然対数',
  '\\exp': '指数関数',
  '\\frac': '分数',
  '\\sqrt': '平方根',
  '\\sum': '総和',
  '\\prod': '総積',
  '\\int': '積分',
  '\\cdot': '乗算記号',
  '\\div': '除算記号',
  '\\neq': '不等号',
  '\\leq': '以下',
  '\\geq': '以上',
} 