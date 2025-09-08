import { useState, useEffect } from "react";
import { AdminLoginScreen } from "../components/AdminLoginScreen";
import { AdminScreen } from "../components/AdminScreen";

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Проверяем валидность токена
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        setIsAuthenticated(!isExpired);
      } catch {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginScreen
        navigateToScreen={() => {}}
        cartItemsCount={0}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <AdminScreen
      navigateToScreen={() => {}}
      cartItemsCount={0}
      onLogout={handleLogout}
    />
  );
}