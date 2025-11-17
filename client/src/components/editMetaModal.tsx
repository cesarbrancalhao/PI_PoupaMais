'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Save, Trash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { metasService } from '@/services/metas.service'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, getCurrencySymbol } from '@/app/terminology/currency'

interface EditMetaModalProps {
  isOpen: boolean
  onClose: () => void
  editItem: {
    id: number
    nome: string
    descricao?: string
    valor: number
    economia_mensal?: number
    data_inicio: string
    data_alvo?: string
  }
  onDelete?: (id: number) => void
}

interface MonthYearPickerProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  minDate?: string
  isDark?: boolean
}

function MonthYearPicker({ selectedDate, onDateSelect, minDate, isDark }: MonthYearPickerProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    if (selectedDate) {
      const selectedDateParts = selectedDate.split('-')
      if (selectedDateParts.length === 3) {
        const selectedYear = parseInt(selectedDateParts[0], 10)
        if (!isNaN(selectedYear)) {
          setCurrentYear(selectedYear)
        }
      }
    }
  }, [selectedDate])

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => direction === 'prev' ? prev - 1 : prev + 1)
  }

  const isMonthBeforeMinDate = (year: number, month: number): boolean => {
    if (!minDate) return false

    const minDateParts = minDate.split('-')
    if (minDateParts.length !== 3) return false

    const minYear = parseInt(minDateParts[0])
    const minMonth = parseInt(minDateParts[1])

    if (year < minYear) return true
    if (year === minYear && month < minMonth) return true

    return false
  }

  const handleMonthClick = (monthIndex: number) => {
    if (isMonthBeforeMinDate(currentYear, monthIndex + 1)) {
      return
    }

    const dateString = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-01`
    onDateSelect(dateString)
  }

  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return 'Selecione mês/ano'
    const parts = dateString.split('-')
    if (parts.length !== 3) return 'Selecione mês/ano'
    const [year, month] = parts
    const monthIndex = parseInt(month) - 1
    return `${months[monthIndex]} ${year}`
  }

  const getSelectedMonth = () => {
    if (!selectedDate) return -1
    const parts = selectedDate.split('-')
    if (parts.length !== 3) return -1
    const [year, month] = parts
    if (parseInt(year) === currentYear) {
      return parseInt(month) - 1
    }
    return -1
  }

  const selectedMonth = getSelectedMonth()

  return (
    <div className={`rounded-lg shadow-lg p-4 border ${
      isDark 
        ? 'bg-[var(--bg-card)] border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-lg font-medium ${
          isDark ? 'text-[var(--text-main)]' : 'text-gray-800'
        }`}>
          {formatSelectedDate(selectedDate)}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateYear('prev')}
            className={`p-1 ${
              isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`text-sm font-medium min-w-[60px] text-center ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {currentYear}
          </span>
          <button
            type="button"
            onClick={() => navigateYear('next')}
            className={`p-1 ${
              isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => {
          const isSelected = selectedMonth === index
          const isDisabled = isMonthBeforeMinDate(currentYear, index + 1)

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleMonthClick(index)}
              disabled={isDisabled}
              className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                isDisabled
                  ? isDark 
                    ? 'text-gray-600 cursor-not-allowed bg-gray-800' 
                    : 'text-gray-300 cursor-not-allowed bg-gray-50'
                  : isSelected
                  ? 'bg-blue-600 text-white font-medium'
                  : isDark
                  ? 'text-gray-200 hover:bg-white/10 font-medium'
                  : 'text-gray-700 hover:bg-gray-100 font-medium'
              }`}
            >
              {month}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function EditMetaModal({ isOpen, onClose, editItem, onDelete }: EditMetaModalProps) {
  const { theme } = useTheme()
  const isDark = theme === 'escuro'
  const { user } = useAuth()
  const userCurrency = user?.moeda || 'real'
  
  const normalizeDateString = (dateString: string): string => {
    if (!dateString) return ''

    if (dateString.length === 10 && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString
    }

    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    return dateString
  }

  const formatValueWithoutSymbol = useCallback((value: number) => {
    if (userCurrency === 'real' || userCurrency === 'euro') {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else {
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }, [userCurrency])

  const [nome, setNome] = useState(editItem.nome)
  const [descricao, setDescricao] = useState(editItem.descricao || '')
  const [valor, setValor] = useState(formatValueWithoutSymbol(Number(editItem.valor)))
  const [economiaMensal, setEconomiaMensal] = useState('')
  const [dataInicio, setDataInicio] = useState(normalizeDateString(editItem.data_inicio))
  const [dataAlvo, setDataAlvo] = useState(normalizeDateString(editItem.data_alvo || ''))
  const [goalType, setGoalType] = useState<'monthly' | 'deadline' | null>(
    editItem.data_alvo ? 'deadline' : editItem.economia_mensal ? 'monthly' : null
  )
  const formRef = useRef<HTMLFormElement>(null)
  const [showError, setShowError] = useState(false)
  const [confirmDeleteMode, setConfirmDeleteMode] = useState(false)

  useEffect(() => {
    setNome(editItem.nome)
    setDescricao(editItem.descricao || '')
    setValor(formatValueWithoutSymbol(Number(editItem.valor)))
    setDataInicio(normalizeDateString(editItem.data_inicio))
    setDataAlvo(normalizeDateString(editItem.data_alvo || ''))
    setShowError(false)
    setConfirmDeleteMode(false)

    if (editItem.data_alvo) {
      setGoalType('deadline')
      setEconomiaMensal('')
    } else if (editItem.economia_mensal) {
      setGoalType('monthly')
      setEconomiaMensal(formatValueWithoutSymbol(Number(editItem.economia_mensal)))
    } else {
      setGoalType(null)
      setEconomiaMensal('')
    }
  }, [editItem, userCurrency, formatValueWithoutSymbol])

  useEffect(() => {
    if (dataInicio && dataAlvo && goalType === 'deadline') {
      const inicioParts = dataInicio.split('-')
      const alvoParts = dataAlvo.split('-')

      if (inicioParts.length === 3 && alvoParts.length === 3) {
        const inicioDate = new Date(parseInt(inicioParts[0]), parseInt(inicioParts[1]) - 1, parseInt(inicioParts[2]))
        const alvoDate = new Date(parseInt(alvoParts[0]), parseInt(alvoParts[1]) - 1, parseInt(alvoParts[2]))

        inicioDate.setHours(0, 0, 0, 0)
        alvoDate.setHours(0, 0, 0, 0)

        if (alvoDate < inicioDate) {
          setDataAlvo('')
        }
      }
    }
  }, [dataInicio, dataAlvo, goalType])

  const handleGoalTypeChange = (type: 'monthly' | 'deadline') => {
    setGoalType(type)
    if (type === 'monthly') {
      setDataAlvo('')
    } else {
      setEconomiaMensal('')
    }
  }

  const calculateMonthsNeeded = (): number | null => {
    if (goalType !== 'monthly' || !valor || !economiaMensal) return null

    const cleanValor = valor.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim()
    const numericValor = parseFloat(cleanValor)

    const cleanEconomiaMensal = economiaMensal.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim()
    const numericEconomiaMensal = parseFloat(cleanEconomiaMensal)

    if (isNaN(numericValor) || numericValor <= 0 || isNaN(numericEconomiaMensal) || numericEconomiaMensal <= 0) {
      return null
    }

    return Math.ceil(numericValor / numericEconomiaMensal)
  }

  const calculateMonthlySavingsNeeded = (): number | null => {
    if (goalType !== 'deadline' || !valor || !dataInicio || !dataAlvo) return null

    const cleanValor = valor.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim()
    const numericValor = parseFloat(cleanValor)

    if (isNaN(numericValor) || numericValor <= 0) return null

    const inicioParts = dataInicio.split('-')
    const alvoParts = dataAlvo.split('-')

    if (inicioParts.length !== 3 || alvoParts.length !== 3) return null

    const inicioDate = new Date(parseInt(inicioParts[0]), parseInt(inicioParts[1]) - 1, parseInt(inicioParts[2]))
    const alvoDate = new Date(parseInt(alvoParts[0]), parseInt(alvoParts[1]) - 1, parseInt(alvoParts[2]))

    if (isNaN(inicioDate.getTime()) || isNaN(alvoDate.getTime())) return null

    const monthsDiff = (alvoDate.getFullYear() - inicioDate.getFullYear()) * 12 + (alvoDate.getMonth() - inicioDate.getMonth())

    if (monthsDiff <= 0) return null

    return numericValor / monthsDiff
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    const number = parseInt(rawValue || '0', 10)
    
    if (!number) {
      setter('')
      return
    }
    
    const float = number / 100
    if (userCurrency === 'real' || userCurrency === 'euro') {
      setter(float.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    } else {
      setter(float.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const cleanValor = valor.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim()
      const numericValor = parseFloat(cleanValor)

      const cleanEconomiaMensal = economiaMensal ? economiaMensal.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim() : '0'
      const numericEconomiaMensal = parseFloat(cleanEconomiaMensal)

      if (isNaN(numericValor) || numericValor <= 0) {
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      if (goalType === 'monthly' && (!economiaMensal || numericEconomiaMensal <= 0)) {
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      if (goalType === 'deadline' && !dataAlvo) {
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      let economiaMensalToSave: number | undefined = undefined

      if (goalType === 'monthly' && numericEconomiaMensal > 0) {
        economiaMensalToSave = numericEconomiaMensal
      } else if (goalType === 'deadline' && dataAlvo) {
        const calculatedSavings = calculateMonthlySavingsNeeded()
        if (calculatedSavings !== null && calculatedSavings > 0) {
          economiaMensalToSave = calculatedSavings
        }
      }

      await metasService.update(editItem.id, {
        nome,
        descricao: descricao || undefined,
        valor: numericValor,
        economia_mensal: economiaMensalToSave,
        data_inicio: dataInicio || undefined,
        data_alvo: goalType === 'deadline' && dataAlvo ? dataAlvo : undefined,
      })

      onClose()
    } catch (error) {
      console.error('Erro ao atualizar meta:', error)
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
            className={`fixed right-0 top-0 h-full w-full max-w-md shadow-xl z-50 flex flex-col p-6 overflow-y-auto ${
              isDark ? 'bg-[var(--bg-card)] text-[var(--text-main)]' : 'bg-white text-gray-800'
            }`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <AnimatePresence>
              {showError && (
                <motion.div
                  className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white px-6 py-4 rounded-lg shadow-2xl z-[60] flex items-center gap-3 ${
                    isDark ? 'bg-red-600' : 'bg-red-500'
                  }`}
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
              <h2 className={`text-lg font-semibold ${
                isDark ? 'text-[var(--text-main)]' : 'text-gray-800'
              }`}>Alterar Meta</h2>
              <button onClick={onClose} className={isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-[var(--text-main)]' : 'text-gray-800'
                }`}>Nome</label>
                <input
                  type="text"
                  placeholder="Nome da meta"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
                    isDark 
                      ? 'bg-[#3C3C3C] text-white placeholder-gray-400' 
                      : 'bg-gray-50 text-gray-700 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-[var(--text-main)]' : 'text-gray-800'
                }`}>Descrição</label>
                <textarea
                  placeholder="Descrição da meta"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none ${
                    isDark 
                      ? 'bg-[#3C3C3C] text-white placeholder-gray-400' 
                      : 'bg-gray-50 text-gray-700 placeholder-gray-500'
                  }`}
                  rows={3}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-[var(--text-main)]' : 'text-gray-800'
                }`}>Valor total</label>
                <div className={`
                  flex items-center rounded-lg overflow-hidden
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
                    value={valor}
                    onChange={(e) => handleValueChange(e, setValor)}
                    className={`
                      flex-1 px-3 py-2 outline-none transition bg-transparent
                      ${isDark 
                        ? 'text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400' 
                        : 'text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500'}
                    `}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-[var(--text-main)]' : 'text-gray-800'
                }`}>Definir meta por:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="goalType"
                      value="monthly"
                      checked={goalType === 'monthly'}
                      onChange={() => handleGoalTypeChange('monthly')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>Economia mensal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="goalType"
                      value="deadline"
                      checked={goalType === 'deadline'}
                      onChange={() => handleGoalTypeChange('deadline')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>Data final</span>
                  </label>
                </div>
                {goalType === 'monthly' && (() => {
                  const months = calculateMonthsNeeded()
                  return months !== null ? (
                    <p className="mt-3 text-sm font-bold text-blue-600">
                      Você precisará de {months} {months === 1 ? 'mês' : 'meses'} para alcançar sua meta.
                    </p>
                  ) : null
                })()}
                {goalType === 'deadline' && (() => {
                  const monthlySavings = calculateMonthlySavingsNeeded()
                  return monthlySavings !== null ? (
                    <p className="mt-3 text-sm font-bold text-blue-600">
                      Você precisará economizar {formatCurrency(monthlySavings, userCurrency)} por mês para alcançar sua meta.
                    </p>
                  ) : null
                })()}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-[var(--text-main)]' : 'text-gray-800'
                }`}>Data de início</label>
                <MonthYearPicker
                  selectedDate={dataInicio}
                  onDateSelect={setDataInicio}
                  isDark={isDark}
                />
              </div>

              {goalType === 'monthly' && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-[var(--text-main)]' : 'text-gray-800'
                  }`}>Economia mensal</label>
                  <div className={`
                    flex items-center rounded-lg overflow-hidden
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
                      value={economiaMensal}
                      onChange={(e) => handleValueChange(e, setEconomiaMensal)}
                      className={`
                        flex-1 px-3 py-2 outline-none transition bg-transparent
                        ${isDark 
                          ? 'text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400' 
                          : 'text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500'}
                      `}
                      required
                    />
                  </div>
                </div>
              )}

              {goalType === 'deadline' && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-[var(--text-main)]' : 'text-gray-800'
                  }`}>Data final</label>
                  <MonthYearPicker
                    selectedDate={dataAlvo}
                    onDateSelect={setDataAlvo}
                    minDate={dataInicio}
                    isDark={isDark}
                  />
                </div>
              )}

              {!confirmDeleteMode && (
                <button
                  type="submit"
                  className={`w-full mt-4 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    isDark 
                      ? 'bg-gradient-to-r from-blue-800 to-indigo-700 hover:from-blue-700 hover:to-indigo-600' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Salvar meta
                </button>
              )}

              {onDelete && (
                <>
                  {confirmDeleteMode ? (
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteMode(false)}
                        className={`flex-1 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                          isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-600'
                        }`}
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
                        className={`flex-1 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                          isDark ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
                        }`}
                      >
                        <Trash className="w-4 h-4" />
                        Confirmar Exclusão
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteMode(true)}
                      className={`w-full mt-2 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                        isDark ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      <Trash className="w-4 h-4" />
                      Excluir meta
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
