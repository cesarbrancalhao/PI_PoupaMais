'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
// Using Tailwind-only icons instead of lucide-react

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { 
      name: 'Painel', 
      href: '/dashboard', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    },
    { 
      name: 'Metas', 
      href: '/metas', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    },
    { 
      name: 'Análise', 
      href: '/analise', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
    },
    { 
      name: 'Configurações', 
      href: '/configuracoes', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    },
  ]

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <p className="text-sm font-medium text-gray-800">João Silva</p>
            <p className="text-xs text-gray-500">Ver perfil</p>
          </div>
        </div>

        <nav className="mt-4">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                pathname === link.href
                  ? 'text-indigo-600 bg-indigo-50 border-l-4 border-indigo-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 text-sm text-gray-500 border-t">Sair</div>
    </aside>
  )
}
