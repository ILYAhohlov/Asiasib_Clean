import { useState } from "react";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { StickyFooter } from "./StickyFooter";
import { Button } from "./ui/button";
import { Screen } from "../App";

interface AdminLoginScreenProps {
  navigateToScreen: (screen: Screen) => void;
  cartItemsCount: number;
  onLogin: (password: string) => boolean;
}

export function AdminLoginScreen({ navigateToScreen, cartItemsCount, onLogin }: AdminLoginScreenProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://asiasib-clean.onrender.com'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        onLogin(password);
      } else {
        setError("Неверный пароль");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Ошибка подключения к серверу");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Вход в админ панель
          </h1>
        </div>
      </header>

      <main className="px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Административная панель
              </h2>
              <p className="text-gray-600 text-sm">
                Введите пароль для доступа к панели управления
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль администратора
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />

                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
              >
                {isLoading ? "Проверка..." : "Войти в панель"}
              </Button>
            </form>
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigateToScreen("catalog")}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              Вернуться к каталогу
            </Button>
          </div>
        </div>
      </main>

      <StickyFooter 
        navigateToScreen={navigateToScreen} 
        cartItemsCount={cartItemsCount}
      />
    </div>
  );
}