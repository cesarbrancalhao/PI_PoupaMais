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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
)

interface MonthlyBalance {
  month: string
  balance: number
}

interface BalanceChartProps {
  data: MonthlyBalance[]
}

export default function BalanceChart({ data }: BalanceChartProps) {
  const [containerKey, setContainerKey] = useState(0)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setContainerKey(prev => prev + 1)
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Balanço',
        data: data.map(item => item.balance),
        backgroundColor: data.map(item =>
          item.balance >= 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(251, 146, 120, 0.8)'
        ),
        borderColor: data.map(item =>
          item.balance >= 0 ? 'rgba(59, 130, 246, 1)' : 'rgba(251, 146, 120, 1)'
        ),
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 10,
        left: 0
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.x ?? 0
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value)
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          callback: function(value) {
            const numValue = value as number
            if (Math.abs(numValue) >= 1000) {
              return `R$ ${(numValue / 1000).toFixed(0)}k`
            }
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(numValue)
          }
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div key={containerKey} className="relative w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  )
}
