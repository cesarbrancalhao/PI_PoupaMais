"use client";

import { useState } from "react";
import { passwordRecoveryModal } from "@/app/terminology/language/modals/passwordRecovery";

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  email: string;
  language: "pt" | "en" | "es";
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
}

export default function PasswordRecoveryModal({
  isOpen,
  email,
  language,
  onVerify,
  onResend
}: PasswordRecoveryModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  if (!isOpen) return null;

  const t = (key: { pt: string; en: string; es: string }) => key[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError(t(passwordRecoveryModal.codeRequired));
      return;
    }

    setLoading(true);

    try {
      await onVerify(code);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t(passwordRecoveryModal.invalidCode));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setCode("");

    try {
      await onResend();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setCode(value);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleModalClick}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-8 animate-fadeIn bg-white text-gray-900"
        onClick={handleModalClick}
      >
        <h2 className="text-center text-xl font-semibold mb-4 text-gray-900">
          {t(passwordRecoveryModal.verificationTitle)}
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6">
          {t(passwordRecoveryModal.verificationDescription)}
          <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder={t(passwordRecoveryModal.codePlaceholder)}
              value={code}
              onChange={handleCodeChange}
              className="w-full rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 text-gray-800 placeholder-gray-500 uppercase"
              required
              maxLength={6}
              autoComplete="off"
              disabled={loading || resending}
            />
          </div>

          {error && (
            <div className="text-sm px-4 py-2 rounded-lg text-red-600 bg-red-50">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || resending || code.length !== 6}
            className="w-full mt-4 py-2.5 rounded-xl font-medium transition-all bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t(passwordRecoveryModal.verifying) : t(passwordRecoveryModal.verify)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResend}
            disabled={resending || loading}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? t(passwordRecoveryModal.verifying) : t(passwordRecoveryModal.resendCode)}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          {t(passwordRecoveryModal.expiresIn)}
        </p>
        <p className="text-xs text-gray-500 text-center mt-2">
          {t(passwordRecoveryModal.checkSpam)}
        </p>
      </div>
    </div>
  );
}
