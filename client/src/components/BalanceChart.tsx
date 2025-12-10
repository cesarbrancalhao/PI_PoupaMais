'use client'

import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { useTheme } from '@/contexts/ThemeContext'
import { formatCurrency } from "@/app/terminology/currency";
import { Moeda } from "@/types/auth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface MonthlyBalance {
  month: string
  balance: number
}

interface BalanceChartProps {
  data: MonthlyBalance[];
  moeda: Moeda;
}

export default function BalanceChart({ data, moeda }: BalanceChartProps) {
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

  const positiveBar = isDark
    ? 'rgba(96, 165, 250, 0.8)'
    : 'rgba(59, 130, 246, 0.8)'

  const positiveBorder = isDark
    ? 'rgba(147, 197, 253, 1)'
    : 'rgba(59, 130, 246, 1)'

  const negativeBar = isDark
    ? 'rgba(248, 113, 113, 0.8)'
    : 'rgba(251, 146, 120, 0.8)'

  const negativeBorder = isDark
    ? 'rgba(239, 68, 68, 1)'
    : 'rgba(251, 146, 120, 1)'

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Balanço',
        data: data.map(item => item.balance),
        backgroundColor: data.map(item =>
          item.balance >= 0 ? positiveBar : negativeBar
        ),
        borderColor: data.map(item =>
          item.balance >= 0 ? positiveBorder : negativeBorder
        ),
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
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
            const value = context.parsed.x ?? 0
            const formatted = formatCurrency(1, moeda)
            const symbol = formatted.replace(/[\d.,\s]/g, '')
            
            if (Math.abs(value) >= 1000) {
              const shortened = Math.round(value / 1000)
              return `${symbol} ${shortened}K`
            }
            
            return `${symbol} ${Math.round(value)}`
          }
        }
      }
    },

    scales: {
      x: {
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
      },

      y: {
        grid: { display: false },
        ticks: {
          color: textColor
        }
      }
    }
  }

  return (
    <div
      key={containerKey}
      className={`
        relative w-full h-full rounded-xl p-4 transition
        ${isDark ? 'bg-[var(--bg-card)]' : 'bg-white'}
      `}
    >
      <Bar data={chartData} options={options} />
    </div>
  )
}
