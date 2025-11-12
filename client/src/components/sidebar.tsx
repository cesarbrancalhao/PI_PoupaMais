'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Goal, LineChart, Settings, SquareStack, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    setShowLogoutModal(false)
    logout()
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  const initials = user?.nome
    ? user.nome
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
    : 'JS'

  const links = [
    { name: 'Painel', href: '/dashboard', icon: <SquareStack className="w-5 h-5" /> },
    { name: 'Metas', href: '/metas', icon: <Goal className="w-5 h-5" /> },
    { name: 'Análise', href: '/analise', icon: <LineChart className="w-5 h-5" /> },
    { name: 'Configurações', href: '/configuracoes', icon: <Settings className="w-5 h-5" /> }
  ]

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6 text-gray-800" />
      </button>

      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white flex flex-col justify-between transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">{initials}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{user?.nome || 'Carregando...'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 hover:bg-gray-100 rounded"
              title="Sair"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <nav className="mt-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  pathname === link.href
                    ? 'text-gray-800 bg-gradient-to-r from-blue-100 to-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmar saída</h3>
            <p className="text-sm text-gray-600 mb-6">Tem certeza que deseja sair?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
