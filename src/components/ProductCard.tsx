import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  minOrder: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 hover:border-blue-300 hover:-translate-y-1">
      <CardContent className="p-4">
        {/* Изображение товара */}
        <div className="w-full h-25 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Информация о товаре */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 leading-tight">
            {product.name}
          </h3>
          
          <div className="space-y-1">
            <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {product.price} руб/кг
            </p>
            <p className="text-sm text-gray-600">
              {product.minOrder}
            </p>
          </div>
          
          {/* Кнопка добавить в корзину */}
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
          >
            Добавить в корзину
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}