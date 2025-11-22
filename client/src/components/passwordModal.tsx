"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/app/terminology/LanguageContext";
import { passwordModal } from "@/app/terminology/language/modals/password";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordModal({ isOpen, onClose }: PasswordModalProps) {
  const { theme } = useTheme();
  const dark = theme === "escuro";
  const { t } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError(t(passwordModal.passwordMismatch));
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`fixed inset-0 ${
        dark ? "bg-black/60" : "bg-[#b9b9c2]/60"
      } backdrop-blur-sm flex items-center justify-center z-50`}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 animate-fadeIn ${
          dark ? "bg-[#2B2B2B] text-gray-100" : "bg-white text-gray-900"
        }`}
        onClick={handleModalClick}
      >
        <h2
          className={`text-center text-xl font-semibold mb-6 ${
            dark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {t(passwordModal.title)}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={`text-sm block mb-2 ${
                dark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t(passwordModal.currentPassword)}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                dark
                  ? "bg-[#3C3C3C] text-gray-100 placeholder-gray-400"
                  : "bg-gray-100 text-gray-800 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div>
            <label
              className={`text-sm block mb-2 ${
                dark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t(passwordModal.newPassword)}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                dark
                  ? "bg-[#3C3C3C] text-gray-100 placeholder-gray-400"
                  : "bg-gray-100 text-gray-800 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div>
            <label
              className={`text-sm block mb-2 ${
                dark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t(passwordModal.confirmPassword)}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                dark
                  ? "bg-[#3C3C3C] text-gray-100 placeholder-gray-400"
                  : "bg-gray-100 text-gray-800 placeholder-gray-500"
              }`}
              required
            />
          </div>

          {error && (
            <div
              className={`text-sm px-4 py-2 rounded-lg ${
                dark
                  ? "text-red-400 bg-red-900/30"
                  : "text-red-600 bg-red-50"
              }`}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full mt-4 py-2.5 rounded-xl font-medium transition-all ${
              dark
                ? "bg-transparent border-2 border-gray-300 text-gray-300 hover:border-blue-500 hover:text-blue-500"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {t(passwordModal.title)}
          </button>
        </form>
      </div>

      {success && (
        <div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg animate-fadeIn ${
            dark ? "bg-green-700 text-white" : "bg-green-600 text-white"
          }`}
        >
          {t(passwordModal.passwordChanged)}
        </div>
      )}
    </div>
  );
}
