'use client'

import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { useTheme } from '@/contexts/ThemeContext'
import { formatCurrency } from "@/app/terminology/currency"
import { Moeda } from "@/types/configs"

ChartJS.register(ArcElement, Tooltip, Legend)

interface CategoryData {
  category: string
  value: number
  color: string
}

interface DespesasChartProps {
  data: CategoryData[]
  moeda: Moeda
}

export default function DespesasChart({ data, moeda }: DespesasChartProps) {
  const [containerKey, setContainerKey] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === 'escuro'

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => setContainerKey(prev => prev + 1),
        150
      )
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  const tooltipBg = isDark ? '#2b2b2b' : '#ffffff'
  const tooltipText = isDark ? '#f5f5f5' : '#111111'

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderWidth: 0,
        cutout: '75%',
      }
    ]
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },

      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: isDark ? '#444' : '#ddd',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label(context) {
            const value = context.parsed
            return formatCurrency(value, moeda)
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <h2
        className={`text-base md:text-lg font-semibold mb-4 transition-colors ${
          isDark ? 'text-gray-100' : 'text-gray-800'
        }`}
      >
        Despesas por Categoria
      </h2>

      <div
        key={containerKey}
        className="flex-1 flex items-center justify-center mb-4"
      >
        <div className="w-full max-w-[200px] h-[200px]">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span
              className={`text-xs transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
