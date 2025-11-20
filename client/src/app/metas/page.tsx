'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Sidebar from '@/components/sidebar'
import AddMetaModal from '@/components/addMetaModal'
import AddContribuicaoModal from '@/components/addContribuicaoModal'
import EditMetaModal from '@/components/editMetaModal'
import EditContribuicaoModal from '@/components/editContribuicaoModal'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Plus, Target, Calendar, DollarSign } from 'lucide-react'
import { Meta, ContribuicaoMeta, DespesaExclusao, ReceitaExclusao, Despesa, Receita } from '@/types'
import { metasService, contribuicaoMetaService, receitasService, despesasService, despesasExclusaoService, receitasExclusaoService } from '@/services'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency as formatMoney } from '@/app/terminology/currency'
import { useLanguage } from '@/app/terminology/LanguageContext'
import { metas as metasTerms } from '@/app/terminology/language/metas'
import { common } from '@/app/terminology/language/common'

export default function MetasPage() {
  const { theme } = useTheme()
  const isDark = theme === 'escuro'
  const { user } = useAuth()
  const { t } = useLanguage()
  const [metas, setMetas] = useState<Meta[]>([])
  const [selectedMeta, setSelectedMeta] = useState<Meta | null>(null)
  const [contribuicoes, setContribuicoes] = useState<ContribuicaoMeta[]>([])
  const [isAddMetaModalOpen, setIsAddMetaModalOpen] = useState(false)
  const [isAddContribuicaoModalOpen, setIsAddContribuicaoModalOpen] = useState(false)
  const [isEditMetaModalOpen, setIsEditMetaModalOpen] = useState(false)
  const [isEditContribuicaoModalOpen, setIsEditContribuicaoModalOpen] = useState(false)
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null)
  const [editingContribuicao, setEditingContribuicao] = useState<ContribuicaoMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [receitaMedia, setReceitaMedia] = useState(0)
  const [despesaMedia, setDespesaMedia] = useState(0)

  const expandirEntradasRecorrentes = <T extends Despesa | Receita>(
    itens: T[],
    mesSelecionado: string,
    exclusoes: (DespesaExclusao | ReceitaExclusao)[]
  ): T[] => {
    if (!mesSelecionado) return itens

    const [mes, ano] = mesSelecionado.split('-')
    const dataAlvo = new Date(parseInt(ano), parseInt(mes) - 1, 1)

    const itensExpandidos: T[] = []

    itens.forEach(item => {
      const dataInicioItem = new Date(item.data)
      const anoInicioItem = dataInicioItem.getFullYear()
      const mesInicioItem = dataInicioItem.getMonth()
      const inicioMesItem = new Date(anoInicioItem, mesInicioItem, 1)

      if (item.recorrente) {
        const anoAlvo = dataAlvo.getFullYear()
        const mesAlvo = dataAlvo.getMonth()
        const inicioMesAlvo = new Date(anoAlvo, mesAlvo, 1)

        if (inicioMesItem <= inicioMesAlvo) {
          let dentroPrazo = true
          if (item.data_vencimento) {
            const dataFim = new Date(item.data_vencimento)
            const anoFim = dataFim.getFullYear()
            const mesFim = dataFim.getMonth()
            const inicioMesFim = new Date(anoFim, mesFim, 1)
            dentroPrazo = inicioMesAlvo <= inicioMesFim
          }

          if (dentroPrazo) {
            const chaveMes = `${ano}-${mes}-01`
            const foiExcluido = exclusoes.some(exc => {
              const ehDespesa = 'despesa_id' in exc
              const idItem = ehDespesa ? (exc as DespesaExclusao).despesa_id : (exc as ReceitaExclusao).receita_id
              const dataExc = new Date(exc.data_exclusao)
              const anoExc = dataExc.getFullYear()
              const mesExc = String(dataExc.getMonth() + 1).padStart(2, '0')
              const chaveExc = `${anoExc}-${mesExc}-01`

              return idItem === item.id && chaveExc === chaveMes
            })

            if (!foiExcluido) {
              const entradaVirtual = { ...item }
              itensExpandidos.push(entradaVirtual)
            }
          }
        }
      } else {
        const mesItem = String(dataInicioItem.getMonth() + 1).padStart(2, '0')
        const anoItem = dataInicioItem.getFullYear().toString()
        if (mesItem === mes && anoItem === ano) {
          itensExpandidos.push(item)
        }
      }
    })

    return itensExpandidos
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [metasResponse, receitasResponse, despesasResponse, despesasExclusoesResponse, receitasExclusoesResponse] = await Promise.all([
        metasService.getAll(1, 100),
        receitasService.getAll(1, 100),
        despesasService.getAll(1, 100),
        despesasExclusaoService.getAll(),
        receitasExclusaoService.getAll()
      ])

      const metasData = Array.isArray(metasResponse)
        ? metasResponse
        : (metasResponse?.data || [])

      const receitasDataFetched = Array.isArray(receitasResponse)
        ? receitasResponse
        : (receitasResponse?.data || [])

      const despesasDataFetched = Array.isArray(despesasResponse)
        ? despesasResponse
        : (despesasResponse?.data || [])

      setMetas(metasData)

      const agora = new Date()
      let totalReceitasAcumulado = 0
      let totalDespesasAcumulado = 0

      for (let i = 11; i >= 0; i--) {
        const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
        const mes = String(data.getMonth() + 1).padStart(2, '0')
        const ano = data.getFullYear()
        const chaveMes = `${mes}-${ano}`

        const despesasMes = expandirEntradasRecorrentes(despesasDataFetched, chaveMes, despesasExclusoesResponse)
        const receitasMes = expandirEntradasRecorrentes(receitasDataFetched, chaveMes, receitasExclusoesResponse)

        totalReceitasAcumulado += receitasMes.reduce((soma, r) => soma + (Number(r.valor) || 0), 0)
        totalDespesasAcumulado += despesasMes.reduce((soma, d) => soma + (Number(d.valor) || 0), 0)
      }

      setReceitaMedia(totalReceitasAcumulado / 12)
      setDespesaMedia(totalDespesasAcumulado / 12)

      if (metasData.length > 0 && !selectedMeta) {
        setSelectedMeta(metasData[0])
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
      setError(`${t(metasTerms.errorLoadingGoals)}. ${t(common.checkConnection)}.`)
    } finally {
      setLoading(false)
    }
  }, [selectedMeta, t])

  const fetchContribuicoes = useCallback(async (metaId: number) => {
    try {
      const response = await contribuicaoMetaService.getAllByMeta(metaId, 1, 100)
      const contribuicoesData = Array.isArray(response)
        ? response
        : (response?.data || [])
      setContribuicoes(contribuicoesData)
    } catch (err) {
      console.error('Erro ao buscar contribuições:', err)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (selectedMeta) {
      fetchContribuicoes(selectedMeta.id)
    }
  }, [selectedMeta, fetchContribuicoes])

  const openAddMetaModal = () => setIsAddMetaModalOpen(true)
  const closeAddMetaModal = () => {
    setIsAddMetaModalOpen(false)
    fetchData()
  }

  const openAddContribuicaoModal = () => setIsAddContribuicaoModalOpen(true)
  const closeAddContribuicaoModal = () => {
    setIsAddContribuicaoModalOpen(false)
    if (selectedMeta) {
      fetchContribuicoes(selectedMeta.id)
      fetchData()
    }
  }

  const openEditMetaModal = (meta: Meta) => {
    setEditingMeta(meta)
    setIsEditMetaModalOpen(true)
  }

  const closeEditMetaModal = () => {
    setIsEditMetaModalOpen(false)
    setEditingMeta(null)
    fetchData()
  }

  const openEditContribuicaoModal = (contribuicao: ContribuicaoMeta) => {
    setEditingContribuicao(contribuicao)
    setIsEditContribuicaoModalOpen(true)
  }

  const closeEditContribuicaoModal = () => {
    setIsEditContribuicaoModalOpen(false)
    setEditingContribuicao(null)
    if (selectedMeta) {
      fetchContribuicoes(selectedMeta.id)
      fetchData()
    }
  }

  const handleDeleteMeta = async (id: number) => {
    try {
      await metasService.delete(id)
      if (selectedMeta?.id === id) {
        setSelectedMeta(null)
      }
      fetchData()
    } catch (err) {
      console.error('Erro ao excluir meta:', err)
    }
  }

  const handleDeleteContribuicao = async (id: number) => {
    try {
      await contribuicaoMetaService.delete(id)
      if (selectedMeta) {
        fetchContribuicoes(selectedMeta.id)
        fetchData()
      }
    } catch (err) {
      console.error('Erro ao excluir contribuição:', err)
    }
  }

  const formatCurrency = (value: number) => {
    return formatMoney(value, user?.moeda || "real")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const calculateProgress = (meta: Meta) => {
    const valor = Number(meta.valor) || 0
    const valorAtual = Number(meta.valor_atual) || 0
    return valor > 0 ? (valorAtual / valor) * 100 : 0
  }

  const calculateTimeRemaining = (meta: Meta) => {
    const economiaMensal = Number(meta.economia_mensal) || 0

    if (economiaMensal === 0) return '∞'

    const valorTotal = Number(meta.valor) || 0
    const valorAtual = Number(meta.valor_atual) || 0
    const remaining = valorTotal - valorAtual

    if (remaining <= 0) return `0 ${t(metasTerms.months)}`

    const monthsRemaining = Math.ceil(remaining / economiaMensal)
    return `${monthsRemaining} ${t(metasTerms.months)}`
  }

  const percentualAlocado = useMemo(() => {
    if (receitaMedia === 0) return 0
    const totalEconomiaMensal = metas.reduce((sum, meta) => sum + (Number(meta.economia_mensal) || 0), 0)
    return (totalEconomiaMensal / receitaMedia) * 100
  }, [metas, receitaMedia])

  const valorTotalNecessario = useMemo(() => {
    return metas.reduce((sum, meta) => sum + (Number(meta.valor) || 0), 0)
  }, [metas])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={`flex min-h-screen ${isDark ? 'bg-[var(--bg-main)]' : 'bg-gray-50'}`}>
          <Sidebar />
          <main className={`flex-1 p-4 md:p-8 md:ml-64 flex items-center justify-center ${isDark ? 'text-[var(--text-main)]' : ''}`}>
            <div className={isDark ? 'text-[var(--text-main)]' : 'text-gray-500'}>{t(metasTerms.loadingGoals)}</div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className={`flex min-h-screen ${isDark ? 'bg-[var(--bg-main)]' : 'bg-gray-50'}`}>
          <Sidebar />
          <main className={`flex-1 p-4 md:p-8 md:ml-64 flex items-center justify-center ${isDark ? 'text-[var(--text-main)]' : ''}`}>
            <div className="text-red-500">{error}</div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className={`flex min-h-screen ${isDark ? 'bg-[var(--bg-main)]' : 'bg-gray-50'}`}>
        <Sidebar />
        <main className={`flex-1 p-4 md:p-8 md:ml-64 ${isDark ? 'text-[var(--text-main)]' : ''}`}>
          <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
            <h1 className={`${isDark ? 'text-[var(--text-main)] text-xl md:text-2xl font-semibold text-center md:text-left' : 'text-xl md:text-2xl font-semibold text-gray-800 text-center md:text-left'}`}>{t(metasTerms.title)}</h1>
            <button
              onClick={openAddMetaModal}
              className="bg-blue-600 text-white px-4 py-2 font-bold rounded-md text-sm hover:bg-blue-700 transition w-full md:w-auto whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t(metasTerms.addGoal)}
            </button>
          </header>

          <div className="flex flex-col xl:flex-row gap-4 md:gap-6">
            <div className="w-full xl:w-4/6 flex flex-col gap-4 md:gap-6">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className={`${isDark ? 'bg-[var(--bg-card)] text-[var(--text-main)]' : 'bg-white text-gray-800'} p-4 md:p-6 rounded-xl shadow-sm`}>
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <div className={`${isDark ? 'w-8 h-8 md:w-10 md:h-10 bg-yellow-900/10 rounded-full flex items-center justify-center' : 'w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center'}`}>
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className={`${isDark ? 'text-gray-400 text-xs md:text-sm' : 'text-gray-500 text-xs md:text-sm'}`}>{t(metasTerms.allocatedPercentage)}</p>
                      <p className={`${isDark ? 'text-[var(--text-main)] text-lg md:text-2xl font-semibold' : 'text-lg md:text-2xl font-semibold'}`}>{percentualAlocado.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                <div className={`${isDark ? 'bg-[var(--bg-card)] text-[var(--text-main)]' : 'bg-white text-gray-800'} p-4 md:p-6 rounded-xl shadow-sm`}>
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <div className={`${isDark ? 'w-8 h-8 md:w-10 md:h-10 bg-blue-900/10 rounded-full flex items-center justify-center' : 'w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center'}`}>
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className={`${isDark ? 'text-gray-400 text-xs md:text-sm' : 'text-gray-500 text-xs md:text-sm'}`}>{t(metasTerms.totalRequired)}</p>
                      <p className={`${isDark ? 'text-[var(--text-main)] text-lg md:text-2xl font-semibold' : 'text-lg md:text-2xl font-semibold'}`}>{formatCurrency(valorTotalNecessario)}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className={`${isDark ? 'bg-[var(--bg-card)] text-[var(--text-main)]' : 'bg-white text-gray-800'} p-4 md:p-6 rounded-xl shadow-sm`}>
                <h2 className={`${isDark ? 'text-[var(--text-main)] text-base md:text-lg font-semibold mb-4' : 'text-base md:text-lg font-semibold text-gray-800 mb-4'}`}>{t(metasTerms.title)}</h2>

                {metas.length === 0 ? (
                  <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Target className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p>{t(metasTerms.noGoalsYet)}</p>
                    <p className="text-sm mt-2">{t(metasTerms.clickToAddGoal)}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {metas.map((meta) => {
                      const progress = calculateProgress(meta)
                      const timeRemaining = calculateTimeRemaining(meta)

                      return (
                        <div
                          key={meta.id}
                          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            selectedMeta?.id === meta.id
                              ? isDark ? 'border-blue-600 bg-blue-900/20' : 'border-blue-600 bg-blue-50'
                              : isDark ? 'border-white/10 hover:border-blue-300 bg-[var(--bg-main)]' : 'border-gray-200 hover:border-blue-300 bg-white'
                          }`}
                          onClick={() => openEditMetaModal(meta)}
                        >
                          <div className="flex gap-3 items-start mb-2">
                            <div className="flex items-start pt-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="radio"
                                name="meta-selection"
                                checked={selectedMeta?.id === meta.id}
                                onChange={() => setSelectedMeta(meta)}
                                className="w-4 h-4 text-blue-600 cursor-pointer"
                              />
                            </div>
                            <div className="flex justify-between items-start flex-1">
                              <div className="flex-1">
                                <h3 className={`font-semibold ${isDark ? 'text-[var(--text-main)]' : 'text-gray-800'}`}>{meta.nome}</h3>
                                {meta.descricao && (
                                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{meta.descricao}</p>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {formatCurrency(Number(meta.economia_mensal) || 0)}/{t(metasTerms.months)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="ml-7">
                            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                              <div>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t(metasTerms.targetValue)}</p>
                                <p className={`font-medium ${isDark ? 'text-[var(--text-main)]' : 'text-gray-800'}`}>{formatCurrency(Number(meta.valor) || 0)}</p>
                              </div>
                              <div>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t(metasTerms.progress)}</p>
                                <p className="font-medium text-green-600">{formatCurrency(Number(meta.valor_atual) || 0)}</p>
                              </div>
                              <div>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t(metasTerms.remaining)}</p>
                                <p className={`font-medium ${isDark ? 'text-[var(--text-main)]' : 'text-gray-800'}`}>{timeRemaining}</p>
                              </div>
                            </div>

                            <div className={`w-full rounded-full h-2.5 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                              <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <p className={`text-xs mt-1 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{progress.toFixed(1)}%</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className="w-full xl:w-2/6 flex flex-col gap-4 md:gap-6">
              {selectedMeta ? (
                <section className={`${isDark ? 'bg-[var(--bg-card)] text-[var(--text-main)]' : 'bg-white text-gray-800'} p-4 md:p-6 rounded-xl shadow-sm`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`${isDark ? 'text-[var(--text-main)] text-base md:text-lg font-semibold' : 'text-base md:text-lg font-semibold text-gray-800'}`}>{t(metasTerms.contributions)}</h2>
                    <button
                      onClick={openAddContribuicaoModal}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      {t(metasTerms.addContribution)}
                    </button>
                  </div>

                  {contribuicoes.length === 0 ? (
                    <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Calendar className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                      <p className="text-sm">{t(metasTerms.noContributions)}</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {contribuicoes.map((contribuicao) => (
                        <div
                          key={contribuicao.id}
                          onClick={() => openEditContribuicaoModal(contribuicao)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isDark 
                              ? 'bg-[var(--bg-main)] border-white/10 hover:bg-white/5 hover:border-blue-300' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className={`font-medium ${isDark ? 'text-[var(--text-main)]' : 'text-gray-800'}`}>{formatCurrency(contribuicao.valor)}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(contribuicao.data)}</p>
                          </div>
                          {contribuicao.observacao && (
                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{contribuicao.observacao}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                <section className={`${isDark ? 'bg-[var(--bg-card)] text-[var(--text-main)]' : 'bg-white text-gray-800'} p-4 md:p-6 rounded-xl shadow-sm`}>
                  <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Target className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p>{t(metasTerms.selectGoalToSeeContributions)}</p>
                  </div>
                </section>
              )}

              <section className={`${isDark ? 'bg-[var(--bg-card)] text-[var(--text-main)]' : 'bg-white text-gray-800'} p-4 md:p-6 rounded-xl shadow-sm`}>
                <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-[var(--text-main)]' : 'text-gray-800'}`}>{t(metasTerms.statistics)}</h3>
                <div className="space-y-3">
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t(metasTerms.averageIncome)}</p>
                    <p className={`text-lg font-semibold ${isDark ? 'text-[var(--text-main)]' : 'text-gray-800'}`}>{formatCurrency(receitaMedia)}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t(metasTerms.averageExpenses)}</p>
                    <p className={`text-lg font-semibold ${isDark ? 'text-[var(--text-main)]' : 'text-gray-800'}`}>{formatCurrency(despesaMedia)}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <AddMetaModal isOpen={isAddMetaModalOpen} onClose={closeAddMetaModal} />
        {selectedMeta && (
          <AddContribuicaoModal
            isOpen={isAddContribuicaoModalOpen}
            onClose={closeAddContribuicaoModal}
            metaId={selectedMeta.id}
          />
        )}
        {editingMeta && (
          <EditMetaModal
            isOpen={isEditMetaModalOpen}
            onClose={closeEditMetaModal}
            editItem={{
              id: editingMeta.id,
              nome: editingMeta.nome,
              descricao: editingMeta.descricao,
              valor: editingMeta.valor,
              economia_mensal: editingMeta.economia_mensal,
              data_inicio: editingMeta.data_inicio,
              data_alvo: editingMeta.data_alvo,
            }}
            onDelete={handleDeleteMeta}
          />
        )}
        {editingContribuicao && (
          <EditContribuicaoModal
            isOpen={isEditContribuicaoModalOpen}
            onClose={closeEditContribuicaoModal}
            editItem={{
              id: editingContribuicao.id,
              valor: editingContribuicao.valor,
              data: editingContribuicao.data,
              observacao: editingContribuicao.observacao,
            }}
            onDelete={handleDeleteContribuicao}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
