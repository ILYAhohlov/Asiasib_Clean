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
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onCardClick(product)}
    >
      {/* Изображение с правильным центрированием */}
      <div className="relative w-full h-36 bg-gray-100 rounded-t-xl overflow-hidden" style={{ minHeight: '144px', maxHeight: '144px' }}>
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: 'center center'
          }}
          loading="lazy"
        />
        {/* Бейдж хита */}
        {product.isFeatured && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
            ХИТ
          </div>
        )}
      </div>

      {/* Информация о товаре */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-1 leading-tight">{product.name}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-gray-600">4.8</span>
            </div>
            <span className="text-xs text-gray-500">Свежее</span>
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

        {/* Выбор количества */}
        <div className="space-y-1">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1.5">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= product.minOrder}
              className="w-6 h-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300"
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
              className="w-6 h-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 flex items-center justify-center transition-all duration-300"
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

        {/* Кнопка добавления в корзину */}
        <button
          onClick={handleAddToCart}
          disabled={!isQuantityValid}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed text-xs rounded-lg transition-all duration-300 flex items-center justify-center space-x-1.5"
        >
          <ShoppingCart className="w-3 h-3" />
          <span>Добавить {quantity} {product.unit}</span>
        </button>
      </div>
    </div>
  );
}

// Профессиональные категории без эмодзи
const categories = ["все", "овощи", "фрукты", "зелень", "ягоды", "орехи", "специи"];

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
        <div className="relative z-10">
          <WarmingZone 
            onProductClick={handleProductClick} 
            onScrollToProduct={handleScrollToProduct}
          />
        </div>
        
        {/* Профессиональные категории */}
        <div className="flex justify-center mb-4 relative z-20">
          <div className="w-full max-w-lg">
            <div className="flex flex-wrap justify-center gap-2 pb-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap
                    ${selectedCategory === category
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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