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
  isSlider?: boolean;
}

interface WarmingZoneProps {
  onProductClick?: (product: Product) => void;
  onScrollToProduct?: (productId: string) => void;
}

export function WarmingZone({ onProductClick, onScrollToProduct }: WarmingZoneProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [sliderProducts, setSliderProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          signal: controller.signal
        });
        if (response.ok) {
          const products = await response.json();
          const featured = products.filter((p: Product) => p.isFeatured).slice(0, 2);
          const slider = products.filter((p: Product) => p.isSlider).slice(0, 3);
          setFeaturedProducts(featured);
          setSliderProducts(slider);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setFeaturedProducts([]);
          setSliderProducts([]);
        }
      }
    };

    fetchProducts();
    
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (sliderProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % sliderProducts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sliderProducts.length]);

  const handleProductClick = (product: Product) => {
    onProductClick?.(product);
    onScrollToProduct?.(product.id);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-800">🔥 Хиты</h3>
        <span className="text-xs text-gray-500">Топ</span>
      </div>
      
      <div className="flex gap-3" style={{ height: '50vh' }}>
        {/* Левая часть - рекомендуемые товары (вертикально) */}
        <div className="flex-1 flex flex-col gap-2">
          {featuredProducts.slice(0, 2).map((product, index) => (
            <div 
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="flex-1 relative bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold">
                ХИТ
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-2 z-10">
                <p className="text-white text-xs font-bold truncate">{product.name}</p>
                <p className="text-white text-xs">{product.price}₽/{product.unit}</p>
              </div>
            </div>
          ))}
          
          {/* Пустые блоки если товаров меньше 2 */}
          {Array.from({ length: 2 - featuredProducts.length }).map((_, index) => (
            <div key={`empty-${index}`} className="flex-1 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Скоро</span>
            </div>
          ))}
        </div>
        
        {/* Правая часть - слайдер */}
        <div className="flex-1 relative">
          <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden relative border border-gray-200">
            {sliderProducts.length > 0 ? (
              <div className="relative w-full h-full">
                {sliderProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => onProductClick?.(product)}
                      loading="lazy"
                    />
                    {index === currentSlide && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-2 z-10">
                        <p className="text-white text-sm font-bold truncate">{product.name}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-white text-xs">{product.price}₽/{product.unit}</p>
                          <span className="text-green-400 text-xs font-semibold">ПРОМО</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Индикаторы */}
                {sliderProducts.length > 1 && (
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    {sliderProducts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentSlide ? 'bg-white' : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-xs">Промо</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}