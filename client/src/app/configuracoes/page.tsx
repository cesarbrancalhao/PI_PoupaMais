"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Sidebar from "@/components/sidebar";
import PasswordModal from "@/components/passwordModal";
import { Settings } from "lucide-react";

const ConfiguracoesPage = () => {
  const [moeda, setMoeda] = useState("real");
  const [tema, setTema] = useState("claro");
  const [idioma, setIdioma] = useState("portugues");
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConfig = async () => {
      if (user && user.token) {
        try {
          const response = await axios.get(`http://localhost:3001/configs`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setMoeda(response.data.moeda);
          setTema(response.data.tema === true ? "escuro" : "claro");
          setIdioma(response.data.idioma);
        } catch (error) {
          console.error("Failed to fetch user configuration:", error);
        }
      }
    };

    fetchConfig();
  }, [user]);

  const handleThemeChange = (newTema: string) => {
    setTema(newTema);
    if (user && user.token) {
      axios
        .put(
          `http://localhost:3001/configs`,
          {
            tema: newTema === "escuro",
            idioma,
            moeda,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((response) => console.log("Theme updated successfully:", response.data))
        .catch((error) => console.error("Failed to update theme:", error));
    }
  };

  const isDark = tema === "escuro";
  const accentColor = isDark ? "bg-purple-600" : "bg-blue-600";
  const accentHover = isDark ? "hover:bg-purple-700" : "hover:bg-blue-700";
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
    <div className={`flex min-h-screen ${pageBg} ${textColor} transition-colors duration-300`}>
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <div
          className={`${containerBg} rounded-2xl shadow-sm p-6 sm:p-8 md:p-10 max-w-6xl mx-auto w-full min-h-[85vh] flex flex-col transition-colors duration-300`}
        >
          <h1 className="text-lg sm:text-xl font-semibold mb-8">Configurações</h1>

          <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 mb-10">
            <div className="flex flex-col w-full sm:w-auto">
              <h2 className={`font-medium mb-3 ${labelColor}`}>Moeda</h2>
              <div className="flex">
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

            <div className="flex flex-col w-full sm:w-auto">
              <h2 className={`font-medium mb-3 ${labelColor}`}>Tema</h2>
              <div className="flex">
                <button
                  className={btnClass(tema === "claro", "left")}
                  onClick={() => handleThemeChange("claro")}
                >
                  Claro
                </button>
                <button
                  className={btnClass(tema === "escuro", "right")}
                  onClick={() => handleThemeChange("escuro")}
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

          <div className="flex flex-col gap-6 flex-grow">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col flex-1">
                <label className={`block font-medium mb-2 ${labelColor}`}>Nome</label>
                <input
                  type="text"
                  value={user?.nome || "Carregando..."}
                  readOnly
                  className={`w-fit ${inputBg} rounded-lg px-3 sm:px-4 py-3 focus:outline-none text-sm`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col">
                  <label className={`block font-medium mb-2 ${labelColor}`}>Email</label>
                  <input
                    type="email"
                    value={user?.email || "Carregando..."}
                    readOnly
                    className={`w-fit ${inputBg} rounded-lg px-3 sm:px-4 py-3 focus:outline-none text-sm`}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className={`block font-medium mb-2 ${labelColor}`}>Senha</label>
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className={`px-4 py-3 rounded ${accentColor} ${accentHover} text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors w-fit`}
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

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
};

export default ConfiguracoesPage;
