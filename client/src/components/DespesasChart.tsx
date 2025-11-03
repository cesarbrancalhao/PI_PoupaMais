'use client'

import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface CategoryData {
  category: string
  value: number
  color: string
}

interface DespesasChartProps {
  data: CategoryData[]
}

export default function DespesasChart({ data }: DespesasChartProps) {
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
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value)
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Despesas</h2>
      <div key={containerKey} className="flex-1 flex items-center justify-center mb-4">
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
            <span className="text-xs text-gray-600">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
