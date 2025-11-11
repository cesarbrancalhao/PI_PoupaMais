"use client";

import Sidebar from "@/components/sidebar";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from '@/contexts/AuthContext'

export default function ConfiguracoesPage() {
  const [moeda, setMoeda] = useState("real");
  const [tema, setTema] = useState("claro");
  const [idioma, setIdioma] = useState("portugues");
  const {user} = useAuth()

  const btnClass = (isActive: boolean, position?: "left" | "right") => {
    const base =
      "px-3 sm:px-4 py-2 text-sm transition-colors focus:outline-none";

    const rounded =
      position === "left"
        ? "rounded-l"
        : position === "right"
        ? "rounded-r"
        : "";

    const color = isActive
      ? "bg-blue-600 hover:bg-blue-700 text-white font-medium"
      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200";

    return `${base} ${rounded} ${color}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8 md:p-10 max-w-6xl mx-auto w-full min-h-[85vh] flex flex-col">
          <h1 className="text-lg sm:text-xl font-semibold mb-8">Configurações</h1>

          {/* Grupo de Moeda / Tema / Idioma */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 mb-10">
            {/* Moeda */}
            <div className="flex flex-col w-full sm:w-auto">
              <h2 className="font-medium mb-3">Moeda</h2>
              <div className="flex flex-wrap">
                <button
                  className={btnClass(moeda === "dolar", "left")}
                  onClick={() => setMoeda("dolar")}
                >
                  Dólar $
                </button>
                <button
                  className={btnClass(moeda === "euro")}
                  onClick={() => setMoeda("euro")}
                >
                  Euro €
                </button>
                <button
                  className={btnClass(moeda === "real", "right")}
                  onClick={() => setMoeda("real")}
                >
                  Real R$
                </button>
              </div>
            </div>

            {/* Tema */}
            <div className="flex flex-col w-full sm:w-auto">
              <h2 className="font-medium mb-3">Tema</h2>
              <div className="flex flex-wrap">
                <button
                  className={btnClass(tema === "claro", "left")}
                  onClick={() => setTema("claro")}
                >
                  Claro
                </button>
                <button
                  className={btnClass(tema === "escuro", "right")}
                  onClick={() => setTema("escuro")}
                >
                  Escuro
                </button>
              </div>
            </div>

            {/* Idioma */}
            <div className="flex flex-col w-full sm:w-auto">
              <h2 className="font-medium mb-3">Idioma</h2>
              <div className="flex flex-wrap">
                <button
                  className={btnClass(idioma === "espanhol", "left")}
                  onClick={() => setIdioma("espanhol")}
                >
                  Espanhol
                </button>
                <button
                  className={btnClass(idioma === "ingles")}
                  onClick={() => setIdioma("ingles")}
                >
                  Inglês
                </button>
                <button
                  className={btnClass(idioma === "portugues", "right")}
                  onClick={() => setIdioma("portugues")}
                >
                  Português
                </button>
              </div>
            </div>
          </div>

          {/* Campos Nome / Email / Senha */}
          <div className="flex flex-col gap-6 flex-grow">
            {/* Nome */}
            <div className="flex flex-col">
              <label className="block font-medium mb-2">Nome</label>
              <input
                type="text"
                value={user?.nome || 'Carregando...'}
                readOnly
                className="w-fit bg-gray-100 dark:bg-gray-700 rounded-lg px-3 sm:px-4 py-3 focus:outline-none text-sm"
              />
            </div>

            {/* Linha com E-mail e Senha */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Email */}
              <div className="flex flex-col">
                <label className="block font-medium mb-2">Email</label>
                <input
                  type="email"
                  value="exemplo@gmail.com"
                  readOnly
                  className="max-w-fit bg-gray-300 dark:bg-gray-600 rounded-lg px-3 sm:px-4 py-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Senha */}
              <div className="flex flex-col justify-end">
                <label className="block font-medium mb-2">Senha</label>
                <button className="px-4 py-3 rounded-lg bg-blue-600 *:hover:bg-blue-700 text-white text-sm font-medium flex items-center gap-2 w-fit">
                  <Settings size={16} />
                  Alterar senha
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
