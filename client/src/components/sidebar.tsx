'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Goal, LineChart, Settings, SquareStack, LogOut, Menu } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

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
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white flex flex-col justify-between transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">JS</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">João Silva</p>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
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
    </>
  )
}
