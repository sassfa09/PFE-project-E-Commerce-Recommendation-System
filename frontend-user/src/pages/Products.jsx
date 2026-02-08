import { useState, useEffect } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // جلب السلعة كاملة من الباك
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await api.get("/products");
        const data = res.data.data || res.data;
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // دالة البحث والتصفية
  useEffect(() => {
    let result = products;

    // Filter by Search
    if (searchTerm) {
      result = result.filter((p) =>
        p.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // استخراج التصنيفات الموجودة فعليا في السلعة
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-blue mb-4">Explore Our Catalog</h1>
        <p className="text-gray-500">Find the best deals on high-quality products.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-platinum">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-platinum focus:border-pacific outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="h-6 w-6 text-gray-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          className="px-6 py-3 rounded-xl border border-platinum focus:border-pacific outline-none bg-white font-medium text-slate-blue"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pacific"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id_product} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 font-medium">No products match your search.</p>
        </div>
      )}
    </div>
  );
};

export default Products;