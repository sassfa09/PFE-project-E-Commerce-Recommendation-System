import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageProducts from "./pages/Products/ManageProducts";
import AddProduct from "./pages/Products/AddProduct"; 
import ManageCategories from "./pages/Categories/ManageCategories";
import AddCategory from "./pages/Categories/AddCategory";
import EditProduct from "./pages/Products/EditProduct";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products/manage" element={<ManageProducts />} />
                <Route path="/products/add" element={<AddProduct />} /> 
                <Route path="/products/edit/:id" element={<EditProduct />} />
                <Route path="/categories/manage" element={<ManageCategories />} /> 
                <Route path="/categories/add" element={<AddCategory />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;