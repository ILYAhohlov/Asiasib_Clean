import { ShoppingCart, Info, MessageCircle, Send, Settings } from "lucide-react";
import { Screen } from "../App";

interface StickyFooterProps {
  navigateToScreen: (screen: Screen) => void;
  cartItemsCount: number;
  currentScreen?: Screen;
  showAdminButton?: boolean;
}

export function StickyFooter({ navigateToScreen, cartItemsCount, currentScreen, showAdminButton = false }: StickyFooterProps) {
  const handleTelegramChannel = () => {
    window.open("https://t.me/yourchannel", "_blank");
  };

  const handleSupport = () => {
    window.open("https://t.me/yoursupport", "_blank");
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around px-4 z-50">
      {/* Корзина */}
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

      {/* О проекте */}
      <button
        onClick={() => navigateToScreen("about")}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
          currentScreen === "about" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
        }`}
        aria-label="О проекте"
      >
        <Info className="w-6 h-6" />
        <span className="text-xs mt-1">О нас</span>
      </button>

      {/* Telegram-канал */}
      <button
        onClick={handleTelegramChannel}
        className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-500 transition-colors"
        aria-label="Telegram-канал"
      >
        <Send className="w-6 h-6" />
        <span className="text-xs mt-1">Канал</span>
      </button>

      {/* Чат поддержки или Админ */}
      {showAdminButton ? (
        <button
          onClick={() => navigateToScreen("admin")}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
            currentScreen === "admin" || currentScreen === "admin-login" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
          }`}
          aria-label="Админ панель"
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs mt-1">Админ</span>
        </button>
      ) : (
        <button
          onClick={handleSupport}
          className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-500 transition-colors"
          aria-label="Чат поддержки"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Поддержка</span>
        </button>
      )}
    </footer>
  );
}