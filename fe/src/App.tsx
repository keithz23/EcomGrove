import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Feature from "./pages/Feature";
import Shop from "./pages/shop/Shop";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Profile from "./pages/Profile";
import ProductDetails from "./components/product/ProductDetails";
import CartDetails from "./pages/cart/CartDetails";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Checkout from "./pages/shop/Checkout";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = new QueryClient();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feature" element={<Feature />} />
        <Route path="/shop" element={<Shop />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Home />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Home />}
        />
        <Route
          path="/profile"
          element={!isAuthenticated ? <Login /> : <Profile />}
        />
        <Route path={`/product/:id`} element={<ProductDetails />} />
        <Route path="/cart-details" element={<CartDetails />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
