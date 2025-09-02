import { useState } from "react";
import { Minus, Plus, Trash2, Upload, FileText } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { StickyFooter } from "./StickyFooter";
import { Button } from "./ui/button";
import { Screen, CartItem } from "../App";

interface CartScreenProps {
  navigateToScreen: (screen: Screen) => void;
  cartItemsCount: number;
  cartItems: CartItem[];
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

interface OrderForm {
  phone: string;
  address: string;
  comments: string;
}

export function CartScreen({ 
  navigateToScreen, 
  cartItemsCount, 
  cartItems, 
  updateCartItem, 
  removeFromCart,
  clearCart
}: CartScreenProps) {
  const [bulkText, setBulkText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    phone: "",
    address: "",
    comments: ""
  });
  const [parseResult, setParseResult] = useState<{ success: string[]; failed: string[] } | null>(null);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWeight = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isOverWeight = totalWeight > 800;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item && newQuantity >= item.minOrder) {
      updateCartItem(id, newQuantity);
    }
  };

  const increaseQuantity = (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      handleQuantityChange(id, item.quantity + item.minOrder);
    }
  };

  const decreaseQuantity = (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      const newQuantity = item.quantity - item.minOrder;
      if (newQuantity >= item.minOrder) {
        handleQuantityChange(id, newQuantity);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const parseBulkOrder = () => {
    // Мокированная логика парсинга
    const lines = bulkText.trim().split('\n');
    const success: string[] = [];
    const failed: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed) {
        // Простой парсинг формата "товар:количество"
        if (trimmed.includes(':')) {
          const [product] = trimmed.split(':');
          if (product.toLowerCase().includes('огурц') || 
              product.toLowerCase().includes('яблок') ||
              product.toLowerCase().includes('перец')) {
            success.push(trimmed);
          } else {
            failed.push(trimmed + ' - товар не найден');
          }
        } else {
          failed.push(trimmed + ' - неверный формат');
        }
      }
    });

    setParseResult({ success, failed });
  };

  const handleFormSubmit = async () => {
    if (!orderForm.phone || !orderForm.address) {
      alert("Пожалуйста, заполните телефон и адрес доставки");
      return;
    }

    if (cartItems.length === 0) {
      alert("Корзина пуста");
      return;
    }

    // Мокированная отправка заказа
    try {
      alert(`Заказ успешно оформлен!
      
Телефон: ${orderForm.phone}
Адрес: ${orderForm.address}
${orderForm.comments ? `Комментарии: ${orderForm.comments}\n` : ''}
Общий вес: ${totalWeight} кг
Сумма: ${totalAmount.toLocaleString()} руб

Мы свяжемся с вами в ближайшее время для подтверждения.`);
      
      clearCart();
      setOrderForm({ phone: "", address: "", comments: "" });
      navigateToScreen("catalog");
    } catch (error) {
      alert("Произошла ошибка при оформлении заказа");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Хедер */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Ваша корзина
          </h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Список товаров в корзине */}
        {cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => decreaseQuantity(item.id)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          disabled={item.quantity <= item.minOrder}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="w-12 text-center text-sm">
                          {item.quantity} {item.unit}
                        </span>
                        
                        <Button
                          onClick={() => increaseQuantity(item.id)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {(item.price * item.quantity).toLocaleString()} руб
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.price} руб/{item.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => removeFromCart(item.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">Корзина пуста</p>
            <Button 
              onClick={() => navigateToScreen("catalog")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Перейти к каталогу
            </Button>
          </div>
        )}

        {/* Загрузка списка */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Загрузка списка</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Введите список товаров:
              </label>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="огурцы:10 кг&#10;яблоки:20 кг&#10;перец:5 кг"
                className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="text-center text-gray-500">или</div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Загрузите файл:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".txt,.csv,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Выбрать файл</span>
                </label>
                {selectedFile && (
                  <span className="text-sm text-gray-600">{selectedFile.name}</span>
                )}
              </div>
            </div>
            
            <Button
              onClick={parseBulkOrder}
              disabled={!bulkText.trim() && !selectedFile}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Загрузить и добавить
            </Button>
            
            {parseResult && (
              <div className="space-y-2 text-sm">
                {parseResult.success.length > 0 && (
                  <div>
                    <p className="text-green-600 font-medium">Найдено:</p>
                    <ul className="text-green-600">
                      {parseResult.success.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parseResult.failed.length > 0 && (
                  <div>
                    <p className="text-red-600 font-medium">Не найдено:</p>
                    <ul className="text-red-600">
                      {parseResult.failed.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Форма заказа */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Оформление заказа</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес доставки *
                </label>
                <input
                  type="text"
                  value={orderForm.address}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="г. Новосибирск, ул. Ленина, д. 1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Комментарии
                </label>
                <textarea
                  value={orderForm.comments}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Дополнительные пожелания к заказу"
                  className="w-full h-20 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Итого */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Общий вес:</span>
                <span className={isOverWeight ? "text-red-600 font-semibold" : ""}>
                  {totalWeight} кг
                </span>
              </div>
              
              {isOverWeight && (
                <p className="text-red-600 text-sm">
                  Превышен максимальный вес доставки (800 кг)
                </p>
              )}
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Итого к оплате:</span>
                <span className="text-green-600">{totalAmount.toLocaleString()} руб</span>
              </div>
            </div>
            
            <Button
              onClick={handleFormSubmit}
              disabled={!orderForm.phone || !orderForm.address || isOverWeight}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3"
            >
              Оформить заказ
            </Button>
          </div>
        )}
      </main>

      {/* Sticky Footer */}
      <StickyFooter 
        navigateToScreen={navigateToScreen} 
        cartItemsCount={cartItemsCount}
        currentScreen="cart"
      />
    </div>
  );
}