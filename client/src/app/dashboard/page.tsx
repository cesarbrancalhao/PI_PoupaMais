'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('despesas')
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Painel</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">+ Adicionar</button>
        </header>

        <div className="relative flex bg-white rounded-lg mb-8 w-fit">
          <div className={`absolute top-0 h-full bg-blue-600 rounded-lg transition-all duration-200 ease-in-out ${
            activeTab === 'despesas' 
              ? 'left-0 w-1/2' 
              : 'left-1/2 w-1/2'
          }`}></div>
          <button 
            onClick={() => setActiveTab('despesas')}
            className={`relative z-10 px-8 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'despesas' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Despesas
          </button>
          <button 
            onClick={() => setActiveTab('receitas')}
            className={`relative z-10 px-8 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'receitas' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Receitas
          </button>
        </div>

        <section className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Receitas</p>
                <p className="text-2xl font-semibold">3300,00</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Despesas</p>
                  <p className="text-2xl font-semibold">2348,88</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-xs text-red-500">+100 da média</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-center items-center text-gray-400">
            Gráfico: Balanço Mensal
          </div>
        </section>

        <section className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Últimas despesas</h2>
              <a href="#" className="text-indigo-600 text-sm">Ver mais</a>
            </div>

            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2">Data</th>
                  <th>Nome</th>
                  <th>Valor</th>
                  <th>Categoria</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">15/03</td>
                  <td>Detergente</td>
                  <td>R$ 16,90</td>
                  <td>Mercado</td>
                  <td className="text-green-600">R$2837,50</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">15/03</td>
                  <td>Carregador iPad</td>
                  <td>R$ 36,90</td>
                  <td>Eletrônicos</td>
                  <td className="text-green-600">R$2854,40</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">15/03</td>
                  <td>Fone Bluetooth</td>
                  <td>R$ 80,90</td>
                  <td>Eletrônicos</td>
                  <td className="text-green-600">R$2891,30</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">14/03</td>
                  <td>Meia curta</td>
                  <td>R$ 10,90</td>
                  <td>Roupas</td>
                  <td className="text-green-600">R$2989,10</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm flex justify-center items-center text-gray-400">
            Gráfico: Despesas
          </div>
        </section>
      </main>
    </div>
  )
}
