import { Search, ShoppingCart } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItemsCount?: number;
  onGoToOrder?: () => void;
}

export function Header({ searchQuery, onSearchChange, cartItemsCount = 0, onGoToOrder }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-900">Азия-Сибирь онлайн рынок</h1>
          </div>
          
          {/* Поисковая строка */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Кнопка корзины */}
          {onGoToOrder && (
            <div className="flex-shrink-0">
              <Button
                onClick={onGoToOrder}
                variant="outline"
                className="relative flex items-center space-x-2 px-4 py-2 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:hover:scale-100"
                disabled={cartItemsCount === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Корзина</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}