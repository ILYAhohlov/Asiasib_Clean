import { ShoppingCart, Info, Store, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Screen } from "../App";

interface StickyFooterProps {
  navigateToScreen: (screen: Screen) => void;
  cartItemsCount: number;
  currentScreen?: Screen;
  showAdminButton?: boolean;
}

export function StickyFooter({ navigateToScreen, cartItemsCount, currentScreen, showAdminButton = false }: StickyFooterProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && currentScreen === 'catalog') return true;
    if (path === '/cart' && currentScreen === 'cart') return true;
    return location.pathname === path;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around px-4 z-50">
      {/* Каталог - внутренняя навигация */}
      <button
        onClick={() => navigateToScreen("catalog")}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
          currentScreen === "catalog" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
        }`}
        aria-label="Каталог"
      >
        <Home className="w-6 h-6" />
        <span className="text-xs mt-1">Каталог</span>
      </button>

      {/* Корзина - внутренняя навигация */}
      <button
        onClick={() => navigateToScreen("cart")}
        className={`flex flex-col items-center justify-center relative p-2 rounded-lg transition-colors ${
          currentScreen === "cart" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
        }`}
        aria-label="Корзина"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="text-xs mt-1">Корзина</span>
        {cartItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemsCount}
          </span>
        )}
      </button>

      {/* Для продавцов - роутинг */}
      <Link
        to="/sellers"
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
          isActive('/sellers') ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
        }`}
        aria-label="Для продавцов"
      >
        <Store className="w-6 h-6" />
        <span className="text-xs mt-1">Продавцам</span>
      </Link>

      {/* О нас - роутинг */}
      <Link
        to="/about"
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
          isActive('/about') ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
        }`}
        aria-label="О нас"
      >
        <Info className="w-6 h-6" />
        <span className="text-xs mt-1">О нас</span>
      </Link>
    </footer>
  );
}