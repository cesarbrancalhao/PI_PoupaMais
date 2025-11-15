"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/sidebar";
import PasswordModal from "@/components/passwordModal";
import { Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { configsService } from "@/services/configs.service";
import { Moeda, Tema, Idioma } from "@/types/configs";

const ConfiguracoesPage = () => {
  const { user, setUser } = useAuth();
  const { setTheme: setGlobalTheme } = useTheme();

  const [moeda, setMoeda] = useState<Moeda>("real");
  const [tema, setTema] = useState<Tema>("claro");
  const [idioma, setIdioma] = useState<Idioma>("portugues");
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    setMoeda((user.moeda ?? "real") as Moeda);
    setTema(user.tema ? "escuro" : "claro");
    setIdioma((user.idioma ?? "portugues") as Idioma);
    setGlobalTheme(user.tema ? "escuro" : "claro");
  }, [user, setGlobalTheme]);

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

      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <div
          className={`${containerBg} rounded-2xl shadow-sm p-6 sm:p-8 md:p-10 max-w-6xl mx-auto w-full min-h-[85vh] flex flex-col`}
        >
          <h1 className="text-lg sm:text-xl font-semibold mb-8">Configurações</h1>

          <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 mb-10">
  
            <div className="flex flex-col w-full sm:w-auto">
              <h2 className={`font-medium mb-3 ${labelColor}`}>Moeda</h2>
              <div className="flex">

                <button
                  className={btnClass(moeda === "dolar", "left")}
                  disabled={moeda === "dolar"}
                  onClick={() => moeda !== "dolar" && updateConfigs({ moeda: "dolar" })}
                >
                  Dólar $
                </button>

                <button
                  className={btnClass(moeda === "euro")}
                  disabled={moeda === "euro"}
                  onClick={() => moeda !== "euro" && updateConfigs({ moeda: "euro" })}
                >
                  Euro €
                </button>

                <button
                  className={btnClass(moeda === "real", "right")}
                  disabled={moeda === "real"}
                  onClick={() => moeda !== "real" && updateConfigs({ moeda: "real" })}
                >
                  Real R$
                </button>

              </div>
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <h2 className={`font-medium mb-3 ${labelColor}`}>Tema</h2>
              <div className="flex">

                <button
                  className={btnClass(tema === "claro", "left")}
                  disabled={tema === "claro"}
                  onClick={() => tema !== "claro" && updateConfigs({ tema: false })}
                >
                  Claro
                </button>

                <button
                  className={btnClass(tema === "escuro", "right")}
                  disabled={tema === "escuro"}
                  onClick={() => tema !== "escuro" && updateConfigs({ tema: true })}
                >
                  Escuro
                </button>

              </div>
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <h2 className={`font-medium mb-3 ${labelColor}`}>Idioma</h2>
              <div className="flex">

                <button
                  className={btnClass(idioma === "espanhol", "left")}
                  disabled={idioma === "espanhol"}
                  onClick={() => idioma !== "espanhol" && updateConfigs({ idioma: "espanhol" })}
                >
                  Espanhol
                </button>

                <button
                  className={btnClass(idioma === "ingles")}
                  disabled={idioma === "ingles"}
                  onClick={() => idioma !== "ingles" && updateConfigs({ idioma: "ingles" })}
                >
                  Inglês
                </button>

                <button
                  className={btnClass(idioma === "portugues", "right")}
                  disabled={idioma === "portugues"}
                  onClick={() => idioma !== "portugues" && updateConfigs({ idioma: "portugues" })}
                >
                  Português
                </button>

              </div>
            </div>

          </div>


          <div className="flex flex-col gap-6 flex-grow">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col flex-1">
                <label className={`block font-medium mb-2 ${labelColor}`}>Nome</label>
                <input
                  type="text"
                  value={user?.nome || "Carregando..."}
                  readOnly
                  className={`w-fit ${inputBg} rounded-lg px-3 py-3 text-sm`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col">
                  <label className={`block font-medium mb-2 ${labelColor}`}>Email</label>
                  <input
                    type="email"
                    value={user?.email || "Carregando..."}
                    readOnly
                    className={`w-fit ${inputBg} rounded-lg px-3 py-3 text-sm`}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className={`block font-medium mb-2 ${labelColor}`}>Senha</label>
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className={`px-4 py-3 rounded ${accentColor} ${accentHover} text-white text-sm font-medium flex items-center justify-center gap-2`}
                  >
                    <Settings size={16} />
                    Alterar senha
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
