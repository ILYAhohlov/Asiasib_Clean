import { useState, useMemo } from "react";
import { Header } from "./Header";
import { CategoryFilter } from "./CategoryFilter";
import { ProductGrid } from "./ProductGrid";
import { Product } from "./ProductCard";

// Мокированные данные товаров
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Огурцы свежие",
    image: "https://images.unsplash.com/photo-1560433802-62c9db426a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBjdWN1bWJlcnxlbnwxfHx8fDE3NTY0MjcxOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 50,
    minOrder: "от 10 кг",
    category: "vegetables"
  },
  {
    id: "2",
    name: "Помидоры",
    image: "https://images.unsplash.com/photo-1683008952375-410ae668e6b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHRvbWF0b2VzfGVufDF8fHx8MTc1NjQyNzE5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 75,
    minOrder: "от 5 кг",
    category: "vegetables"
  },
  {
    id: "3",
    name: "Морковь",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNhcnJvdHN8ZW58MXx8fHwxNzU2NDI3MjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 40,
    minOrder: "от 15 кг",
    category: "vegetables"
  },
  {
    id: "4",
    name: "Яблоки Гала",
    image: "https://images.unsplash.com/photo-1623815242959-fb20354f9b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGFwcGxlc3xlbnwxfHx8fDE3NTYzMDQ4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 120,
    minOrder: "от 20 кг",
    category: "fruits"
  },
  {
    id: "5",
    name: "Апельсины",
    image: "https://images.unsplash.com/photo-1613334728649-d3d2bcde2d29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yYW5nZXN8ZW58MXx8fHwxNzU2MzY4OTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 90,
    minOrder: "от 10 кг",
    category: "fruits"
  },
  {
    id: "6",
    name: "Бананы",
    image: "https://images.unsplash.com/photo-1745488791982-92e422ca5290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJhbmFuYXN8ZW58MXx8fHwxNzU2MzY4OTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 85,
    minOrder: "от 8 кг",
    category: "fruits"
  },
  {
    id: "7",
    name: "Смесь специй",
    image: "https://images.unsplash.com/photo-1528480011926-ec6106b835a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBoZXJic3xlbnwxfHx8fDE3NTYzNDExNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 350,
    minOrder: "от 1 кг",
    category: "spices"
  },
  {
    id: "8",
    name: "Черный перец",
    image: "https://images.unsplash.com/photo-1649952052743-5e8f37c348c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBlcHBlciUyMHNwaWNlfGVufDF8fHx8MTc1NjQyNzIwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 280,
    minOrder: "от 0.5 кг",
    category: "spices"
  }
];

interface ProductCatalogProps {
  onGoToOrder: () => void;
}

export function ProductCatalog({ onGoToOrder }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Фильтрация товаров по категории и поисковому запросу
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    setCartItemsCount(prev => prev + 1);
    alert(`Товар "${product.name}" добавлен в корзину!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartItemsCount={cartItemsCount}
        onGoToOrder={onGoToOrder}
      />
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedCategory === "all" ? "Все товары" : 
             selectedCategory === "vegetables" ? "Овощи" :
             selectedCategory === "fruits" ? "Фрукты" : "Специи"}
          </h2>
          <p className="text-gray-600 mt-1">
            Найдено товаров: {filteredProducts.length}
          </p>
        </div>
        
        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
        />
      </main>
    </div>
  );
}