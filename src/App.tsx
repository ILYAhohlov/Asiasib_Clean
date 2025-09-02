import { useState, useEffect } from "react";
import { CatalogScreen } from "./components/CatalogScreen";
import { CartScreen } from "./components/CartScreen";
import { AdminScreen } from "./components/AdminScreen";
import { AdminLoginScreen } from "./components/AdminLoginScreen";
import { AboutScreen } from "./components/AboutScreen";
// Ensure API client is initialized
import "./api/client";

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            username?: string;
          };
        };
        sendData: (data: string) => void;
      };
    };
  }
}

export type Screen = "catalog" | "cart" | "admin" | "admin-login" | "about";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  minOrder: number;
  unit: string;
  quantity: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("catalog");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);

  // Telegram WebApp initialization
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      setIsTelegramWebApp(true);
      const tg = window.Telegram.WebApp;
      
      tg.ready();
      tg.expand();
      
      // Set theme for Telegram
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams?.bg_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams?.text_color || '#000000');
      
      // Get user data from Telegram
      if (tg.initDataUnsafe?.user) {
        setTelegramUser(tg.initDataUnsafe.user);
      }

      // Configure main button for cart
      if (cartItems.length > 0) {
        tg.MainButton.text = `Корзина (${cartItems.length})`;
        tg.MainButton.show();
        tg.MainButton.onClick(() => setCurrentScreen("cart"));
      } else {
        tg.MainButton.hide();
      }
    }
  }, [cartItems]);

  const navigateToScreen = (screen: Screen) => {
    if (screen === "admin") {
      if (isAdminAuthenticated) {
        setCurrentScreen("admin");
      } else {
        setCurrentScreen("admin-login");
      }
    } else {
      setCurrentScreen(screen);
    }
  };

  const handleAdminLogin = (password: string): boolean => {
    setIsAdminAuthenticated(true);
    setCurrentScreen("admin");
    return true;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentScreen("catalog");
  };

  const addToCart = (product: any, quantity: number) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
        minOrder: product.minOrder,
        unit: product.unit,
        quantity
      }]);
    }
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const commonProps = {
    navigateToScreen,
    cartItemsCount: cartItems.length
  };

  switch (currentScreen) {
    case "catalog":
      return <CatalogScreen {...commonProps} addToCart={addToCart} />;
    case "cart":
      return (
        <CartScreen 
          {...commonProps} 
          cartItems={cartItems}
          updateCartItem={updateCartItem}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
      );
    case "admin":
      return <AdminScreen {...commonProps} onLogout={handleAdminLogout} />;
    case "admin-login":
      return <AdminLoginScreen {...commonProps} onLogin={handleAdminLogin} />;
    case "about":
      return <AboutScreen {...commonProps} />;
    default:
      return <CatalogScreen {...commonProps} addToCart={addToCart} />;
  }
}