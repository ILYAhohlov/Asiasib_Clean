import { Link } from "react-router-dom";
import { Store, Users, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { StickyFooter } from "../components/StickyFooter";

export function SellersPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Азия-Сибирь
            </Link>
            <nav className="flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Каталог</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">О нас</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Станьте нашим партнером
          </h1>
          <p className="text-xl mb-8 text-white">
            Размещайте свои товары на нашей платформе и увеличивайте продажи
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/admin">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Вход в личный кабинет
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Преимущества сотрудничества
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Широкая аудитория</h3>
              <p className="text-gray-600 text-sm">
                Доступ к тысячам покупателей по всему региону
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Рост продаж</h3>
              <p className="text-gray-600 text-sm">
                Увеличьте объем продаж с помощью нашей платформы
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Поддержка</h3>
              <p className="text-gray-600 text-sm">
                Персональный менеджер поможет с размещением товаров
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Надежность</h3>
              <p className="text-gray-600 text-sm">
                Гарантированные выплаты и прозрачные условия
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Условия сотрудничества</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Комиссия от 5% с продаж</li>
                <li>• Бесплатное размещение товаров</li>
                <li>• Еженедельные выплаты</li>
                <li>• Помощь в продвижении товаров</li>
                <li>• Аналитика и отчеты по продажам</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Свяжитесь с нами</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Телефон для партнеров:</p>
                  <p className="text-blue-600">+7 (913) 385-98-58</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-blue-600">partners@asiasib.ru</p>
                </div>
                <div>
                  <p className="font-medium">Время работы:</p>
                  <p className="text-gray-600">Пн-Пт: 9:00-18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Готовы начать сотрудничество?
          </h3>
          <p className="text-gray-600 mb-6">
            Войдите в личный кабинет или свяжитесь с нами для получения доступа
          </p>
          <Link to="/admin">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 border-2 border-blue-600 px-8 py-3 font-semibold shadow-lg">
              Войти в личный кабинет
            </Button>
          </Link>
        </div>
      </section>

      {/* Sticky Footer */}
      <StickyFooter 
        navigateToScreen={() => {}}
        cartItemsCount={0}
      />
    </div>
  );
}