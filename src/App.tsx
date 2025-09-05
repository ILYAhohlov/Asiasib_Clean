import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sellers" element={<SellersPage />} />
        <Route path="/about" element={<AboutScreen navigateToScreen={() => {}} cartItemsCount={0} />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}