'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Goal, LineChart, Settings, SquareStack } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { 
      name: 'Painel', 
      href: '/dashboard', 
      icon: <SquareStack className="w-5 h-5" />
    },
    { 
      name: 'Metas', 
      href: '/metas', 
      icon: <Goal className="w-5 h-5" />
    },
    { 
      name: 'Análise', 
      href: '/analise', 
      icon: <LineChart className="w-5 h-5" />
    },
    { 
      name: 'Configurações', 
      href: '/configuracoes', 
      icon: <Settings className="w-5 h-5" />
    },
  ]

  return (
    <aside className="w-64 h-screen bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">JS</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">João Silva</p>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

    </aside>
  )
}
