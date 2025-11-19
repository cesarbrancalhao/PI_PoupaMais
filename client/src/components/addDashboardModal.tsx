'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CategoriaDespesa, FonteReceita } from '@/types'
import { categoriasDespesaService } from '@/services/categorias.service'
import { fontesReceitaService } from '@/services/fontes.service'
import { despesasService } from '@/services/despesas.service'
import { receitasService } from '@/services/receitas.service'
import { useTheme } from '@/contexts/ThemeContext'
import { getCurrencySymbol } from "@/app/terminology/currency";
import { useAuth } from "@/contexts/AuthContext";

interface AddDashboardModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'despesas' | 'receitas'
}

interface CalendarProps {
  selectedDate: string
  onDateSelect: (date: string) => void
}

function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { theme } = useTheme()
  const isDark = theme === 'escuro'
  
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
  
  const days = getDaysInMonth(currentMonth)
  
  return (
    <div
      className={`
        rounded-lg p-4 border shadow-lg transition-colors
        ${isDark
          ? 'bg-[var(--bg-card)] border-gray-700 text-gray-200'
          : 'bg-white border-gray-200 text-gray-800'
        }
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">
          {selectedDate
            ? selectedDate.split('-').reverse().join('/')
            : new Date().toISOString().slice(0, 10).split('-').reverse().join('/')}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateMonth('prev')}
            className={`
              p-1 rounded transition
              ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}
            `}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigateMonth('next')}
            className={`
              p-1 rounded transition
              ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}
            `}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className={`text-center text-sm font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
          >
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
                    : isDark
                      ? 'text-gray-200 hover:bg-white/10'
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

export default function AddDashboardModal({ isOpen, onClose, type }: AddDashboardModalProps) {
  const { theme } = useTheme()
  const isDark = theme === 'escuro'
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [value, setValue] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [date, setDate] = useState('')
  const [date_vencimento, setDateVencimento] = useState('')
  const [categorias, setCategorias] = useState<CategoriaDespesa[]>([])
  const [fontes, setFontes] = useState<FonteReceita[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const [dateError, setDateError] = useState(false)
  const [showError, setShowError] = useState(false)
  const { user } = useAuth();
  const userCurrency = user?.moeda || "real";

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setCategory('')
      setValue('')
      setRecurring(false)
      setDate('')
      setDateVencimento('')
      setDateError(false)
      setShowError(false)
    }
  }, [isOpen])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (type === 'despesas') {
          const data = await categoriasDespesaService.getAll()
          setCategorias(data)
        } else {
          const data = await fontesReceitaService.getAll()
          setFontes(data)
        }
      } catch (error) {
        console.error('Erro ao buscar opções:', error)
      }
    }

    if (isOpen) {
      fetchOptions()
    }
  }, [isOpen, type])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const number = parseInt(raw || "0", 10);
  
    if (!number) {
      setValue("");
      return;
    }
  
    const float = number / 100;
    setValue(float.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (date === '') {
      setDateError(true);
      return
    }

    try {
      const cleaned = value.replace(/[^\d.,]/g, "");

      let numericValue = 0;

      if (userCurrency === "real" || userCurrency === "euro") {
        numericValue = parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
      } else {
        numericValue = parseFloat(cleaned.replace(/,/g, ""));
      }

      if (isNaN(numericValue)) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      if (type === 'despesas') {
        const categoryId = category ? categorias.find((cat) => cat.nome === category)?.id : undefined

        await despesasService.create({
          nome: name,
          valor: numericValue,
          recorrente: recurring,
          data: date,
          data_vencimento: date_vencimento || undefined,
          categoria_despesa_id: categoryId
        })
      } else {
        const fonteId = category ? fontes.find((fonte) => fonte.nome === category)?.id : undefined

        await receitasService.create({
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
      console.error('Erro ao criar:', error)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }
  }

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
            className={`
              fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col p-6
              overflow-y-auto shadow-xl transition-colors
              ${isDark ? 'bg-[var(--bg-card)] text-[var(--text-main)]' : 'bg-white text-gray-800'}
            `}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <AnimatePresence>
              {showError && (
                <motion.div
                  className={`
                    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    px-6 py-4 rounded-lg shadow-2xl z-[60] flex items-center gap-3
                    ${isDark ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}
                  `}
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
              <h2 className="text-lg font-semibold">
                {type === 'despesas' ? 'Adicionar Despesa' : 'Adicionar Receita'}
              </h2>
              <button
                className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <input
                  type="text"
                  placeholder="Digite o nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`
                    w-full rounded-lg px-3 py-2 mt-1 outline-none transition
                    ${isDark 
                      ? 'bg-[#3C3C3C] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400'
                      : 'bg-gray-50 text-gray-700 placeholder-gray-600 focus:ring-2 focus:ring-blue-500'}
                  `}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  {type === 'despesas' ? 'Categoria' : 'Fonte'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`
                    w-full rounded-lg px-3 py-2 mt-1 outline-none transition
                    ${isDark
                      ? 'bg-[#3C3C3C] text-white border border-gray-700 focus:ring-blue-400'
                      : 'bg-gray-50 text-gray-700 border border-gray-300 focus:ring-blue-500'}
                  `}
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
                <label className="block text-sm font-medium">Valor</label>
                <div className="flex items-center gap-4">
                  <div className={`
                    w-1/2 mt-1 flex items-center rounded-lg overflow-hidden
                    ${isDark ? 'bg-[#3C3C3C]' : 'bg-gray-50'}
                  `}>
                    <span className={`
                      px-3 py-2 font-medium
                      ${isDark ? 'text-gray-400' : 'text-gray-600'}
                    `}>
                      {getCurrencySymbol(userCurrency)}
                    </span>
                    <input
                      type="text"
                      placeholder="0,00"
                      value={value}
                      onChange={handleValueChange}
                      className={`
                        flex-1 px-3 py-2 outline-none transition bg-transparent
                        ${isDark
                          ? 'text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400'
                          : 'text-gray-700 placeholder-gray-600 focus:ring-2 focus:ring-blue-500'}
                      `}
                      required  
                    />
                  </div>
                <label className="ml-4 text-sm flex items-center gap-2">
                  <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                    Recorrente
                  </span>
                    <input
                      type="checkbox"
                      checked={recurring}
                      onChange={(e) => setRecurring(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Data</label>
                <Calendar
                  selectedDate={date}
                  onDateSelect={setDate}
                />
                {dateError && <p className="text-xs text-red-500 mt-1">A data é obrigatória</p>}
              </div>

              {recurring && (
                <div>
                  <label className="text-sm font-medium">Data de Vencimento</label>
                  <Calendar
                    selectedDate={date_vencimento}
                    onDateSelect={setDateVencimento}
                  />
                </div>
              )}

              <button
                type="submit"
                className={`
                  w-full py-2 mt-4 rounded-lg font-medium flex items-center justify-center gap-2 transition text-white
                  ${isDark
                    ? 'bg-gradient-to-r from-blue-800 to-indigo-700 hover:from-blue-700 hover:to-indigo-600'
                    : 'bg-blue-600 hover:bg-blue-700'}
                `}
              >
                <Save className="w-4 h-4" />
                Salvar {type === 'despesas' ? 'despesa' : 'receita'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
