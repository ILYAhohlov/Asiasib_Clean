import { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { StickyFooter } from "./StickyFooter";
import { Button } from "./ui/button";
import { Screen } from "../App";

interface AboutScreenProps {
  navigateToScreen: (screen: Screen) => void;
  cartItemsCount: number;
}

export function AboutScreen({ navigateToScreen, cartItemsCount }: AboutScreenProps) {
  const [clickCount, setClickCount] = useState(0);

  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      setClickCount(0);
      navigateToScreen("admin");
    }
  };
  const handleTelegramChannel = () => {
    window.open("https://t.me/yourchannel", "_blank");
  };

  const handleSupport = () => {
    window.open("https://t.me/yoursupport", "_blank");
  };

  const handlePhoneCall = () => {
    window.open("tel:+79991234567", "_self");
  };

  const handleEmail = () => {
    window.open("mailto:info@optmarket.ru", "_self");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Хедер */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 
            className="text-2xl font-semibold text-center text-gray-900 cursor-pointer select-none"
            onClick={handleTitleClick}
          >
            О проекте
            {clickCount > 0 && clickCount < 5 && (
              <span className="text-xs text-gray-400 ml-2">({clickCount}/5)</span>
            )}
          </h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Основная информация */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Опт с рынка
          </h2>
          
          <div className="space-y-4 text-gray-700">
            <p>
              Мы доставляем оптовые овощи, фрукты и специи с рынка в Верх-Туле 
              в Новосибирск и окрестности.
            </p>
            
            <p>
              Наша миссия — обеспечить качественными продуктами питания по доступным 
              ценам с быстрой доставкой прямо до вашего склада или точки продаж.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Почему выбирают нас:
              </h3>
              <ul className="space-y-1 text-blue-800">
                <li>• Свежие продукты напрямую с рынка</li>
                <li>• Оптовые цены без посредников</li>
                <li>• Быстрая доставка по Новосибирску</li>
                <li>• Минимальный заказ от 10 кг</li>
                <li>• Гарантия качества продукции</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Контактная информация
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Телефон</p>
                <button
                  onClick={handlePhoneCall}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  +7 (999) 123-45-67
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <button
                  onClick={handleEmail}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  info@optmarket.ru
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Адрес склада</p>
                <p className="text-gray-700">с. Верх-Тула, рынок "Продукты"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Зона доставки */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Зона доставки
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Новосибирск (центр)</span>
              <span className="text-green-600 font-medium">Бесплатно</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Новосибирск (окраины)</span>
              <span className="text-blue-600 font-medium">500 руб</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Пригород (до 30 км)</span>
              <span className="text-blue-600 font-medium">1000 руб</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">По области</span>
              <span className="text-gray-600">По договоренности</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Минимальный заказ:</strong> 3000 руб для бесплатной доставки по центру
              </p>
            </div>
            
            {clickCount >= 3 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-xs">
                  Подсказка: нажмите на заголовок "О проекте" еще {5 - clickCount} раз для доступа к админ панели
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Время работы */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Время работы
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Понедельник - Пятница</span>
              <span className="font-medium">08:00 - 18:00</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-700">Суббота</span>
              <span className="font-medium">09:00 - 16:00</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-700">Воскресенье</span>
              <span className="text-red-600">Выходной</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              Заказы принимаютс�� круглосуточно через сайт. 
              Доставка осуществляется в рабочие часы.
            </p>
          </div>
        </div>

        {/* Социальные сети и связь */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Мы в соцсетях
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleTelegramChannel}
              variant="outline"
              className="flex items-center justify-start space-x-3 p-4 h-auto border-blue-200 hover:bg-blue-50"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Telegram-канал</p>
                <p className="text-sm text-gray-600">@optmarket_channel</p>
              </div>
            </Button>
            
            <Button
              onClick={handleSupport}
              variant="outline"
              className="flex items-center justify-start space-x-3 p-4 h-auto border-green-200 hover:bg-green-50"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Чат поддержки</p>
                <p className="text-sm text-gray-600">Быстрые ответы на вопросы</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Кнопка возврата */}
        <div className="text-center">
          <Button
            onClick={() => navigateToScreen("catalog")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
          >
            Вернуться к каталогу
          </Button>
        </div>
      </main>

      {/* Sticky Footer */}
      <StickyFooter 
        navigateToScreen={navigateToScreen} 
        cartItemsCount={cartItemsCount}
        currentScreen="about"
      />
    </div>
  );
}