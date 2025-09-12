import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, Zap, Target } from "lucide-react";

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

  // Автосмена слайдов каждые 4 секунды (увеличил интервал)
  useEffect(() => {
    if (sliderProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % sliderProducts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sliderProducts.length]);

  const handleFeaturedClick = (product: Product) => {
    onProductClick?.(product);
    onScrollToProduct?.(product.id);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-xl border border-blue-200 p-3 mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Компактный заголовок */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-800 flex items-center space-x-1">
          <span>🔥</span>
          <span>Хиты</span>
        </h3>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Star className="w-3 h-3 text-yellow-500" />
          <span>Топ</span>
        </div>
      </div>
      <div className="warming-zone flex gap-3 min-h-16 lg:min-h-10 xl:min-h-8 h-auto">
        {/* Левая часть - 2 квадрата рекомендуемых товаров */}
        <div className="flex-1 grid grid-cols-2 gap-1">
          {featuredProducts.map((product) => (
            <div 
              key={product.id}
              onClick={() => handleFeaturedClick(product)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFeaturedClick(product);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Рекомендуемый товар: ${product.name}, цена ${product.price} рублей`}
              className="relative bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-110 hover:-rotate-1 transition-all duration-500 aspect-square border-2 border-gradient-to-r from-blue-200 to-purple-200 group focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
                loading="lazy"
                decoding="async"
              />
              {/* Градиент оверлей */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              {/* Информация о товаре */}
              <div className="absolute bottom-0 left-0 right-0 p-2 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-500">
                <p className="text-xs font-bold truncate drop-shadow-lg">{product.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs opacity-90">{product.price}₽/{product.unit}</p>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs">ТОП</span>
                  </div>
                </div>
              </div>
              {/* Компактный бейдж */}
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-lg">
                🔥
              </div>
              {/* Пульсирующий эффект */}
              <div className="absolute inset-0 rounded-xl border-2 border-red-400 opacity-0 group-hover:opacity-100 animate-ping" />
            </div>
          ))}
          
          {/* Заполняем пустыми блоками если товаров меньше 2 */}
          {Array.from({ length: 2 - featuredProducts.length }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center aspect-square hover:border-blue-300 transition-colors duration-300 group">
              <div className="text-gray-400 text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📦</div>
              <span className="text-gray-500 text-xs text-center font-medium">
                Скоро новые<br/>
                <span className="text-blue-600">предложения</span>
              </span>
              <div className="mt-1 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
        
        {/* Правая часть - слайдер с индикаторами */}
        <div className="flex-1 relative">
          {/* Слайдер */}
          <div className="w-full h-full bg-white rounded-xl overflow-hidden relative border-2 border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300">
            {sliderProducts.length > 0 ? (
              <div className="relative w-full h-full group">
                {sliderProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 scale-100 rotate-0' 
                        : 'opacity-0 scale-110 rotate-1'
                    }`}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: 'center center' }}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(30);
                        onProductClick?.(product);
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Информация о текущем слайде с улучшенным дизайном */}
                    {index === currentSlide && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-bold truncate drop-shadow-lg">{product.name}</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-white/90 text-xs">{product.price}₽/{product.unit}</p>
                              <div className="flex items-center space-x-1">
                                <Target className="w-3 h-3 text-green-400" />
                                <span className="text-green-400 text-xs font-semibold">ПРОМО</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white text-xs opacity-75">{index + 1}/{sliderProducts.length}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Анимированная рамка для активного слайда */}
                    {index === currentSlide && (
                      <div className="absolute inset-0 border-4 border-purple-400 rounded-xl opacity-50 animate-pulse" />
                    )}
                  </div>
                ))}
                
                {/* Индикаторы внутри слайдера */}
                {/* Улучшенные индикаторы с лучшей видимостью */}
                {sliderProducts.length > 1 && (
                  <div className="absolute bottom-2 right-2 flex space-x-1.5 bg-black/60 rounded-full px-2 py-1.5 backdrop-blur-sm">
                    {sliderProducts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white scale-125 shadow-sm' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                        aria-label={`Перейти к слайду ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
                

                
                {/* Боковые стрелки для ручного управления */}
                {sliderProducts.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentSlide(prev => prev === 0 ? sliderProducts.length - 1 : prev - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      aria-label="Предыдущий слайд"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentSlide(prev => (prev + 1) % sliderProducts.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      aria-label="Следующий слайд"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 group hover:from-blue-50 hover:to-purple-50 transition-all duration-500">
                <div className="text-gray-400 text-3xl mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">🎯</div>
                <span className="text-gray-500 text-xs text-center font-medium group-hover:text-blue-600 transition-colors duration-300">
                  Промо-товары<br/>
                  <span className="text-purple-600">появятся здесь</span>
                </span>
                <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}