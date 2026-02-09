import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("http://localhost:5000/api/categories"),
          axios.get("http://localhost:5000/api/products")
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur Backend:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-pacific animate-pulse text-2xl tracking-tighter italic">RECOMIND Loading...</div>;

  return (
    <div className="bg-[#F4F7F9] min-h-screen">
      
      {/* 1. HERO MARKETPLACE SECTION */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Large Slider Banner */}
          <div className="lg:col-span-3 relative h-[500px] bg-slate-blue rounded-[40px] overflow-hidden group shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2000" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
              alt="Promo"
            />
            <div className="absolute inset-0 p-12 flex flex-col justify-center text-white">
              <span className="bg-white/20 backdrop-blur-md w-fit px-4 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Limited Edition</span>
              <h1 className="text-7xl font-black leading-tight mb-6">Explore the <br/> Future of <span className="text-tangerine italic">Tech.</span></h1>
              <Link to="/products" className="bg-white text-slate-blue px-10 py-4 rounded-2xl font-black w-fit hover:bg-pacific hover:text-white transition-all shadow-xl">
                Shop Collection
              </Link>
            </div>
          </div>

          {/* Right Side Promo Banners */}
          <div className="hidden lg:flex flex-col gap-6">
            <div className="flex-1 bg-gradient-to-br from-pacific to-blue-600 rounded-[30px] p-8 text-white relative overflow-hidden shadow-lg group">
               <h3 className="text-2xl font-black relative z-10">Smart <br/> Watches</h3>
               <p className="text-sm opacity-80 mt-2">Up to 40% OFF</p>
               <img src="https://cdn-icons-png.flaticon.com/512/665/665961.png" className="absolute -right-4 -bottom-4 w-32 opacity-20 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex-1 bg-white rounded-[30px] p-8 border border-gray-100 shadow-sm group">
               <h3 className="text-2xl font-black text-slate-blue">New <br/> Sneakers</h3>
               <Link to="/products?cat=fashion" className="inline-block mt-4 text-tangerine font-bold hover:translate-x-2 transition-transform">Shop →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CIRCULAR CATEGORIES SECTION */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-xl font-black text-slate-blue uppercase tracking-widest">Shop by Department</h2>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {categories.map((cat) => (
            <Link key={cat.id_categorie} to={`/products?cat=${cat.id_categorie}`} className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-transparent group-hover:border-pacific group-hover:shadow-xl transition-all duration-300">
                <span className="text-3xl transform group-hover:scale-125 transition-transform">📦</span>
              </div>
              <span className="mt-4 text-[11px] font-black text-gray-500 uppercase tracking-tighter group-hover:text-pacific">{cat.nom_categorie}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS ROW */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-blue tracking-tighter">Recommended For You</h2>
              <p className="text-gray-400 font-medium">Based on your recent interest</p>
            </div>
            <Link to="/products" className="bg-gray-50 text-slate-blue px-6 py-2 rounded-xl font-bold text-sm hover:bg-pacific hover:text-white transition-all">View All Products</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
           {Array.isArray(products) && products.slice(0, 8).map((product) => (
  <ProductCard key={product.id_product} product={product} />
))}
          </div>
        </div>
      </section>

      {/* 4. NEWSLETTER BANNER (Amazon Style) */}
      <section className="container mx-auto px-6 pb-20">
        <div className="bg-slate-blue rounded-[40px] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <h2 className="text-4xl font-black text-white mb-4 relative z-10">Don't miss the best deals!</h2>
          <p className="text-gray-300 mb-8 relative z-10">Subscribe and get 10% discount on your first order.</p>
          <div className="max-w-md mx-auto flex gap-2 relative z-10">
            <input type="email" placeholder="Your email address" className="flex-1 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-pacific/30" />
            <button className="bg-pacific text-white px-8 py-4 rounded-2xl font-bold hover:bg-tangerine transition-colors shadow-lg">Join Now</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;