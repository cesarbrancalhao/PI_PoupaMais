'use client';

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthLanguage } from "@/app/terminology/useAuthLanguage";
import { auth } from "@/app/terminology/language/auth";
import LanguageSelector from "@/components/LanguageSelector";
import type { Idioma } from "@/types/configs";
import type { Language } from "@/app/terminology/language/types";

const languageToIdiomaMap: Record<Language, Idioma> = {
  pt: "portugues",
  en: "ingles",
  es: "espanhol",
};

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  const { language, setLanguage, t } = useAuthLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!nome || !email || !password || !confirmPassword) {
      setError(t(auth.fillAllFields));
      return;
    }

    if (nome.trim().length < 2) {
      setError(t(auth.nameMinLength));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t(auth.invalidEmail));
      return;
    }

    if (password.length < 8) {
      setError(t(auth.passwordTooShort));
      return;
    }

    if (password !== confirmPassword) {
      setError(t(auth.passwordMismatch));
      return;
    }

    setLoading(true);

    try {
      await register({ nome, email, password, idioma: languageToIdiomaMap[language] });
    } catch (err) {
      const error = err as Error;
      setError(error.message || t(auth.registerError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:basis-[30%] flex flex-col justify-center items-center px-8 bg-white relative">
        <div className="absolute top-4 right-4">
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={setLanguage}
            isDarkMode={false}
          />
        </div>
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center">
            <Image src="/logo.svg" alt="Logo" width={90} height={90} />
            <h1 className="mt-4 text-2xl font-semibold text-gray-800">{t(auth.registerTitle)}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t(auth.name)}
              </label>
              <input
                type="text"
                placeholder={t(auth.namePlaceholder)}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-0 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t(auth.email)}
              </label>
              <input
                type="email"
                placeholder={t(auth.emailPlaceholder)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-0 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t(auth.password)}
              </label>
              <input
                type="password"
                placeholder={t(auth.passwordPlaceholder)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-0 disabled:opacity-50"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">{t(auth.passwordMinLength)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t(auth.confirmPasswordLabel)}
              </label>
              <input
                type="password"
                placeholder={t(auth.passwordPlaceholder)}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-0 disabled:opacity-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t(auth.registerLoading) : t(auth.registerButton)}
            </button>

            <p className="text-center text-sm text-gray-600">
              {t(auth.alreadyHaveAccount)}{" "}
              <Link href="/auth" className="text-indigo-500 hover:underline">
                {t(auth.loginHere)}
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:basis-[70%] bg-gray-50 justify-center items-center">
        <Image
          src="/illustration.svg"
          alt="Illustration"
          width={500}
          height={500}
          priority
        />
      </div>
    </div>
  );
}
