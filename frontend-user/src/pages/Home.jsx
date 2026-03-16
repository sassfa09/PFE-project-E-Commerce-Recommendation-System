import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);
        setCategories(catRes.data.data || catRes.data || []);
        setProducts(prodRes.data.data || prodRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-pacific text-3xl font-black italic tracking-[0.3em]"
        >
          RECOMIND
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans text-slate-blue overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-[3rem] overflow-hidden border border-platinum shadow-xl flex flex-col md:flex-row items-center"
        >
          <div className="p-12 md:w-1/2 space-y-6 z-10">
            <span className="text-pacific font-bold text-xs tracking-widest uppercase flex items-center gap-2">
              <i className="fa-solid fa-microchip animate-pulse"></i> AI-Powered Shopping
            </span>
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Style that <br /> <span className="text-tangerine">Knows You.</span>
            </h1>
            <p className="text-slate-blue/60 text-lg">Personalized recommendations driven by our hybrid engine.</p>
            <Link to="/products" className="inline-block bg-slate-blue text-white px-10 py-4 rounded-full font-black hover:bg-pacific transition-all shadow-lg active:scale-95">
              Explore Now <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
          </div>
          <div className="md:w-1/2 h-64 md:h-[400px] bg-platinum/20 flex items-center justify-center relative">
            <i className="fa-solid fa-brain text-slate-blue/5 text-[15rem]"></i>
          </div>
        </motion.div>
      </section>

      {/* 2. CATEGORIES (Using Icons) */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 py-8 flex justify-start md:justify-center gap-10 overflow-x-auto no-scrollbar"
      >
        {categories.map((cat) => (
          <motion.div key={cat.id_categorie} variants={itemVariants}>
            <Link to={`/products?cat=${cat.id_categorie}`} className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-platinum flex items-center justify-center group-hover:bg-pacific group-hover:text-white group-hover:border-pacific transition-all duration-300">
                <i className="fa-solid fa-tag text-xl"></i>
              </div>
              <span className="mt-3 text-[10px] font-black text-slate-blue/50 group-hover:text-pacific uppercase tracking-wider">{cat.nom_categorie}</span>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* 3. FLASH SALE */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] p-8 border border-platinum shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-tangerine w-12 h-12 rounded-xl text-white flex items-center justify-center text-xl shadow-lg shadow-tangerine/20">
                <i className="fa-solid fa-bolt-lightning"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black italic">Flash Sale</h2>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-blue/40 uppercase">
                  <i className="fa-regular fa-clock"></i> Ends in: <span className="text-tangerine">09:54:12</span>
                </div>
              </div>
            </div>
            <Link to="/products" className="text-pacific font-black text-xs hover:underline uppercase tracking-widest">
              View All <i className="fa-solid fa-chevron-right ml-1"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => <ProductCard key={p.id_product} product={p} />)}
          </div>
        </motion.div>
      </section>

      {/* 4. AMAZON-STYLE HYBRID GRID */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-black italic mb-8 border-l-4 border-pacific pl-4 uppercase tracking-tighter">
          <i className="fa-solid fa-sparkles text-pacific mr-2"></i>Inspired by your trends
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-[2rem] border border-platinum shadow-sm flex flex-col hover:shadow-md transition-all">
            <h3 className="text-md font-black mb-4 flex items-center gap-2">
              <i className="fa-solid fa-history text-slate-blue/30"></i> Keep shopping for
            </h3>
            <div className="grid grid-cols-2 gap-3 flex-grow">
              {products.slice(4, 8).map((p) => (
                <Link key={p.id_product} to={`/product/${p.id_product}`} className="aspect-square bg-platinum/20 rounded-xl overflow-hidden border border-platinum/40">
                  <img src={`http://localhost:5000/${p.img_url}`} className="w-full h-full object-cover" alt="" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-platinum shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-pacific/10 text-pacific text-[9px] px-2 py-1 rounded-full font-black">AI PICK</div>
            <h3 className="text-md font-black mb-4 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-pacific"></i> Top Selection
            </h3>
            {products[8] && (
              <div className="flex-grow flex flex-col items-center">
                <img src={`http://localhost:5000/${products[8].img_url}`} className="w-full aspect-square object-cover rounded-xl mb-3" alt="" />
                <h4 className="font-bold text-xs text-center">{products[8].nom_produit}</h4>
                <p className="text-tangerine font-black text-lg">{products[8].prix} DH</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-platinum shadow-sm flex flex-col">
            <h3 className="text-md font-black mb-4 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-slate-blue/30"></i> Explore More
            </h3>
            <div className="grid grid-cols-2 gap-3 flex-grow">
              {categories.slice(0, 4).map((cat) => (
                <Link key={cat.id_categorie} to={`/products?cat=${cat.id_categorie}`} className="aspect-square bg-slate-blue/5 rounded-2xl flex items-center justify-center p-2 text-center hover:bg-pacific/5 transition-colors">
                   <span className="text-[9px] font-black uppercase tracking-tighter">{cat.nom_categorie}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-slate-blue p-8 rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pacific/20 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <i className="fa-solid fa-gem text-pacific text-2xl mb-4"></i>
              <h3 className="text-xl font-black italic leading-tight">Recomind Premium</h3>
              <p className="text-platinum/40 text-[10px] mt-2 font-medium">Unlock exclusive AI-driven tracking and deals.</p>
            </div>
            <button className="relative z-10 w-full py-3 bg-tangerine rounded-xl text-[10px] font-black hover:scale-105 transition-transform">
              UPGRADE NOW
            </button>
          </div>

        </div>
      </section>

      {/* 5. FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 py-16">
         <motion.div 
           whileInView={{ scale: [0.95, 1] }}
           className="bg-slate-blue rounded-[3.5rem] p-16 text-center text-white relative overflow-hidden shadow-2xl"
         >
            <div className="absolute top-0 left-0 w-64 h-64 bg-pacific/10 rounded-full blur-[100px] -ml-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black italic mb-8">
                Shop Beyond <span className="text-pacific underline decoration-tangerine underline-offset-8">Boundaries</span>
              </h2>
              <button className="bg-white text-slate-blue px-12 py-4 rounded-full font-black text-sm hover:bg-pacific hover:text-white transition-all transform hover:scale-110">
                Get Started <i className="fa-solid fa-paper-plane ml-2"></i>
              </button>
            </div>
         </motion.div>
      </section>

    </div>
  );
};

export default Home;