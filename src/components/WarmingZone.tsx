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
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (response.ok) {
          const products = await response.json();
          const featured = products.filter((p: Product) => p.isFeatured).slice(0, 2);
          const slider = products.filter((p: Product) => p.isSlider).slice(0, 3);
          setFeaturedProducts(featured);
          setSliderProducts(slider);
        } else {
          setFeaturedProducts([]);
          setSliderProducts([]);
        }
      } catch (error) {
        setFeaturedProducts([]);
        setSliderProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Автосмена слайдов каждые 3 секунды
  useEffect(() => {
    if (sliderProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % sliderProducts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliderProducts.length]);

  const handleFeaturedClick = (product: Product) => {
    onProductClick?.(product);
    onScrollToProduct?.(product.id);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-2">
      <div className="flex gap-4 h-32">
        {/* Левая часть - 2 квадрата рекомендуемых товаров */}
        <div className="flex-1 grid grid-rows-2 gap-2">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              onClick={() => handleFeaturedClick(product)}
              className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 aspect-square"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
              />
            </div>
          ))}
          
          {/* Заполняем пустыми блоками если товаров меньше 2 */}
          {Array.from({ length: 2 - featuredProducts.length }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">Рекомендуемые</span>
            </div>
          ))}
        </div>
        
        {/* Правая часть - слайдер с индикаторами */}
        <div className="flex-1 flex gap-2">
          {/* Слайдер */}
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
            {sliderProducts.length > 0 ? (
              <div className="relative w-full h-full">
                {sliderProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer"
                      style={{ objectPosition: 'center' }}
                      onClick={() => {/* TODO: добавить обработчик клика */}}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500 text-sm">Слайдер</span>
              </div>
            )}
          </div>
          
          {/* Индикаторы */}
          {sliderProducts.length > 1 && (
            <div className="flex flex-col justify-center space-y-2">
              {sliderProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentSlide ? 'bg-black' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}