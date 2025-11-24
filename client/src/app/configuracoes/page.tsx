"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/sidebar";
import PasswordModal from "@/components/passwordModal";
import { Settings, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { configsService } from "@/services/configs.service";
import { usersService } from "@/services/users.service";
import { Moeda, Tema, Idioma } from "@/types/configs";
import { useLanguage } from "@/app/terminology/LanguageContext";
import { configuracoes } from "@/app/terminology/language/configuracoes";
import { common } from "@/app/terminology/language/common";

const ConfiguracoesPage = () => {
  const { user, setUser } = useAuth();
  const { setTheme: setGlobalTheme } = useTheme();
  const { t } = useLanguage();

  const [moeda, setMoeda] = useState<Moeda>("real");
  const [tema, setTema] = useState<Tema>("claro");
  const [idioma, setIdioma] = useState<Idioma>("portugues");
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isNameChanged, setIsNameChanged] = useState(false);

  useEffect(() => {
    if (!user) return;

    setMoeda((user.moeda ?? "real") as Moeda);
    setTema(user.tema ? "escuro" : "claro");
    setIdioma((user.idioma ?? "portugues") as Idioma);
    setGlobalTheme(user.tema ? "escuro" : "claro");
    setEditedName(user.nome);
  }, [user, setGlobalTheme]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
    setIsNameChanged(e.target.value !== user?.nome);
  };

  const updateName = async () => {
    if (!user || !editedName.trim()) return;
    try {
      const updatedUser = await usersService.updateProfile(editedName, user.email);
      setUser({ ...user, nome: updatedUser.nome });
      setIsNameChanged(false);
    } catch (err) {
      console.error("Erro ao atualizar nome:", err);
    }
  };

  const updateConfigs = async (newData: Partial<{ tema: boolean; moeda: Moeda; idioma: Idioma }>) => {
    try {
      const updated = await configsService.update({
        tema: newData.tema ?? (tema === "escuro"),
        moeda: newData.moeda ?? moeda,
        idioma: newData.idioma ?? idioma,
      });

      if ("tema" in newData) {
        setTema(updated.tema ? "escuro" : "claro");
        setGlobalTheme(updated.tema ? "escuro" : "claro");
      }

      if ("moeda" in newData) {
        setMoeda(updated.moeda);
      }

      if ("idioma" in newData) {
        setIdioma(updated.idioma);
      }

      setUser((prev) =>
        prev
          ? {
              ...prev,
              tema: updated.tema,
              moeda: updated.moeda,
              idioma: updated.idioma,
            }
          : prev
      );
    } catch (err) {
      console.error("Erro ao atualizar configs:", err);
    }
  };

  const isDark = tema === "escuro";
  const accentColor = "bg-blue-600";
  const accentHover = "hover:bg-blue-700";

  const pageBg = isDark ? "bg-[#1E1E1E]" : "bg-[#F9FAFB]";
  const containerBg = isDark ? "bg-[#2B2B2B]" : "bg-white";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const inputBg = isDark ? "bg-[#3C3C3C]" : "bg-gray-100";
  const inputDisabledBg = isDark ? "bg-[#3C3C3C]/50 text-gray-400" : "bg-gray-300/80 text-gray-600";
  const labelColor = isDark ? "text-gray-300" : "text-gray-700";

  const btnClass = (isActive: boolean, position?: "left" | "right") => {
    const base = "px-4 py-2 text-sm transition-colors";
    const rounded =
      position === "left"
        ? "rounded-l"
        : position === "right"
        ? "rounded-r"
        : "";
    const color = isActive
      ? `${accentColor} ${accentHover} text-white font-medium border-transparent`
      : isDark
      ? "bg-[#3C3C3C] hover:bg-[#4B4B4B] text-gray-200 border-gray-600"
      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300";
    return `${base} ${rounded} ${color}`;
  };

  return (
    <div className={`flex min-h-screen ${pageBg} ${textColor}`}>
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-10 md:ml-64 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
          <h1 className={`${isDark ? 'text-[var(--text-main)] text-xl md:text-2xl font-semibold text-center md:text-left' : 'text-xl md:text-2xl font-semibold text-gray-800 text-center md:text-left'}`}>{t(configuracoes.title)}</h1>
        </header>

        <div
          className={`${containerBg} rounded-2xl shadow-sm p-6 sm:p-8 md:p-10 max-w-6xl mx-auto w-full min-h-[85vh] flex flex-col`}
        >

          <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 mb-10">

            <div className="flex flex-col w-full sm:w-auto">
              <h2 className={`font-medium mb-3 ${labelColor}`}>{t(configuracoes.currency)}</h2>
              <div className="flex">

                {/* RF11 - O sistema permite ao usuário escolher a moeda de exibição (Real, Euro ou Dólar) na tela de Configurações. */}
                <button
                  className={btnClass(moeda === "dolar", "left")}
                  disabled={moeda === "dolar"}
                  onClick={() => moeda !== "dolar" && updateConfigs({ moeda: "dolar" })}
                >
                  {t(configuracoes.dollarUSD)}
                </button>

                <button
                  className={btnClass(moeda === "euro")}
                  disabled={moeda === "euro"}
                  onClick={() => moeda !== "euro" && updateConfigs({ moeda: "euro" })}
                >
                  {t(configuracoes.euroEUR)}
                </button>

                <button
                  className={btnClass(moeda === "real", "right")}
                  disabled={moeda === "real"}
                  onClick={() => moeda !== "real" && updateConfigs({ moeda: "real" })}
                >
                  {t(configuracoes.realBRL)}
                </button>

              </div>
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <h2 className={`font-medium mb-3 ${labelColor}`}>{t(configuracoes.theme)}</h2>
              <div className="flex">

                {/* RF12 - O sistema permite ao usuário escolher o tema (Claro ou Escuro) na tela de Configurações. */}
                <button
                  className={btnClass(tema === "claro", "left")}
                  disabled={tema === "claro"}
                  onClick={() => tema !== "claro" && updateConfigs({ tema: false })}
                >
                  {t(configuracoes.lightTheme)}
                </button>

                <button
                  className={btnClass(tema === "escuro", "right")}
                  disabled={tema === "escuro"}
                  onClick={() => tema !== "escuro" && updateConfigs({ tema: true })}
                >
                  {t(configuracoes.darkTheme)}
                </button>

              </div>
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <h2 className={`font-medium mb-3 ${labelColor}`}>{t(configuracoes.language)}</h2>
              <div className="flex">

                {/* RF10 - O sistema deve permitir ao usuário escolher o idioma do aplicativo (Português, Inglês ou Espanhol) na tela de Configurações. */}
                <button
                  className={btnClass(idioma === "espanhol", "left")}
                  disabled={idioma === "espanhol"}
                  onClick={() => idioma !== "espanhol" && updateConfigs({ idioma: "espanhol" })}
                >
                  {t(configuracoes.spanish)}
                </button>

                <button
                  className={btnClass(idioma === "ingles")}
                  disabled={idioma === "ingles"}
                  onClick={() => idioma !== "ingles" && updateConfigs({ idioma: "ingles" })}
                >
                  {t(configuracoes.english)}
                </button>

                <button
                  className={btnClass(idioma === "portugues", "right")}
                  disabled={idioma === "portugues"}
                  onClick={() => idioma !== "portugues" && updateConfigs({ idioma: "portugues" })}
                >
                  {t(configuracoes.portuguese)}
                </button>

              </div>
            </div>

          </div>


          <div className="flex flex-col gap-6 flex-grow">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col flex-1">
                  {/* RF13 - O sistema permite ao usuário alterar seu Nome e Senha na tela de Configurações. */}
                <label className={`block font-medium mb-2 ${labelColor}`}>{t(configuracoes.userName)}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editedName}
                    onChange={handleNameChange}
                    placeholder={t(configuracoes.loading) || "..."}
                    className={`w-fit ${inputBg} rounded-lg px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all`}
                  />
                  {isNameChanged && (
                    <button
                      onClick={updateName}
                      className={`p-3 rounded-lg ${accentColor} ${accentHover} text-white shadow-sm transition-all hover:scale-105 active:scale-95`}
                      title={t(common.save)}
                    >
                      <Check size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col">
                  <label className={`block font-medium mb-2 ${labelColor}`}>{t(configuracoes.userEmail)}</label>
                  <input
                    type="email"
                    value={user?.email || t(configuracoes.loading) || "..."}
                    readOnly
                    disabled={true}
                    className={`w-fit ${inputDisabledBg} rounded-lg px-3 py-3 text-sm`}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  {/* RF13 - O sistema permite ao usuário alterar seu Nome e Senha na tela de Configurações. */}
                  <label className={`block font-medium mb-2 ${labelColor}`}>{t(configuracoes.password)}</label>
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className={`px-4 py-3 rounded ${accentColor} ${accentHover} text-white text-sm font-medium flex items-center justify-center gap-2`}
                  >
                    <Settings size={16} />
                    {t(configuracoes.changePassword)}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </div>
  );
};

export default ConfiguracoesPage;
