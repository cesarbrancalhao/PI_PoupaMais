import Image from "next/image";

export default function RecuperarPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm p-12 md:p-12 w-full max-w-md md:max-w-lg min-h-96 space-y-8">
        <div className="flex flex-col items-center">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            Recuperar senha
          </h1>
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

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Recuperar senha
          </button>
        </div>
      </div>
    </div>
  );
}
