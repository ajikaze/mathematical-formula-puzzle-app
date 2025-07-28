import { FormulaPiece, FormulaNode, ValidationResult } from '../types/formula'

// 数式の構文チェック
export const validateFormula = (node: FormulaNode): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  // 基本的な構文チェック
  validateNode(node, errors, warnings)

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// ノードの再帰的バリデーション
const validateNode = (node: FormulaNode, errors: string[], warnings: string[]) => {
  const { piece, children } = node

  // 数式ピースの基本チェック
  if (!piece.value || piece.value.trim() === '') {
    errors.push(`空の値を持つ数式ピースがあります: ${piece.type}`)
  }

  // 型別のバリデーション
  switch (piece.type) {
    case 'number':
      validateNumber(piece, errors, warnings)
      break
    case 'variable':
      validateVariable(piece, errors, warnings)
      break
    case 'operator':
      validateOperator(piece, errors, warnings)
      break
    case 'function':
      validateFunction(piece, children, errors, warnings)
      break
    case 'fraction':
      validateFraction(piece, children, errors, warnings)
      break
    case 'power':
      validatePower(piece, children, errors, warnings)
      break
    case 'root':
      validateRoot(piece, children, errors, warnings)
      break
    case 'sum':
      validateSum(piece, children, errors, warnings)
      break
    case 'product':
      validateProduct(piece, children, errors, warnings)
      break
    case 'integral':
      validateIntegral(piece, children, errors, warnings)
      break
    case 'bracket':
      validateBracket(piece, children, errors, warnings)
      break
  }

  // 子ノードのバリデーション
  children.forEach(child => validateNode(child, errors, warnings))
}

// 数字のバリデーション
const validateNumber = (piece: FormulaPiece, errors: string[], warnings: string[]) => {
  const value = piece.value.trim()
  
  if (!/^-?\d*\.?\d+$/.test(value)) {
    errors.push(`無効な数値です: ${value}`)
  }

  if (value.includes('.') && value.split('.')[1]?.length > 10) {
    warnings.push(`小数点以下が長すぎます: ${value}`)
  }
}

// 変数のバリデーション
const validateVariable = (piece: FormulaPiece, errors: string[], warnings: string[]) => {
  const value = piece.value.trim()
  
  if (!/^[a-zA-Zα-ωΑ-Ω]$/.test(value)) {
    errors.push(`無効な変数名です: ${value}`)
  }
}

// 演算子のバリデーション
const validateOperator = (piece: FormulaPiece, errors: string[], warnings: string[]) => {
  const validOperators = ['+', '-', '*', '/', '=', '≠', '<', '>', '≤', '≥']
  
  if (!validOperators.includes(piece.value)) {
    errors.push(`無効な演算子です: ${piece.value}`)
  }
}

// 関数のバリデーション
const validateFunction = (piece: FormulaPiece, children: FormulaNode[], errors: string[], warnings: string[]) => {
  const validFunctions = ['sin', 'cos', 'tan', 'log', 'ln', 'exp']
  
  if (!validFunctions.includes(piece.value)) {
    errors.push(`無効な関数名です: ${piece.value}`)
  }

  if (children.length === 0) {
    errors.push(`関数 ${piece.value} に引数がありません`)
  } else if (children.length > 1) {
    warnings.push(`関数 ${piece.value} に複数の引数があります`)
  }
}

// 分数のバリデーション
const validateFraction = (piece: FormulaPiece, children: FormulaNode[], errors: string[], warnings: string[]) => {
  if (children.length !== 2) {
    errors.push(`分数には分子と分母の2つの要素が必要です`)
  }
}

// 累乗のバリデーション
const validatePower = (piece: FormulaPiece, children: FormulaNode[], errors: string[], warnings: string[]) => {
  if (children.length !== 2) {
    errors.push(`累乗には底と指数の2つの要素が必要です`)
  }
}

// 根号のバリデーション
const validateRoot = (piece: FormulaPiece, children: FormulaNode[], errors: string[], warnings: string[]) => {
  if (children.length === 0) {
    errors.push(`根号に被開平数がありません`)
  }
}

// 総和のバリデーション
const validateSum = (piece: FormulaPiece, children: FormulaNode[], errors: string[], warnings: string[]) => {
  if (children.length < 3) {
    errors.push(`総和にはインデックス、開始値、終了値、一般項が必要です`)
  }
}

// 総積のバリデーション
const validateProduct = (piece: FormulaPiece, children: FormulaNode[], errors: string[], warnings: string[]) => {
  if (children.length < 3) {
    errors.push(`総積にはインデックス、開始値、終了値、一般項が必要です`)
  }
}

// 積分のバリデーション
const validateIntegral = (piece: FormulaPiece, children: FormulaNode[], errors: string[], warnings: string[]) => {
  if (children.length < 4) {
    errors.push(`積分には下限、上限、関数、積分変数が必要です`)
  }
}

// 括弧のバリデーション
const validateBracket = (piece: FormulaPiece, children: FormulaNode[], errors: string[], warnings: string[]) => {
  if (children.length === 0) {
    warnings.push(`括弧が空です`)
  }
}

// 数式の複雑さを評価
export const calculateComplexity = (node: FormulaNode): number => {
  let complexity = 1

  // ノードの型に基づく複雑さ
  switch (node.piece.type) {
    case 'function':
    case 'fraction':
    case 'power':
    case 'root':
      complexity += 2
      break
    case 'sum':
    case 'product':
    case 'integral':
      complexity += 3
      break
  }

  // 子ノードの複雑さを加算
  node.children.forEach(child => {
    complexity += calculateComplexity(child)
  })

  return complexity
}

// 数式の長さを計算
export const calculateFormulaLength = (node: FormulaNode): number => {
  let length = node.piece.value.length

  node.children.forEach(child => {
    length += calculateFormulaLength(child)
  })

  return length
} 