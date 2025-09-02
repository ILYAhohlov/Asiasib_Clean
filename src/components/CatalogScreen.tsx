import { useState, useEffect } from "react";
import { Search, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { StickyFooter } from "./StickyFooter";
import { ProductModal } from "./ProductModal";
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
    const value = parseInt(e.target.value) || 0;
    setQuantity(value);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isQuantityValid) {
      onAddToCart(product, quantity);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onCardClick(product)}
    >
      {/* Изображение */}
      <div className="w-full h-48 bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Информация */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{product.category}</p>
        </div>

        <div className="space-y-1">
          <p className="text-green-600 font-semibold text-lg">{product.price} руб/{product.unit}</p>
          <p className="text-gray-600 text-sm">От {product.minOrder} {product.unit}</p>
        </div>

        {/* Выбор количества */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              onClick={decreaseQuantity}
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
              disabled={quantity <= product.minOrder}
            >
              <Minus className="w-3 h-3" />
            </Button>

            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={product.minOrder}
              step={product.minOrder}
              className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
              onClick={(e) => e.stopPropagation()}
            />

            <Button
              onClick={increaseQuantity}
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-3 h-3" />
            </Button>

            <span className="text-sm text-gray-600">{product.unit}</span>
          </div>

          {!isQuantityValid && (
            <p className="text-red-500 text-xs">
              Минимум {product.minOrder} {product.unit}
            </p>
          )}
        </div>

        {/* Кнопка добавить в корзину */}
        <Button
          onClick={handleAddToCart}
          disabled={!isQuantityValid}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          Добавить {quantity} {product.unit}
        </Button>
      </div>
    </div>
  );
}

// Mock categories for the filter
const categories = ["все", "овощи", "фрукты", "специи"];

// Define Props for CatalogScreen
interface CatalogScreenProps {
  navigateToScreen: (screen: Screen) => void;
  cartItemsCount: number;
  addToCart: (product: Product, quantity: number) => void;
}

export function CatalogScreen({ navigateToScreen, cartItemsCount, addToCart }: CatalogScreenProps) {
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
        setError(`Ошибка загрузки товаров: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "все" || product.category.toLowerCase() === selectedCategory.toLowerCase())
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
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
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-4">
            Азия-Сибирь - оптовый рынок онлайн
          </h1>

          {/* Поисковая строка */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск товаров"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Сетка товаров */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="flex overflow-x-auto space-x-4 pb-2 no-scrollbar">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                    ${selectedCategory === category
                      ? 'bg-blue-500 text-white'
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
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} // Use product.id which is mapped from Supabase's _id
                product={product}
                onAddToCart={addToCart}
                onCardClick={handleProductClick}
              />
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
      />
    </div>
  );
}