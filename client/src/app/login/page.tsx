import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:basis-[30%] flex flex-col justify-center items-center px-8 bg-white">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center">
            <Image src="/logo.svg" alt="Logo" width={90} height={90} />
            <h1 className="mt-4 text-2xl font-semibold text-gray-800">Login</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-0 border-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-0 border-0"
              />
              <div className="text-right mt-1">
                <a href="#" className="text-xs text-indigo-500 hover:underline">
                  Esqueci minha senha
                </a>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
              Entrar
            </button>

            <p className="text-center text-sm text-gray-600">
              Ainda não possui conta?{" "}
              <Link href="#" className="text-indigo-500 hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
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
