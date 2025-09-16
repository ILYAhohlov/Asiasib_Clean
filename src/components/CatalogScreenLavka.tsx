import { useState, useEffect, useMemo } from "react";
import { Search, Minus, Plus, ShoppingCart, Star, Zap } from "lucide-react";
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

// ProductCard component в стиле Lavka
function ProductCardLavka({ product, onAddToCart, onCardClick }: ProductCardProps) {
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const safeQuantity = Number(quantity) || product.minOrder;
    if (safeQuantity >= product.minOrder) {
      onAddToCart(product, safeQuantity);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => onCardClick(product)}
    >
      {/* Изображение */}
      <div className="relative w-full h-20 bg-gray-50">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {product.isFeatured && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            ХИТ
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-1.5 space-y-1">
        <h3 className="font-medium text-xs text-gray-900 leading-tight line-clamp-1">{product.name}</h3>
        
        <div className="flex items-baseline space-x-1">
          <span className="text-sm font-bold text-gray-900">{product.price}₽</span>
          <span className="text-xs text-gray-500">/{product.unit}</span>
        </div>

        {/* Компактные кнопки */}
        <div className="flex items-center justify-between bg-gray-50 rounded-md p-0.5">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= product.minOrder}
            className="w-5 h-5 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center justify-center"
          >
            <Minus className="w-2.5 h-2.5" />
          </button>

          <span className="font-medium text-xs">{quantity}</span>

          <button
            onClick={increaseQuantity}
            className="w-5 h-5 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!isQuantityValid}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-1 px-1 font-medium disabled:opacity-50 text-xs rounded-md"
        >
          В корзину
        </button>
      </div>
    </div>
  );
}

// Категории с иконками
const categories = [
  { id: "все", name: "Все", icon: "🛒" },
  { id: "овощи", name: "Овощи", icon: "🥕" },
  { id: "фрукты", name: "Фрукты", icon: "🍎" },
  { id: "зелень", name: "Зелень", icon: "🌿" },
  { id: "ягоды", name: "Ягоды", icon: "🍓" },
  { id: "орехи", name: "Орехи", icon: "🥜" },
  { id: "специи", name: "Специи", icon: "🌶️" }
];

// Define Props for CatalogScreenLavka
interface CatalogScreenLavkaProps {
  navigateToScreen: (screen: Screen) => void;
  cartItemsCount: number;
  addToCart: (product: Product, quantity: number) => void;
  navigateToPage?: (page: "home" | "sellers" | "about" | "admin") => void;
  onToggleDesign?: () => void;
  isNewDesign?: boolean;
}

export function CatalogScreenLavka({ navigateToScreen, cartItemsCount, addToCart, navigateToPage, onToggleDesign, isNewDesign }: CatalogScreenLavkaProps) {
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
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        const formattedData = data.map((product: any) => ({
          ...product,
          id: product._id || product.id
        }));
        setProducts(formattedData);
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error('Error fetching products:', err);
        
        if (err.name === 'AbortError') {
          setError('Превышено время ожидания. Проверьте подключение к серверу.');
        } else {
          const errorMessage = err.name === 'TypeError' && err.message.includes('fetch')
            ? 'Проблемы с сервером. Сервер может спать - подождите 30 секунд.'
            : `Ошибка сервера: ${err.message}`;
          setError(errorMessage);
        }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
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
          <Button onClick={() => window.location.reload()} className="mt-4 bg-red-500 hover:bg-red-600 text-white">
            Повторить попытку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Хедер в стиле Lavka */}
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3">
          {/* Логотип */}
          <div className="text-center mb-3">
            <h1 className="text-lg font-bold">
              <span className="text-red-500">Азия-Сибирь</span>
              <span className="text-gray-900 text-xs block">оптовый рынок</span>
            </h1>
          </div>

          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Найти продукты..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="px-4 py-3 space-y-4">
        {/* Категории */}
        <div className="overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex flex-col items-center p-2 rounded-xl transition-all duration-200 min-w-[60px]
                  ${selectedCategory === category.id
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span className="text-lg mb-0.5">{category.icon}</span>
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* WarmingZone */}
        <div className="w-fit mx-auto">
          <WarmingZone 
            onProductClick={handleProductClick} 
            onScrollToProduct={handleScrollToProduct}
          />
        </div>

        {/* Товары */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Товары не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {filteredProducts.map(product => (
              <div key={product.id} data-product-id={product.id}>
                <ProductCardLavka 
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
        onToggleDesign={onToggleDesign}
        isNewDesign={isNewDesign}
      />
    </div>
  );
}