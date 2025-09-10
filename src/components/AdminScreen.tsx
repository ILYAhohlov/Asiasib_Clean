import { useState, useEffect } from "react";
import { Search, Upload, Edit, Trash2, Plus, LogOut } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { StickyFooter } from "./StickyFooter";
import { Button } from "./ui/button";
import { Screen } from "../App";

interface AdminScreenProps {
  navigateToScreen: (screen: Screen) => void;
  cartItemsCount: number;
  onLogout: () => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  minOrder: number;
  description: string;
  shelfLife: string;
  allergens: string;
  image: string;
  isFeatured?: boolean;
  isSlider?: boolean;
}

interface Order {
  _id: string;
  items: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  clientPhone: string;
  clientAddress: string;
  clientName?: string;
  totalAmount: number;
  status: "Принят" | "В обработке" | "В доставке" | "Завершен" | "Отменен";
  comments?: string;
  createdAt: string;
  orderSource: string;
  // B2B поля
  bulkOrderText?: string;
  attachedFileName?: string;
  attachedFileUrl?: string;
  parseResults?: {
    success: string[];
    failed: string[];
  };
  orderType?: 'regular' | 'b2b';
}

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  minOrder: string;
  unit: string;
  description: string;
  shelfLife: string;
  allergens: string;
  images: File[];
  isFeatured: boolean;
  isSlider: boolean;
}

