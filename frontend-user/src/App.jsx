import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute"; 
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
    
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

    
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;