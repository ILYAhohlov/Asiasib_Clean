import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  minOrder: number;
  unit: string;
}

export function MinimalCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProducts(data.map((p: any) => ({ ...p, id: p._id || p.id })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Ошибка: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Каталог товаров</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg border p-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-32 object-cover rounded mb-2"
              loading="lazy"
            />
            <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
            <p className="text-green-600 font-bold">{product.price} ₽/{product.unit}</p>
            <p className="text-xs text-gray-500">Мин. заказ: {product.minOrder} {product.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}