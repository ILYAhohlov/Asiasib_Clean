import { useState, useEffect, useMemo } from "react";
import { Search, Minus, Plus, ShoppingCart, Star, Zap, Leaf, Apple, Wheat } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { StickyFooter } from "./StickyFooter";
import { ProductModal } from "./ProductModal";
import { WarmingZone } from "./WarmingZone";
import { Button } from "./ui/button";
import { Screen } from "../App";

// Define a type for the product that includes the _id from the API
interface Product {
  id: string;
  _id?: string; // Supabase might return _id instead of id
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
  isFeatured?: boolean;
  isSlider?: boolean;
}

// Define a type for the product card props
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onCardClick: (product: Product) => void;
}

// ProductCard component (unchanged logic, but uses Product type)
function ProductCard({ product, onAddToCart, onCardClick }: ProductCardProps) {
  const [quantity, setQuantity] = useState(product.minOrder);
  const isQuantityValid = quantity >= product.minOrder;

  const increaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + product.minOrder);
  };

  const decreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(product.minOrder, prev - product.minOrder));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = parseInt(e.target.value);
    const safeValue = isNaN(value) || value < product.minOrder ? product.minOrder : value;
    setQuantity(safeValue);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const safeQuantity = Number(quantity) || product.minOrder;
    if (safeQuantity >= product.minOrder) {
      onAddToCart(product, safeQuantity);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 hover:-rotate-1 transition-all duration-500 cursor-pointer group relative"
      onClick={() => onCardClick(product)}
    >
      {/* Изображение с правильным центрированием */}
      <div className="relative w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: 'center center'
          }}
          loading="lazy"
        />
        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Бейдж категории */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
          {product.category === 'овощи' && <Leaf className="w-3 h-3 inline mr-1 text-green-600" />}
          {product.category === 'фрукты' && <Apple className="w-3 h-3 inline mr-1 text-red-500" />}
          {product.category === 'специи' && <Wheat className="w-3 h-3 inline mr-1 text-orange-500" />}
          {product.category}
        </div>
        {/* Бейдж "Новинка" или "Хит" */}
        {product.isFeatured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse">
            ⭐ ХИТ
          </div>
        )}
      </div>

      {/* Компактная информация */}
      <div className="p-3 space-y-2 bg-gradient-to-b from-white to-gray-50">
        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-600">4.8</span>
              </div>
              <span className="text-xs text-gray-500">Свежее</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-green-600 font-bold text-base">{product.price} ₽</p>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">/{product.unit}</span>
          </div>
          <p className="text-gray-600 text-xs flex items-center">
            <Zap className="w-3 h-3 mr-1 text-blue-500" />
            Мин. заказ: {product.minOrder} {product.unit}
          </p>
        </div>
        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Бейдж категории */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
          {product.category === 'овощи' && <Leaf className="w-3 h-3 inline mr-1 text-green-600" />}
          {product.category === 'фрукты' && <Apple className="w-3 h-3 inline mr-1 text-red-500" />}
          {product.category === 'специи' && <Wheat className="w-3 h-3 inline mr-1 text-orange-500" />}
          {product.category}
        </div>
        {/* Бейдж "Новинка" или "Хит" */}
        {product.isFeatured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse">
            ⭐ ХИТ
          </div>
        )}
      </div>

      {/* Информация с улучшенным дизайном */}
      <div className="p-4 space-y-3 bg-gradient-to-b from-white to-gray-50">
        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-600">4.8</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-500">Свежее</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-green-600 font-bold text-lg">{product.price} ₽</p>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">/{product.unit}</span>
          </div>
          <p className="text-gray-600 text-xs flex items-center">
            <Zap className="w-3 h-3 mr-1 text-blue-500" />
            Мин. заказ: {product.minOrder} {product.unit}
          </p>
        </div>

        {/* Компактный выбор количества */}
        <div className="space-y-1">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1.5">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= product.minOrder}
              className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md transition-all duration-300"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>

            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min={product.minOrder}
                step={product.minOrder}
                className="w-12 text-center border border-gray-200 rounded px-1 py-0.5 text-xs font-semibold focus:border-blue-500 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-xs text-gray-600">{product.unit}</span>
            </div>

            <button
              onClick={increaseQuantity}
              className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 flex items-center justify-center shadow-md transition-all duration-300"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>

          {!isQuantityValid && (
            <div className="flex items-center space-x-1 text-red-500 text-xs bg-red-50 p-1 rounded">
              <span>⚠️</span>
              <span>Мин. {product.minOrder} {product.unit}</span>
            </div>
          )}
        </div>

        {/* Компактная кнопка добавления в корзину */}
        <button
          onClick={handleAddToCart}
          disabled={!isQuantityValid}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl py-2 px-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed text-xs rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5"
        >
          <ShoppingCart className="w-3 h-3" />
          <span>Добавить {quantity} {product.unit}</span>
        </button>
      </div>
    </div>
  );
}

