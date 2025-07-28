import { supabase } from './supabase'
import { FormulaPiece, FormulaNode } from '../types/formula'

export interface FormulaService {
  saveFormula: (userId: string, formulaTree: FormulaNode, name: string) => Promise<{ id: string; error: any }>
  loadFormula: (formulaId: string) => Promise<{ formula: FormulaNode | null; error: any }>
  getUserFormulas: (userId: string) => Promise<{ formulas: any[]; error: any }>
  deleteFormula: (formulaId: string) => Promise<{ error: any }>
  updateFormula: (formulaId: string, formulaTree: FormulaNode, name: string) => Promise<{ error: any }>
}

export const formulaService: FormulaService = {
  // 数式を保存
  saveFormula: async (userId: string, formulaTree: FormulaNode, name: string) => {
    const { data, error } = await supabase
      .from('formulas')
      .insert({
        user_id: userId,
        name,
        formula_data: formulaTree,
        latex_content: '', // 後でLaTeX変換を実装
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    return { id: data?.id, error }
  },

  // 数式を読み込み
  loadFormula: async (formulaId: string) => {
    const { data, error } = await supabase
      .from('formulas')
      .select('*')
      .eq('id', formulaId)
      .single()

    return { formula: data?.formula_data || null, error }
  },

  // ユーザーの数式一覧を取得
  getUserFormulas: async (userId: string) => {
    const { data, error } = await supabase
      .from('formulas')
      .select('id, name, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { formulas: data || [], error }
  },

  // 数式を削除
  deleteFormula: async (formulaId: string) => {
    const { error } = await supabase
      .from('formulas')
      .delete()
      .eq('id', formulaId)

    return { error }
  },

  // 数式を更新
  updateFormula: async (formulaId: string, formulaTree: FormulaNode, name: string) => {
    const { error } = await supabase
      .from('formulas')
      .update({
        name,
        formula_data: formulaTree,
        latex_content: '', // 後でLaTeX変換を実装
        updated_at: new Date().toISOString(),
      })
      .eq('id', formulaId)

    return { error }
  },
} 