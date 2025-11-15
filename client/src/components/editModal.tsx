'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Save, Trash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CategoriaDespesa, FonteReceita } from '@/types'
import { categoriasDespesaService } from '@/services/categorias.service'
import { fontesReceitaService } from '@/services/fontes.service'
import { despesasService } from '@/services/despesas.service'
import { receitasService } from '@/services/receitas.service'
import { useTheme } from '@/contexts/ThemeContext'
import { formatCurrency, getCurrencyPlaceholder, getCurrencySymbol } from "@/app/terminology/currency";
import { Moeda } from "@/types/configs";
import { useAuth } from '@/contexts/AuthContext'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'despesas' | 'receitas'
  editItem: {
    id: string
    name: string
    category: string
    value: string
    recurring: boolean
    date: string
  }
  onDelete?: (id: string) => void
  moeda: Moeda
}

interface CalendarProps {
  selectedDate: string
  onDateSelect: (date: string) => void
}

function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { theme } = useTheme()
  const dark = theme === 'escuro'

  useEffect(() => {
    if (selectedDate) {
      const selectedDateParts = selectedDate.split('-')
      if (selectedDateParts.length === 3) {
        const selectedYear = parseInt(selectedDateParts[0], 10)
        const selectedMonth = parseInt(selectedDateParts[1], 10) - 1
        if (!isNaN(selectedYear) && !isNaN(selectedMonth)) {
          setCurrentMonth(new Date(selectedYear, selectedMonth, 1))
        }
      }
    }
  }, [selectedDate])

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (number | null)[] = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onDateSelect(dateString)
  }

  const formatDisplayDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return formatDisplayDate(currentMonth)
    const parts = dateString.split('-')
    if (parts.length !== 3) return formatDisplayDate(currentMonth)
    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className={`${dark ? 'bg-[#2B2B2B] border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'} rounded-lg shadow-lg p-4 border`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`${dark ? 'text-gray-100' : 'text-gray-800'} text-lg font-medium`}>
          {formatSelectedDate(selectedDate)}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateMonth('prev')}
            className={`${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} p-1 rounded`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigateMonth('next')}
            className={`${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} p-1 rounded`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-center text-sm font-medium py-2`}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-8"></div>
          }

          const currentDateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isSelected = selectedDate === currentDateString

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(day)}
              className={`h-8 w-8 flex items-center justify-center text-sm rounded-full transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : `${dark ? 'text-gray-200 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-100'}`
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function EditModal({ isOpen, onClose, type, editItem, onDelete, moeda }: EditModalProps) {
  const { theme } = useTheme()
  const dark = theme === 'escuro'

  const [name, setName] = useState(editItem.name)
  const [category, setCategory] = useState(editItem.category)
  const [value, setValue] = useState(editItem.value)
  const [recurring, setRecurring] = useState(editItem.recurring)
  const [date, setDate] = useState(editItem.date)
  const [date_vencimento, setDateVencimento] = useState('')
  const [categorias, setCategorias] = useState<CategoriaDespesa[]>([])
  const [fontes, setFontes] = useState<FonteReceita[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const [dateError, setDateError] = useState(false)
  const [showError, setShowError] = useState(false)
  const [confirmDeleteMode, setConfirmDeleteMode] = useState(false)
  const { user } = useAuth();
  const userCurrency = user?.moeda || "real";

  useEffect(() => {
    setName(editItem.name)
    setCategory(editItem.category)
    setValue(editItem.value)
    setRecurring(editItem.recurring)
    setDate(editItem.date)
    setDateVencimento('')
    setDateError(false)
    setShowError(false)
    setConfirmDeleteMode(false)
  }, [editItem])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (type === 'despesas') {
          const data = await categoriasDespesaService.getAll()
          setCategorias(data)
          if (editItem.category && editItem.category !== 'Sem categoria') {
            setCategory(editItem.category)
          }
        } else {
          const data = await fontesReceitaService.getAll()
          setFontes(data)
          if (editItem.category && editItem.category !== 'Sem fonte') {
            setCategory(editItem.category)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar opções:', error)
      }
    }

    if (isOpen) {
      fetchOptions()
    }
  }, [isOpen, type, editItem.category])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
  
    const number = parseInt(rawValue || "0", 10);
  
    if (!number) {
      setValue("");
      return;
    }
  
    const formatted = formatCurrency(number / 100, moeda);
  
    setValue(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (date === '') {
      setDateError(true);
      return
    }

    try {
      const symbol = getCurrencySymbol(moeda);

      const cleanValue = value
        .replace(symbol, '')           
        .replace(/\s*/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();

      const numericValue = parseFloat(cleanValue);


      if (isNaN(numericValue) || numericValue <= 0) {
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      if (type === 'despesas') {
        const categoryId = category ? categorias.find((cat) => cat.nome === category)?.id : undefined

        await despesasService.update(Number(editItem.id), {
          nome: name,
          valor: numericValue,
          recorrente: recurring,
          data: date,
          data_vencimento: date_vencimento || undefined,
          categoria_despesa_id: categoryId
        })
      } else {
        const fonteId = category ? fontes.find((fonte) => fonte.nome === category)?.id : undefined

        await receitasService.update(Number(editItem.id), {
          nome: name,
          valor: numericValue,
          recorrente: recurring,
          data: date,
          data_vencimento: date_vencimento || undefined,
          fonte_receita_id: fonteId
        })
      }

      onClose()
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className={`fixed right-0 top-0 h-full w-full max-w-md ${dark ? 'bg-[#2B2B2B] text-gray-100' : 'bg-white text-gray-800'} shadow-xl z-50 flex flex-col p-6 overflow-y-auto`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <AnimatePresence>
              {showError && (
                <motion.div
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl z-[60] flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Algo deu errado. Tente novamente.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
                {type === 'despesas' ? 'Alterar Despesa' : 'Alterar Receita'}
              </h2>
              <button onClick={onClose} className={`${dark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} p-1 rounded`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Nome</label>
                <input
                  type="text"
                  placeholder="Digite o nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full ${dark ? 'bg-[#3C3C3C] text-gray-100 placeholder-gray-400' : 'bg-gray-50 text-gray-700 placeholder-gray-500'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
                  {type === 'despesas' ? 'Categoria' : 'Fonte'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full ${dark ? 'bg-[#3C3C3C] text-gray-100' : 'bg-gray-50 text-gray-700'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none`}
                >
                  <option value="">{type === 'despesas' ? 'Selecione uma categoria' : 'Selecione uma fonte'}</option>
                  {type === 'despesas'
                    ? categorias.map((cat) => (
                        <option key={cat.id} value={cat.nome}>
                          {cat.nome}
                        </option>
                      ))
                    : fontes.map((fonte) => (
                        <option key={fonte.id} value={fonte.nome}>
                          {fonte.nome}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Valor</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder={getCurrencyPlaceholder(userCurrency)}
                    value={value}
                    onChange={handleValueChange}
                    className={`currency-input w-1/2 ${dark ? 'bg-[#3C3C3C] text-gray-100 placeholder-gray-400' : 'bg-gray-50 text-gray-700 placeholder-gray-500'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none`}
                    required
                  />
                  <label className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>Recorrente</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600"
                      checked={recurring}
                      onChange={(e) => setRecurring(e.target.checked)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Data</label>
                <Calendar
                  selectedDate={date}
                  onDateSelect={setDate}
                />
                {dateError && <p className="text-xs text-red-500 mt-1">A data é obrigatória</p>}
              </div>

              {recurring && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Data de Vencimento</label>
                  <Calendar
                    selectedDate={date_vencimento}
                    onDateSelect={setDateVencimento}
                  />
                </div>
              )}

              {!confirmDeleteMode && (
                <button
                  type="submit"
                  className={`w-full ${dark ? 'bg-gradient-to-r from-blue-800 to-indigo-700 hover:from-blue-700 hover:to-indigo-600' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2`}
                >
                  <Save className="w-4 h-4" />
                  Salvar {type === 'despesas' ? 'despesa' : 'receita'}
                </button>
              )}

              {onDelete && (
                <>
                  {confirmDeleteMode ? (
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteMode(false)}
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(editItem.id)
                          onClose()
                        }}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                      >
                        <Trash className="w-4 h-4" />
                        Confirmar Exclusão
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteMode(true)}
                      className="w-full mt-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <Trash className="w-4 h-4" />
                      Excluir {type === 'despesas' ? 'despesa' : 'receita'}
                    </button>
                  )}
                </>
              )}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
