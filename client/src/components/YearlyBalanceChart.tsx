'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
  Filler
} from 'chart.js'
import { useTheme } from '@/contexts/ThemeContext'
import { formatCurrency } from "@/app/terminology/currency"
import { Moeda } from "@/types/configs"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface YearlyBalanceData {
  month: string
  balance: number
  receitas: number
  despesas: number
}

interface YearlyBalanceChartProps {
  data: YearlyBalanceData[]
  moeda: Moeda
}

export default function YearlyBalanceChart({ data, moeda }: YearlyBalanceChartProps) {
  const [containerKey, setContainerKey] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === 'escuro'

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setContainerKey(prev => prev + 1), 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  const textColor = isDark ? '#f5f5f5' : '#1f2937'
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
  const tooltipBg = isDark ? '#2b2b2b' : '#ffffff'
  const tooltipText = isDark ? '#f5f5f5' : '#111111'

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Balanço',
        data: data.map(item => item.balance),
        borderColor: isDark ? 'rgba(96, 165, 250, 1)' : 'rgba(59, 130, 246, 1)',
        backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: isDark ? 'rgba(96, 165, 250, 1)' : 'rgba(59, 130, 246, 1)',
        pointBorderColor: isDark ? '#2b2b2b' : '#ffffff',
        pointBorderWidth: 2
      }
    ]
  }

  const options: ChartOptions<'line'> = {
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
          label: function (context) {
            const value = context.parsed.y ?? 0
            const formatted = formatCurrency(1, moeda)
            const symbol = formatted.replace(/[\d.,\s]/g, '')

            if (Math.abs(value) >= 1000) {
              const shortened = Math.round(value / 1000)
              return `Balanço: ${symbol} ${shortened}K`
            }

            return `Balanço: ${symbol} ${Math.round(value)}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: textColor,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: gridColor
        },
        ticks: {
          color: textColor,
          callback: (value) => {
            const num = value as number
            const formatted = formatCurrency(1, moeda)
            const symbol = formatted.replace(/[\d.,\s]/g, '')

            if (Math.abs(num) >= 1000) {
              const shortened = Math.round(num / 1000)
              return `${symbol} ${shortened}K`
            }

            return `${symbol} ${Math.round(num)}`
          }
        }
      }
    }
  }

  return (
    <div
      key={containerKey}
      className="relative w-full h-full"
    >
      <Line data={chartData} options={options} />
    </div>
  )
}
