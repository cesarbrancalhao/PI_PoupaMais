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
      // Handle both array response and object with data property
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
      <Home className={`w-5 h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="home" />,
      <Plug className={`w-5 h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="plug" />,
      <Shirt className={`w-5 h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="shirt" />,
      <ShoppingCart className={`w-5 h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="cart" />,
      <DollarSign className={`w-5 h-5 ${isReceita ? 'text-green-600' : 'text-blue-600'}`} key="dollar" />
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
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-gray-500">Carregando...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Painel</h1>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 font-medium rounded-md text-sm hover:bg-blue-700 transition"
          >
            + Adicionar
          </button>
        </header>

        <div className="flex gap-6">
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            <div>
              <div className="relative flex bg-white rounded-lg mb-8 w-fit">
                <div className={`absolute top-0 h-full bg-blue-600 rounded-lg transition-all duration-200 ease-in-out ${
                  activeTab === 'despesas' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
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

              <section className="grid grid-cols-2 gap-6 mb-0">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Receitas</p>
                      <p className="text-2xl font-semibold">{formatCurrency(totalReceitas)}</p>
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
                        <p className="text-2xl font-semibold">{formatCurrency(totalDespesas)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="bg-white p-6 rounded-xl shadow-sm mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{activeTab === 'despesas' ? 'Últimas despesas' : 'Últimas receitas'}</h2>
                <a href="#" className="text-indigo-600 text-sm">Ver mais</a>
              </div>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2 font-medium">Data</th>
                    <th className="py-2 font-medium">Nome</th>
                    <th className="py-2 font-medium">Valor</th>
                    <th className="py-2 font-medium">{activeTab === 'despesas' ? 'Categoria' : 'Fonte'}</th>
                    <th className="py-2 font-medium">Saldo</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {(activeTab === 'despesas' ? despesasRows : receitasRows).map((row, idx) => (
                    <tr 
                      key={idx} 
                      className="odd:bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => openEditModal(row)}
                    >
                      <td className="py-3">{row.date}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {row.icon}
                          <span>{row.name}</span>
                        </div>
                      </td>
                      <td>{row.value}</td>
                      <td>{row.category}</td>
                      <td className="text-green-600">{row.saldo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          <div className="flex-shrink-0 w-full max-w-xs flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-center items-center text-gray-400">
              Gráfico: Balanço Mensal
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm flex justify-center items-center text-gray-400">
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
