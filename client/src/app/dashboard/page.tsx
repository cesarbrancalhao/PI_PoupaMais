'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar'
import AddModal from '@/components/addModal'
import EditModal from '@/components/editModal'
import { Home, Plug, Shirt, DollarSign, ShoppingCart } from 'lucide-react'
import { Despesa, Receita, CategoriaDespesa, FonteReceita } from '@/types'
import { despesasService, receitasService } from '@/services'
import { categoriasDespesaService } from '@/services/categorias.service'
import { fontesReceitaService } from '@/services/fontes.service'

interface TableRow {
  id: string
  date: string
  name: string
  category: string
  value: string
  saldo: string
  recurring: boolean
  icon: React.ReactNode
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'despesas' | 'receitas'>('despesas')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TableRow | null>(null)
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [categorias, setCategorias] = useState<CategoriaDespesa[]>([])
  const [fontes, setFontes] = useState<FonteReceita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [despesasResponse, receitasResponse, categoriasResponse, fontesResponse] = await Promise.all([
        despesasService.getAll(1, 100),
        receitasService.getAll(1, 100),
        categoriasDespesaService.getAll(),
        fontesReceitaService.getAll()
      ])
      
      const despesasData = Array.isArray(despesasResponse)
        ? despesasResponse
        : (despesasResponse?.data || [])
      const receitasData = Array.isArray(receitasResponse)
        ? receitasResponse
        : (receitasResponse?.data || [])

      setDespesas(despesasData)
      setReceitas(receitasData)
      setCategorias(categoriasResponse)
      setFontes(fontesResponse)
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
      setError('Erro ao carregar dados. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    fetchData()
  }

  const openEditModal = (item: TableRow) => {
    setSelectedItem(item)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    try {
      if (activeTab === 'despesas') {
        await despesasService.delete(Number(id))
      } else {
        await receitasService.delete(Number(id))
      }
      fetchData()
    } catch (err) {
      console.error('Erro ao excluir item:', err)
      alert('Erro ao excluir item')
    }
  }

