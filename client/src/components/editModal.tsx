'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

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
  
  // Sync calendar month when selected date changes
  useEffect(() => {
    if (selectedDate) {
      const selectedDateParts = selectedDate.split('-')
      const selectedYear = parseInt(selectedDateParts[0])
      const selectedMonth = parseInt(selectedDateParts[1]) - 1
      setCurrentMonth(new Date(selectedYear, selectedMonth, 1))
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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
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
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }
  
  const days = getDaysInMonth(currentMonth)
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      {/* Header */}
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
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-8"></div>
          }
          
          // Check if this day is selected by comparing date strings
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
  const formRef = useRef<HTMLFormElement>(null)

  // Update form when editItem changes
  useEffect(() => {
    setName(editItem.name)
    setCategory(editItem.category)
    setValue(editItem.value)
    setRecurring(editItem.recurring)
    setDate(editItem.date)
  }, [editItem])

  // Format currency as user types
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '') // remove non-numbers
    const number = parseInt(rawValue || '0', 10)
    setValue(number ? currencyFormatter.format(number / 100) : '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = {
      id: editItem.id,
      name,
      category,
      value,
      recurring,
      date,
    }

    console.log('Updating item:', formData)
    // TODO: Call update API here
    
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col p-6 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {type === 'despesas' ? 'Alterar Despesa' : 'Alterar Receita'}
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
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

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option>Mercado</option>
                  <option>Eletrônicos</option>
                  <option>Roupas</option>
                  <option>Reforma</option>
                </select>
              </div>

              {/* Value & Recurring */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Valor</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="$0.00"
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

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Data</label>
                <Calendar
                  selectedDate={date}
                  onDateSelect={setDate}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Salvar {type === 'despesas' ? 'Despesa' : 'Receita'}
              </button>

              {/* Delete button */}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(editItem.id)
                    onClose()
                  }}
                  className="mt-2 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Excluir {type === 'despesas' ? 'Despesa' : 'Receita'}
                </button>
              )}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
