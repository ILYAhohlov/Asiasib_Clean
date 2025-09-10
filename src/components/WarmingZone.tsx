import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  minOrder: number;
  unit: string;
  isFeatured?: boolean;
}

interface WarmingZoneProps {
  onProductClick?: (product: Product) => void;
}

export function WarmingZone({ onProductClick }: WarmingZoneProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?featured=true&limit=2`);
        if (response.ok) {
          const products = await response.json();
          const featured = products.filter((p: Product) => p.isFeatured).slice(0, 2);
          setFeaturedProducts(featured);
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        setFeaturedProducts([]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Временно показываем зону даже без рекомендуемых товаров
  // if (featuredProducts.length === 0) {
  //   return null;
  // }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-2">
      <div className="flex gap-4 h-32">
        {/* Левая часть - 2 блока */}
        <div className="flex-1 grid grid-rows-2 gap-2">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              onClick={() => onProductClick?.(product)}
              className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
                <p className="text-xs text-green-600 font-semibold">{product.price} р/{product.unit}</p>
              </div>
            </div>
          ))}
          
          {/* Если меньше 2 товаров, заполняем пустыми блоками */}
          {Array.from({ length: 2 - featuredProducts.length }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">Рекомендуемые</span>
            </div>
          ))}
        </div>
        
        {/* Правая часть - слайдер */}
        <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm">Слайдер</span>
        </div>
      </div>
    </div>
  );
}