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
    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 p-3 mb-3 shadow-sm">
      {/* Заголовок секции */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">🔥 Горячие предложения</h3>
        <div className="text-xs text-gray-500">Обновляется каждый день</div>
      </div>
      <div className="flex gap-3 h-20">
        {/* Левая часть - 2 квадрата рекомендуемых товаров */}
        <div className="flex-1 grid grid-cols-2 gap-1">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              onClick={() => handleFeaturedClick(product)}
              className="relative bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 aspect-square border border-gray-200 group"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
              />
              {/* Градиент оверлей для текста */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Информация о товаре */}
              <div className="absolute bottom-0 left-0 right-0 p-1.5 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs font-semibold truncate">{product.name}</p>
                <p className="text-xs opacity-90">{product.price}₽/{product.unit}</p>
              </div>
              {/* Бейдж "ХИТ" */}
              <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                ХИТ
              </div>
            </div>
          ))}
          
          {/* Заполняем пустыми блоками если товаров меньше 2 */}
          {Array.from({ length: 2 - featuredProducts.length }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center aspect-square">
              <div className="text-gray-400 text-lg mb-1">📦</div>
              <span className="text-gray-400 text-xs text-center">Скоро новые<br/>предложения</span>
            </div>
          ))}
        </div>
        
        {/* Правая часть - слайдер с индикаторами */}
        <div className="flex-1 relative">
          {/* Слайдер */}
          <div className="w-full h-full bg-white rounded-lg overflow-hidden relative border border-gray-200 shadow-sm">
            {sliderProducts.length > 0 ? (
              <div className="relative w-full h-full group">
                {sliderProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer"
                      style={{ objectPosition: 'center' }}
                      onClick={() => onProductClick?.(product)}
                    />
                    {/* Информация о текущем слайде */}
                    {index === currentSlide && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-semibold truncate">{product.name}</p>
                        <p className="text-white/90 text-xs">{product.price}₽/{product.unit}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Индикаторы внутри слайдера */}
                {/* Индикаторы с улучшенным дизайном */}
                {sliderProducts.length > 1 && (
                  <div className="absolute bottom-2 right-2 flex space-x-1.5 bg-black/30 rounded-full px-2 py-1 backdrop-blur-sm">
                    {sliderProducts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white scale-125 shadow-sm' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Прогресс-бар автосмены */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20">
                  <div 
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ 
                      width: sliderProducts.length > 1 ? `${((Date.now() % 3000) / 3000) * 100}%` : '0%'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <div className="text-gray-400 text-xl mb-1">🎯</div>
                <span className="text-gray-500 text-xs text-center">Промо-товары<br/>появятся здесь</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}