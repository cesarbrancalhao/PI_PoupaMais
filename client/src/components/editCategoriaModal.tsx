'use client'

import { useState, useRef, useEffect } from 'react'
import {
  X, Home, Plug, Shirt, ShoppingCart, Utensils, Car, Heart,
  BookOpen, Briefcase, Gift, Apple, Gamepad2, Save, Trash
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CategoriaDespesa, FonteReceita } from '@/types'
import { categoriasDespesaService } from '@/services/categorias.service'
import { fontesReceitaService } from '@/services/fontes.service'
import { useTheme } from '@/contexts/ThemeContext'

interface EditCategoriaModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'categorias' | 'fontes'
  item: CategoriaDespesa | FonteReceita
  onDelete?: (id: number) => void
}

const availableIcons = [
  { name: 'Home', component: Home },
  { name: 'Plug', component: Plug },
  { name: 'Shirt', component: Shirt },
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'Gamepad-2', component: Gamepad2 },
  { name: 'Apple', component: Apple },
  { name: 'Utensils', component: Utensils },
  { name: 'Car', component: Car },
  { name: 'Heart', component: Heart },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Gift', component: Gift },
]

export default function EditCategoriaModal({
  isOpen, onClose, type, item, onDelete
}: EditCategoriaModalProps) {

  const [nome, setNome] = useState(item.nome)
  const [icone, setIcone] = useState(item.icone || 'Home')
  const [showError, setShowError] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const { theme } = useTheme()
  const isDark = theme === 'escuro'

  useEffect(() => {
    setNome(item.nome)
    setIcone(item.icone || 'Home')
    setShowError(false)
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (type === 'categorias') {
        await categoriasDespesaService.update(item.id, { nome, icone })
      } else {
        await fontesReceitaService.update(item.id, { nome, icone })
      }

      onClose()
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }
  }

  const bgModal = isDark ? 'bg-[#2B2B2B]' : 'bg-white'
  const textMain = isDark ? 'text-gray-100' : 'text-gray-800'
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700'
  const inputBg = isDark ? 'bg-[#3C3C3C]' : 'bg-gray-50'
  const inputText = isDark ? 'text-gray-100' : 'text-gray-700'
  const borderDefault = isDark ? 'border-gray-600' : 'border-gray-200'
  const selectedBorder = 'border-blue-600'
  const selectedBg = isDark ? 'bg-blue-900/40' : 'bg-blue-50'
  const iconInactive = isDark ? 'text-gray-300' : 'text-gray-600'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className={`fixed right-0 top-0 h-full w-full max-w-md ${bgModal} shadow-xl z-50 flex flex-col p-6 overflow-y-auto border-l ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >

            <AnimatePresence>
              {showError && (
                <motion.div
                  className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl z-[60] flex items-center gap-3`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Algo deu errado. Tente novamente.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${textMain}`}>
                Alterar {type === 'categorias' ? 'Categoria' : 'Fonte'}
              </h2>
              <button onClick={onClose} className={`${textSecondary} hover:opacity-80`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${textMain}`}>Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={`w-full ${inputBg} ${inputText} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-3 ${textMain}`}>Ícone</label>
                <div className="grid grid-cols-4 gap-3">
                  {availableIcons.map(icon => {
                    const IconComponent = icon.component
                    const isSelected = icone === icon.name
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setIcone(icon.name)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `${selectedBorder} ${selectedBg}`
                            : `${borderDefault} hover:border-blue-500`
                        }`}
                      >
                        <IconComponent
                          className={`w-6 h-6 mx-auto ${
                            isSelected ? 'text-blue-600' : iconInactive
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar {type === 'categorias' ? 'categoria' : 'fonte'}
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Deseja excluir ${item.nome}?`)) {
                      onDelete(item.id)
                      onClose()
                    }
                  }}
                  className="w-full mt-2 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <Trash className="w-4 h-4" />
                  Excluir
                </button>
              )}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
