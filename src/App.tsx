import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { SellersPage } from "./pages/SellersPage";
import { AboutScreen } from "./components/AboutScreen";
import { AdminPage } from "./pages/AdminPage";
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

export type Screen = "catalog" | "cart" | "admin" | "admin-login" | "about" | "sellers";

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
  const [currentPage, setCurrentPage] = useState<"home" | "sellers" | "about" | "admin">("home");

  const navigateToPage = (page: "home" | "sellers" | "about" | "admin") => {
    setCurrentPage(page);
  };

  const navigateToScreen = (screen: Screen) => {
    if (screen === "about") {
      setCurrentPage("about");
    } else if (screen === "admin") {
      setCurrentPage("admin");
    }
  };

  if (currentPage === "sellers") {
    return <SellersPage />;
  }

  if (currentPage === "about") {
    return <AboutScreen navigateToScreen={navigateToScreen} cartItemsCount={0} navigateToPage={navigateToPage} />;
  }

  if (currentPage === "admin") {
    return <AdminPage />;
  }

  return <HomePage navigateToPage={navigateToPage} />;
}