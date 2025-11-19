'use client'

import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
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

interface ExpenseData {
  category: string
  value: number
}

interface ExpenseDistributionChartProps {
  data: ExpenseData[]
  moeda: Moeda
}

export default function ExpenseDistributionChart({ data, moeda }: ExpenseDistributionChartProps) {
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

  const colors = [
    '#5B8FF9',
    '#F6BD60',
    '#F28B82',
    '#81C784',
    '#BA68C8',
    '#FFD54F'
  ]

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 0
      }
    ]
  }

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: isDark ? '#f5f5f5' : '#1f2937',
          padding: 10,
          font: {
            size: 11
          }
        }
      },

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
    <div
      key={containerKey}
      className="w-full h-full flex items-center justify-center"
    >
      <div className="w-full max-w-[250px] h-[250px]">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}
