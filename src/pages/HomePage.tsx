import { useState } from "react";
import { CatalogScreen } from "../components/CatalogScreen";
import { CartScreen } from "../components/CartScreen";
import { OrderPage } from "../components/OrderPage";
import { CartItem } from "../App";

export type HomeScreen = "catalog" | "cart" | "order";

export function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<HomeScreen>("catalog");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const navigateToScreen = (screen: HomeScreen) => {
    setCurrentScreen(screen);
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: Number(i.quantity) + Number(item.quantity) }
            : i
        );
      }
      return [...prev, {
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        minOrder: Number(item.minOrder) || 1
      }];
    });
  };

  const updateCartItem = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (currentScreen === "catalog") {
    return (
      <CatalogScreen
        navigateToScreen={navigateToScreen}
        cartItemsCount={cartItemsCount}
        addToCart={addToCart}
      />
    );
  }

  if (currentScreen === "cart") {
    return (
      <CartScreen
        navigateToScreen={navigateToScreen}
        cartItemsCount={cartItemsCount}
        cartItems={cartItems}
        updateCartItem={updateCartItem}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    );
  }

  if (currentScreen === "order") {
    return (
      <OrderPage
        onBackToCatalog={() => navigateToScreen("catalog")}
      />
    );
  }

  return null;
}