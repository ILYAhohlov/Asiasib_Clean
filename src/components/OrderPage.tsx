import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { OrderProgressBar } from "./OrderProgressBar";
import { CartSummary, CartItem } from "./CartSummary";
import { OrderForm } from "./OrderForm";

interface OrderPageProps {
  onBackToCatalog: () => void;
}

// Мокированные данные корзины для демонстрации
const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Огурцы свежие",
    image: "https://images.unsplash.com/photo-1560433802-62c9db426a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBjdWN1bWJlcnxlbnwxfHx8fDE3NTY0MjcxOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 50,
    quantity: 10,
    minOrder: "от 10 кг"
  },
  {
    id: "2",
    name: "Яблоки Гала",
    image: "https://images.unsplash.com/photo-1623815242959-fb20354f9b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGFwcGxlc3xlbnwxfHx8fDE3NTYzMDQ4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 120,
    quantity: 5,
    minOrder: "от 20 кг"
  },
  {
    id: "3",
    name: "Черный перец",
    image: "https://images.unsplash.com/photo-1649952052743-5e8f37c348c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBlcHBlciUyMHNwaWNlfGVufDF8fHx8MTc1NjQyNzIwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 280,
    quantity: 2,
    minOrder: "от 0.5 кг"
  }
];

export function OrderPage({ onBackToCatalog }: OrderPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrderSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      // Имитация отправки заказа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Заказ успешно оформлен!\n\nАдрес: ${formData.address}\nТелефон: ${formData.phone}\n${formData.comment ? `Комментарий: ${formData.comment}\n` : ''}Сумма заказа: ${mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} руб\n\nМы свяжемся с вами в ближайшее время для подтверждения.`);
      
      // После успешного оформления можно вернуться в каталог
      onBackToCatalog();
    } catch (error) {
      alert("Произошла ошибка при оформлении заказа. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Хедер с кнопкой возврата */}
      <header className="w-full bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBackToCatalog}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад к каталогу</span>
              </Button>
            </div>
            <h1 className="font-semibold text-foreground">Азия-Сибирь онлайн рынок</h1>
          </div>
        </div>
      </header>

      {/* Прогресс-бар */}
      <OrderProgressBar currentStep={2} />

      {/* Основной контент */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Форма заказа */}
          <div className="lg:order-1">
            <OrderForm 
              onSubmit={handleOrderSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Корзина */}
          <div className="lg:order-2">
            <div className="sticky top-8">
              <CartSummary items={mockCartItems} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}