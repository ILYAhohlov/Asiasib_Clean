import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

interface Product {
  id: string;
  name: string;
  image: string;
  images?: string[];
  price: number;
  category: string;
  minOrder: number;
  unit: string;
  description?: string;
  shelfLife?: string;
  allergens?: string;
}

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(product.minOrder);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const images = product.images || [product.image];
  const isQuantityValid = quantity >= product.minOrder;

  const increaseQuantity = () => {
    setQuantity(prev => prev + product.minOrder);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(product.minOrder, prev - product.minOrder));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (isQuantityValid) {
      onAddToCart(product, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок с кнопкой закрытия */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 pr-4">{product.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Изображения */}
          <div className="space-y-2">
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      currentImageIndex === index ? "border-blue-500" : "border-transparent"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="space-y-3">
            <div className="text-sm text-gray-500 uppercase">{product.category}</div>
            
            {product.description && (
              <p className="text-gray-700">{product.description}</p>
            )}

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Цена:</span>
                <span className="text-green-600 font-semibold">{product.price} руб/{product.unit}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Минимальный заказ:</span>
                <span className="text-gray-600">От {product.minOrder} {product.unit}</span>
              </div>

              {product.shelfLife && (
                <div className="flex justify-between">
                  <span className="font-medium">Срок хранения:</span>
                  <span className="text-gray-600">{product.shelfLife}</span>
                </div>
              )}

              {product.allergens && (
                <div className="flex justify-between">
                  <span className="font-medium">Аллергены:</span>
                  <span className="text-gray-600">{product.allergens}</span>
                </div>
              )}
            </div>
          </div>

          {/* Выбор количества */}
          <div className="space-y-2">
            <label className="font-medium text-gray-900">Количество:</label>
            <div className="flex items-center space-x-2">
              <Button
                onClick={decreaseQuantity}
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0"
                disabled={quantity <= product.minOrder}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min={product.minOrder}
                step={product.minOrder}
                className="w-20 text-center border border-gray-300 rounded px-2 py-1"
              />
              
              <Button
                onClick={increaseQuantity}
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-gray-600">{product.unit}</span>
            </div>
            
            {!isQuantityValid && (
              <p className="text-red-500 text-sm">
                Минимум {product.minOrder} {product.unit}
              </p>
            )}
          </div>

          {/* Кнопки действий */}
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={handleAddToCart}
              disabled={!isQuantityValid}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              Добавить {quantity} {product.unit}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}