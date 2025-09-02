import { useState } from "react";
import { API_URL } from "../config";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Info } from "lucide-react";

interface OrderFormData {
  address: string;
  phone: string;
  comment: string;
  name?: string; // Добавлено поле name
}

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  isSubmitting?: boolean;
  items: any[]; // Предполагается, что items передаются из родительского компонента
  total: number; // Предполагается, что total передается из родительского компонента
}

export function OrderForm({ onSubmit, isSubmitting = false, items, total }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    address: "",
    phone: "",
    comment: "",
    name: "" // Инициализация name
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};

    if (!formData.name || !formData.name.trim()) { // Валидация имени
      newErrors.name = "Имя обязательно";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Адрес доставки обязателен";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (!/^[+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone.trim()) {
      setError("Пожалуйста, укажите номер телефона");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        customerInfo: {
          name: formData.name || 'Не указано',
          phone: formData.phone,
          address: formData.address,
          telegramId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id
        },
        totalAmount: total,
        comments: formData.comment,
        orderSource: window.Telegram?.WebApp ? 'telegram' : 'web'
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const savedOrder = await response.json();
        console.log("Заказ успешно отправлен:", savedOrder);

        onSubmit({ // Используем onSubmit из пропсов
          customerInfo: { ...formData }, // Передаем полный formData, включая name
          items,
          total
        });
      } else {
        throw new Error('Ошибка при отправке заказа');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setError("Произошла ошибка при отправке заказа. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Очистить ошибку для поля при изменении
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Информация для доставки</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Уведомление */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Заказ будет обработан вручную. Мы свяжемся с вами для подтверждения деталей доставки.
            </AlertDescription>
          </Alert>

          {/* Имя */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Ваше имя <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Введите ваше имя"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`${errors.name ? "border-destructive focus:border-destructive focus:ring-destructive" : ""}`}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Адрес доставки */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Адрес доставки <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Укажите полный адрес доставки"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={`${errors.address ? "border-destructive focus:border-destructive focus:ring-destructive" : ""}`}
              aria-describedby={errors.address ? "address-error" : undefined}
              required
            />
            {errors.address && (
              <p id="address-error" className="text-sm text-destructive" role="alert">
                {errors.address}
              </p>
            )}
          </div>

          {/* Телефон */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Номер телефона <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`${errors.phone ? "border-destructive focus:border-destructive focus:ring-destructive" : ""}`}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              required
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-destructive" role="alert">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Комментарий */}
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий к заказу</Label>
            <Textarea
              id="comment"
              placeholder="Дополнительные пожелания или комментарии к заказу"
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Укажите любые особые требования к доставке или товарам
            </p>
          </div>

          {/* Кнопка подтверждения */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
            disabled={loading}
          >
            {loading ? "Отправка..." : "Подтвердить заказ"}
          </Button>

          {error && (
            <p id="order-error" className="text-sm text-destructive text-center" role="alert">
              {error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}