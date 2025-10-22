'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CategoriaDespesa, FonteReceita } from '@/types'
import { categoriasDespesaService } from '@/services/categorias.service'
import { fontesReceitaService } from '@/services/fontes.service'
import { despesasService } from '@/services/despesas.service'
import { receitasService } from '@/services/receitas.service'

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
}

interface CalendarProps {
  selectedDate: string
  onDateSelect: (date: string) => void
}

function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
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
  
  const dayNames = ['S', 'S', 'M', 'T', 'W', 'T', 'F']
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
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
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-medium text-gray-800">
          {formatSelectedDate(selectedDate)}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateMonth('prev')}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigateMonth('next')}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-600 py-2">
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
                  : 'text-gray-700 hover:bg-gray-100'
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

export default function EditModal({ isOpen, onClose, type, editItem, onDelete }: EditModalProps) {
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

  useEffect(() => {
    setName(editItem.name)
    setCategory(editItem.category)
    setValue(editItem.value)
    setRecurring(editItem.recurring)
    setDate(editItem.date)
    setDateVencimento('')
    setDateError(false)
    setShowError(false)
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
    const rawValue = e.target.value.replace(/\D/g, '')
    const number = parseInt(rawValue || '0', 10)
    setValue(number ? (number / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log({
      name,
      category,
      value,
      recurring,
      date,
      date_vencimento
    })

    if (date === '') {
      setDateError(true);
      return
    }

    try {
      const numericValue = parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.'))

      if (isNaN(numericValue) || numericValue <= 0) {
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      if (type === 'despesas') {
        const categoryId = categorias.find((cat) => cat.nome === category)?.id
        if (!categoryId) {
          setShowError(true)
          setTimeout(() => setShowError(false), 3000)
          return
        }

        await despesasService.update(Number(editItem.id), {
          nome: name,
          valor: numericValue,
          recorrente: recurring,
          data: date,
          data_vencimento: date_vencimento || undefined,
          categoria_despesa_id: categoryId
        })
      } else {
        const fonteId = fontes.find((fonte) => fonte.nome === category)?.id
        if (!fonteId) {
          setShowError(true)
          setTimeout(() => setShowError(false), 3000)
          return
        }

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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col p-6 overflow-y-auto"
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
              <h2 className="text-lg font-semibold text-gray-800">
                {type === 'despesas' ? 'Alterar Despesa' : 'Alterar Receita'}
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Nome</label>
                <input
                  type="text"
                  placeholder="Digite o nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  {type === 'despesas' ? 'Categoria' : 'Fonte'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  required
                >
                  <option value="">Selecione uma {type === 'despesas' ? 'categoria' : 'fonte'}</option>
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
                <label className="block text-sm font-medium text-gray-800 mb-1">Valor</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="R$ 0,00"
                    value={value}
                    onChange={handleValueChange}
                    className="currency-input w-1/2 bg-gray-50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                    required
                  />
                  <label className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Recorrente</span>
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
                <label className="block text-sm font-medium text-gray-800 mb-1">Data</label>
                <Calendar
                  selectedDate={date}
                  onDateSelect={setDate}
                />
                {dateError && <p className="text-xs text-red-500 mt-1">A data é obrigatória</p>}
              </div>

              {recurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Data de Vencimento</label>
                  <Calendar
                    selectedDate={date_vencimento}
                    onDateSelect={setDateVencimento}
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Salvar {type === 'despesas' ? 'despesa' : 'receita'}
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(editItem.id)
                    onClose()
                  }}
                  className="mt-2 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Excluir {type === 'despesas' ? 'despesa' : 'receita'}
                </button>
              )}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