// Улучшенные категории с иконками
const categories = [
  { name: "все", icon: "🛒", color: "bg-gray-500" },
  { name: "овощи", icon: "🥬", color: "bg-green-500" },
  { name: "фрукты", icon: "🍎", color: "bg-red-500" },
  { name: "зелень", icon: "🌿", color: "bg-emerald-500" },
  { name: "ягоды", icon: "🫐", color: "bg-purple-500" },
  { name: "орехи", icon: "🥜", color: "bg-amber-600" },
  { name: "специи", icon: "🌶️", color: "bg-orange-500" }
];

// Define Props for CatalogScreen
interface CatalogScreenProps {
  navigateToScreen: (screen: Screen) => void;
  cartItemsCount: number;
  addToCart: (product: Product, quantity: number) => void;
  navigateToPage?: (page: "home" | "sellers" | "about" | "admin") => void;
}

export function CatalogScreen({ navigateToScreen, cartItemsCount, addToCart, navigateToPage }: CatalogScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("все");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Загрузка товаров с сервера
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        // MongoDB returns _id, map it to id for consistency
        const formattedData = data.map((product: any) => ({
          ...product,
          id: product._id || product.id
        }));
        setProducts(formattedData);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        const errorMessage = err.name === 'TypeError' && err.message.includes('fetch')
          ? 'Проблемы с сетью. Проверьте интернет.'
          : `Ошибка загрузки: ${err.message}`;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => 
    products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "все" || product.category.toLowerCase() === selectedCategory.toLowerCase())
    ), [products, searchTerm, selectedCategory]
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleScrollToProduct = (productId: string) => {
    // Поиск элемента по data-product-id
    const productElement = document.querySelector(`[data-product-id="${productId}"]`);
    if (productElement) {
      productElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-500 text-lg mb-4">Ошибка</p>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
            Повторить попытку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Хедер */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-lg font-semibold text-center mb-4 flex items-center justify-center space-x-2">
            <span className="text-red-600">Азия-Сибирь</span>
            <span className="text-gray-900">оптовый рынок онлайн</span>
          </h1>

          {/* Поисковая строка */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="🔍 Найти свежие продукты..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50 shadow-lg text-sm font-medium placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Сетка товаров */}
      <main className="container mx-auto px-4 py-2 space-y-4">
        {/* Зона прогрева */}
        <WarmingZone 
          onProductClick={handleProductClick} 
          onScrollToProduct={handleScrollToProduct}
        />
        
        {/* Компактные категории с горизонтальным скроллом */}
        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-2 px-4 min-w-max">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap flex items-center space-x-1.5 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex-shrink-0
                  ${selectedCategory === category.name
                    ? `${category.color} text-white ring-2 ring-offset-1 ring-white/50`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                <span className="text-sm">{category.icon}</span>
                <span>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Товары не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('все');
              }}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div 
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
          >
            {filteredProducts.map(product => (
              <div key={product.id} data-product-id={product.id}>
                <ProductCard 
                  product={product}
                  onAddToCart={addToCart}
                  onCardClick={handleProductClick}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Модал деталей товара */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={true}
          onClose={handleCloseModal}
          onAddToCart={addToCart}
        />
      )}

      {/* Sticky Footer */}
      <StickyFooter 
        navigateToScreen={navigateToScreen} 
        cartItemsCount={cartItemsCount}
        currentScreen="catalog"
        navigateToPage={navigateToPage}
      />
    </div>
  );
}