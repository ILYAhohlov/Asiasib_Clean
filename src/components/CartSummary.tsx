import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  minOrder: string;
}

interface CartSummaryProps {
  items: CartItem[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Корзина пуста</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ваш заказ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Список товаров */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 py-2 border-b border-border/50 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {item.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} кг × {item.price} руб/кг
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <p className="font-semibold text-foreground">
                  {(item.price * item.quantity).toLocaleString()} руб
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Итоговая сумма */}
        <div className="border-t border-border pt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 -mx-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">Итого:</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {totalAmount.toLocaleString()} руб
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Количество товаров: {items.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}