export function AdminScreen({ navigateToScreen, cartItemsCount, onLogout }: AdminScreenProps) {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    category: "овощи",
    price: "",
    minOrder: "",
    unit: "кг",
    description: "",
    shelfLife: "",
    allergens: "",
    images: [],
    isFeatured: false,
    isSlider: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }

        const token = localStorage.getItem('adminToken');

        if (token) {
          const ordersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();

            setOrders(ordersData);
          } else {

          }
        }
      } catch (error) {

      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    setProductForm(prev => ({ ...prev, images: files }));
  };

  const transliterate = (text: string): string => {
    const map: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      ' ': '-', '_': '-'
    };
    return text.toLowerCase().split('').map(char => map[char] || char).join('').replace(/[^a-z0-9.-]/g, '');
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      const cleanFileName = transliterate(file.name);
      const fileName = `${Date.now()}-${cleanFileName}`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        return result.imageUrl;
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {

      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&crop=center';
    }
  };

  const handleProductSubmit = async () => {
    if (!productForm.name || !productForm.price || !productForm.minOrder) {
      alert("Заполните обязательные поля");
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      // Загрузка изображения
      let imageUrl = editingProduct ? editingProduct.image : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&crop=center";
      if (productForm.images.length > 0) {
        imageUrl = await uploadImageToSupabase(productForm.images[0]);
      }
      
      const productData = {
        name: productForm.name,
        category: productForm.category,
        price: parseInt(productForm.price),
        minOrder: parseInt(productForm.minOrder),
        unit: productForm.unit,
        description: productForm.description,
        shelfLife: productForm.shelfLife,
        allergens: productForm.allergens,
        image: imageUrl,
        isFeatured: productForm.isFeatured,
        isSlider: productForm.isSlider
      };
      
      // Добавляем ID только для редактирования
      if (editingProduct) {
        productData.id = editingProduct.id;
      }

      const url = editingProduct 
        ? `${import.meta.env.VITE_API_URL}/api/products/${editingProduct.id}`
        : `${import.meta.env.VITE_API_URL}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? result : p));
        setEditingProduct(null);
      } else {
        setProducts(prev => [...prev, result]);
      }

      setProductForm({
        name: "",
        category: "овощи",
        price: "",
        minOrder: "",
        unit: "кг",
        description: "",
        shelfLife: "",
        allergens: "",
        images: [],
        isFeatured: false,
        isSlider: false
      });

      alert("Товар успешно сохранен!");
    } catch (error) {

      alert("Ошибка при сохранении товара.");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      minOrder: product.minOrder.toString(),
      unit: product.unit || "кг",
      description: product.description,
      shelfLife: product.shelfLife,
      allergens: product.allergens,
      images: [],
      isFeatured: product.isFeatured || false,
      isSlider: product.isSlider || false
    });
    
    // Прокрутка к форме редактирования
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Удалить товар?")) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setProducts(prev => prev.filter(p => p.id !== id));
        alert("Товар успешно удален!");
      } catch (error) {

        alert("Ошибка при удалении товара.");
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedOrder = await response.json();
      setOrders(prev => prev.map(order => order._id === orderId ? updatedOrder : order));
      alert("Статус заказа обновлен!");
    } catch (error) {

      alert("Ошибка при обновлении статуса заказа.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Админ дашборд
            </h1>

            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => setActiveTab("products")}
              className={`flex-1 ${activeTab === "products" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Товары
            </Button>
            <Button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 ${activeTab === "orders" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Заказы
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                {editingProduct ? "Редактировать товар" : "Добавить товар"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название *
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="овощи">Овощи</option>
                    <option value="фрукты">Фрукты</option>
                    <option value="специи">Специи</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена (руб/кг) *
                  </label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мин. объем *
                  </label>
                  <input
                    type="number"
                    value={productForm.minOrder}
                    onChange={(e) => setProductForm(prev => ({ ...prev, minOrder: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Единица измерения *
                  </label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="кг">Килограмм (кг)</option>
                    <option value="ящик">Ящик</option>
                    <option value="шт">Штука (шт)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full h-20 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Срок хранения
                  </label>
                  <input
                    type="text"
                    value={productForm.shelfLife}
                    onChange={(e) => setProductForm(prev => ({ ...prev, shelfLife: e.target.value }))}
                    placeholder="7 дней"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Аллергены
                  </label>
                  <input
                    type="text"
                    value={productForm.allergens}
                    onChange={(e) => setProductForm(prev => ({ ...prev, allergens: e.target.value }))}
                    placeholder="Нет"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фото (до 3 штук)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Выбрать изображения</span>
                    </label>
                    {productForm.images.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {productForm.images.length} файл(ов) выбрано
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Рекомендуемый товар</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productForm.isSlider}
                      onChange={(e) => setProductForm(prev => ({ ...prev, isSlider: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Показать в слайдере</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={handleProductSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {editingProduct ? "Сохранить" : "Добавить"}
                </Button>

                {editingProduct && (
                  <Button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        category: "овощи",
                        price: "",
                        minOrder: "",
                        unit: "кг",
                        description: "",
                        shelfLife: "",
                        allergens: "",
                        images: [],
                        isFeatured: false,
                        isSlider: false
                      });
                    }}
                    variant="outline"
                  >
                    Отмена
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                <h3 className="font-semibold text-gray-900">Товары</h3>

                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Поиск"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Все</option>
                    <option value="овощи">Овощи</option>
                    <option value="фрукты">Фрукты</option>
                    <option value="специи">Специи</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr className="text-left">
                      <th className="pb-2">Фото</th>
                      <th className="pb-2">Название</th>
                      <th className="pb-2">Категория</th>
                      <th className="pb-2">Цена</th>
                      <th className="pb-2">Мин. объем</th>
                      <th className="pb-2">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-b border-gray-100">
                        <td className="py-2">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-2 font-medium">{product.name}</td>
                        <td className="py-2 capitalize">{product.category}</td>
                        <td className="py-2">{product.price} р/{product.unit}</td>
                        <td className="py-2">{product.minOrder} {product.unit}</td>
                        <td className="py-2">
                          <div className="flex space-x-1">
                            <Button
                              onClick={() => handleEditProduct(product)}
                              variant="outline"
                              size="sm"
                              className="p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
                              variant="outline"
                              size="sm"
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Заказы</h3>
              <div className="flex space-x-2">
                {selectedOrders.length > 0 && (
                  <Button
                    onClick={async () => {
                      if (confirm(`Удалить ${selectedOrders.length} выбранных заказов?`)) {
                        try {
                          const token = localStorage.getItem('adminToken');
                          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/delete-selected`, {
                            method: 'DELETE',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ orderIds: selectedOrders })
                          });
                          if (response.ok) {
                            setOrders(prev => prev.filter(order => !selectedOrders.includes(order._id)));
                            setSelectedOrders([]);
                            alert(`${selectedOrders.length} заказов удалено`);
                          }
                        } catch (error) {
                          alert('Ошибка удаления');
                        }
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Удалить ({selectedOrders.length})
                  </Button>
                )}
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                >
                  Обновить
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr className="text-left">
                    <th className="pb-2">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(orders.map(order => order._id));
                          } else {
                            setSelectedOrders([]);
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Тип</th>
                    <th className="pb-2">Имя</th>
                    <th className="pb-2">Товары</th>
                    <th className="pb-2">Телефон</th>
                    <th className="pb-2">Адрес</th>
                    <th className="pb-2">Комментарии</th>
                    <th className="pb-2">Статус</th>
                    <th className="pb-2">Сумма</th>
                    <th className="pb-2">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-b border-gray-100">
                      <td className="py-2">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders(prev => [...prev, order._id]);
                            } else {
                              setSelectedOrders(prev => prev.filter(id => id !== order._id));
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="py-2 font-medium">#{order._id?.slice(-6) || 'N/A'}</td>
                      <td className="py-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.orderType === 'b2b' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.orderType === 'b2b' ? 'B2B' : 'Обычный'}
                        </span>
                      </td>
                      <td className="py-2">{order.clientName || 'Не указано'}</td>
                      <td className="py-2 max-w-xs">
                        {order.items?.map(item => `${item?.name || 'Товар'} (${item?.quantity || 0}кг)`).join(', ') || 'Нет товаров'}
                        {order.bulkOrderText && (
                          <div className="text-xs text-blue-600 mt-1">
                            B2B заявка: {order.bulkOrderText.substring(0, 50)}...
                          </div>
                        )}
                        {order.attachedFileName && (
                          <div className="text-xs text-green-600 mt-1">
                            Файл: 
                            {order.attachedFileUrl ? (
                              <a 
                                href={order.attachedFileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="underline hover:text-green-800"
                              >
                                {order.attachedFileName}
                              </a>
                            ) : (
                              order.attachedFileName
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-2">{order.clientPhone || 'Не указан'}</td>
                      <td className="py-2 max-w-xs truncate">{order.clientAddress || 'Не указан'}</td>
                      <td className="py-2 max-w-xs truncate text-sm">{order.comments || '-'}</td>
                      <td className="py-2">
                        <select
                          value={order.status || 'Принят'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as Order["status"])}
                          className={`text-xs px-2 py-1 rounded-full border-0 ${
                            order.status === "Принят" ? "bg-yellow-100 text-yellow-800" :
                            order.status === "В обработке" ? "bg-orange-100 text-orange-800" :
                            order.status === "В доставке" ? "bg-blue-100 text-blue-800" :
                            order.status === "Завершен" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}
                        >
                          <option value="Принят">Принят</option>
                          <option value="В обработке">В обработке</option>
                          <option value="В доставке">В доставке</option>
                          <option value="Завершен">Завершен</option>
                          <option value="Отменен">Отменен</option>
                        </select>
                      </td>
                      <td className="py-2 font-semibold">{(order.totalAmount || 0).toLocaleString()} руб</td>
                      <td className="py-2 text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ru-RU') : 'Не указана'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <StickyFooter 
        navigateToScreen={navigateToScreen} 
        cartItemsCount={cartItemsCount}
        currentScreen="admin"
      />
    </div>
  );
}