  const convertDateForEditModal = (dateStr: string) => {
    const [day, month] = dateStr.split('/')
    const currentYear = new Date().getFullYear()
    return `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${day}/${month}`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getIcon = (index: number, isReceita: boolean) => {
    const icons = [
      <Home className={`w-4 h-4 md:w-5 md:h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="home" />,
      <Plug className={`w-4 h-4 md:w-5 md:h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="plug" />,
      <Shirt className={`w-4 h-4 md:w-5 md:h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="shirt" />,
      <ShoppingCart className={`w-4 h-4 md:w-5 md:h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="cart" />,
      <DollarSign className={`w-4 h-4 md:w-5 md:h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="dollar" />
    ]
    return icons[index % icons.length]
  }

  const calculateSaldo = (items: (Despesa | Receita)[], currentIndex: number, isReceita: boolean) => {
    let saldo = 0
    for (let i = items.length - 1; i >= currentIndex; i--) {
      if (isReceita) {
        saldo += items[i].valor
      } else {
        saldo -= items[i].valor
      }
    }
    return saldo
  }

  const despesasRows: TableRow[] = (despesas ?? []).map((despesa, index) => {
    const categoria = categorias.find(c => c.id === despesa.categoria_despesa_id)
    return {
      id: despesa?.id?.toString?.() ?? '',
      date: despesa?.data ? formatDate(despesa.data) : '--/--',
      name: despesa?.nome ?? '',
      category: categoria?.nome ?? 'Sem categoria',
      value: despesa?.valor != null ? formatCurrency(despesa.valor) : 'R$ 0,00',
      saldo: formatCurrency(Math.abs(calculateSaldo(despesas ?? [], index, false))),
      recurring: despesa?.recorrente ?? false,
      icon: getIcon?.(index, false) ?? null
    }
  })

  const receitasRows: TableRow[] = (receitas ?? []).map((receita, index) => {
    const fonte = fontes.find(f => f.id === receita.fonte_receita_id)
    return {
      id: receita?.id?.toString?.() ?? '',
      date: receita?.data ? formatDate(receita.data) : '--/--',
      name: receita?.nome ?? '',
      category: fonte?.nome ?? 'Sem fonte',
      value: receita?.valor != null ? formatCurrency(receita.valor) : 'R$ 0,00',
      saldo: formatCurrency(calculateSaldo(receitas ?? [], index, true)),
      recurring: receita?.recorrente ?? false,
      icon: getIcon?.(index, true) ?? null
    }
  })

  const totalReceitas = (receitas ?? []).reduce((sum, r) => sum + (parseFloat(r.valor as unknown as string) || 0), 0)
  const totalDespesas = (despesas ?? []).reduce((sum, d) => sum + (parseFloat(d.valor as unknown as string) || 0), 0)

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <div className="text-gray-500">Carregando...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 text-center md:text-left">Painel</h1>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-48"
            >
              <option value="">03-2025</option>
            </select>
            <button
              onClick={openModal}
              className="bg-blue-600 text-white px-4 py-2 font-medium rounded-md text-sm hover:bg-blue-700 transition w-full md:w-48 whitespace-nowrap"
            >
              + Adicionar
            </button>
          </div>
        </header>

        <div className="relative flex bg-white rounded-lg w-fit mb-6 md:mb-8">
          <div className={`absolute top-0 h-full bg-blue-600 rounded-lg transition-all duration-200 ease-in-out ${
            activeTab === 'despesas' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
          }`}></div>
          <button 
            onClick={() => setActiveTab('despesas')}
            className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'despesas' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Despesas
          </button>
          <button 
            onClick={() => setActiveTab('receitas')}
            className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'receitas' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Receitas
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 md:gap-6">
          <div className="w-full xl:w-4/6 flex flex-col gap-4 md:gap-6">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs md:text-sm">Receitas</p>
                    <p className="text-lg md:text-2xl font-semibold">{formatCurrency(totalReceitas)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Despesas</p>
                      <p className="text-lg md:text-2xl font-semibold">{formatCurrency(totalDespesas)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">{activeTab === 'despesas' ? 'Últimas despesas' : 'Últimas receitas'}</h2>
                <a href="#" className="text-indigo-600 text-xs md:text-sm">Ver mais</a>
              </div>
              
              <div className="md:hidden">
                <div className="grid grid-cols-4 gap-2 pb-2 mb-2 border-b border-gray-200 text-xs text-gray-500 font-medium">
                  <div>Data</div>
                  <div className="col-span-2">Nome</div>
                  <div className="text-right">Valor</div>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {(activeTab === 'despesas' ? despesasRows : receitasRows).slice(0, 10).map((row, idx) => (
                    <div 
                      key={idx}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer grid grid-cols-4 gap-2 items-center"
                      onClick={() => openEditModal(row)}
                    >
                      <div className="text-xs font-medium">{row.date}</div>
                      <div className="col-span-2 flex items-center gap-2 min-w-0">
                        <span className="flex-shrink-0">{row.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{row.name}</div>
                          <div className="text-xs text-gray-500 truncate">{row.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{row.value}</div>
                        <div className="text-xs text-green-600">{row.saldo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs md:text-sm table-fixed min-w-[500px]">
                  <thead className="text-gray-500">
                    <tr>
                      <th className="py-1 md:py-2 font-medium text-left w-16 pl-3 md:pl-4">Data</th>
                      <th className="py-1 md:py-2 font-medium text-left w-1/3">Nome</th>
                      <th className="py-1 md:py-2 font-medium text-left w-24">Valor</th>
                      <th className="py-1 md:py-2 font-medium text-left w-1/4">{activeTab === 'despesas' ? 'Categoria' : 'Fonte'}</th>
                      <th className="py-1 md:py-2 font-medium text-left w-24">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {(activeTab === 'despesas' ? despesasRows : receitasRows).map((row, idx) => (
                      <tr 
                        key={idx} 
                        className="odd:bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => openEditModal(row)}
                      >
                        <td className="py-2 md:py-3 pl-3 md:pl-4 align-middle">{row.date}</td>
                        <td className="py-2 md:py-3 align-middle">
                          <div className="flex items-center gap-1 md:gap-2">
                            <span className="flex-shrink-0">{row.icon}</span>
                            <span className="truncate text-xs md:text-sm">{row.name}</span>
                          </div>
                        </td>
                        <td className="py-2 md:py-3 align-middle text-xs md:text-sm">{row.value}</td>
                        <td className="py-2 md:py-3 align-middle truncate text-xs md:text-sm">{row.category}</td>
                        <td className="py-2 md:py-3 align-middle text-green-600 text-xs md:text-sm">{row.saldo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          
          <div className="w-full xl:w-2/6 flex flex-col gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm flex flex-col justify-center items-center text-gray-400 min-h-[200px] md:min-h-[300px]">
              Gráfico: Balanço Mensal
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm flex justify-center items-center text-gray-400 min-h-[200px] md:min-h-[300px]">
              {activeTab === 'despesas' ? 'Gráfico: Despesas' : 'Gráfico: Receitas'}
            </div>
          </div>
        </div>
      </main>

      <AddModal isOpen={isModalOpen} onClose={closeModal} type={activeTab} />
      
      {selectedItem && (
        <EditModal 
          isOpen={isEditModalOpen} 
          onClose={closeEditModal} 
          type={activeTab}
          editItem={{
            id: selectedItem.id,
            name: selectedItem.name,
            category: selectedItem.category,
            value: selectedItem.value,
            recurring: selectedItem.recurring,
            date: convertDateForEditModal(selectedItem.date)
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}