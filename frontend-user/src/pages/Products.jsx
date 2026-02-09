import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(20000);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await api.get("/products");
        const data = res.data.data || res.data;
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchFromUrl = queryParams.get("search");
    const catFromUrl = queryParams.get("cat");

    if (searchFromUrl !== null) setSearchTerm(searchFromUrl);
    if (catFromUrl !== null) setSelectedCategory(catFromUrl);
  }, [location.search]);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter((p) =>
        p.nom_produit && p.nom_produit.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => 
        p.category === selectedCategory || String(p.id_categorie) === selectedCategory
      );
    }

    result = result.filter((p) => {
        const pPrice = Number(p.prix) || 0;
        return pPrice <= priceRange;
    });

    if (minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= minRating);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, minRating, products]);

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="bg-[#FBFCFC] min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row gap-10">
        
        {/* --- Sidebar Filter --- */}
        <aside className="w-full md:w-72 flex-shrink-0 space-y-10">
          
          {/* Category Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEEEEE]">
            <h3 className="text-sm font-black text-[#326273] mb-6 uppercase tracking-widest border-l-4 border-[#5C9EAD] pl-3">
              Catégories
            </h3>
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      className="w-4 h-4 accent-[#5C9EAD] cursor-pointer"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                    />
                    <span className={`text-sm transition-colors ${selectedCategory === cat ? 'font-bold text-[#326273]' : 'text-gray-500 group-hover:text-[#5C9EAD]'}`}>
                      {cat}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#EEEEEE] px-2 py-0.5 rounded-full text-gray-400 group-hover:bg-[#5C9EAD]/10 transition-colors">
                    {cat === "All" ? products.length : products.filter(p => p.category === cat).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEEEEE]">
            <h3 className="text-sm font-black text-[#326273] mb-6 uppercase tracking-widest border-l-4 border-[#E39774] pl-3">
              Budget
            </h3>
            <input
              type="range"
              min="0"
              max="20000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-[#EEEEEE] rounded-lg appearance-none cursor-pointer accent-[#5C9EAD]"
            />
            <div className="flex justify-between mt-5">
              <span className="text-xs font-bold text-gray-400">0 DH</span>
              <span className="text-sm font-black text-[#5C9EAD] bg-[#5C9EAD]/5 px-3 py-1 rounded-lg">
                Max: {priceRange} DH
              </span>
            </div>
          </div>

          {/* Rating Filter Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEEEEE]">
            <h3 className="text-sm font-black text-[#326273] mb-6 uppercase tracking-widest border-l-4 border-[#5C9EAD] pl-3">
              Évaluation
            </h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(star)}
                  className={`text-xl transition-all ${minRating >= star ? "text-[#E39774] scale-110" : "text-gray-200 hover:text-[#E39774]/50"}`}
                >
                  ★
                </button>
              ))}
              {minRating > 0 && (
                <button 
                  onClick={() => setMinRating(0)}
                  className="ml-auto text-[10px] font-bold text-gray-400 hover:text-red-400 uppercase tracking-tighter"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="flex-1">
          {/* Header & Search Summary */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#326273]">Boutique</h1>
              <p className="text-sm text-gray-400 mt-1">
                {filteredProducts.length} produits trouvés
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#EEEEEE] focus:border-[#5C9EAD]/50 focus:ring-4 focus:ring-[#5C9EAD]/5 outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-white border border-[#EEEEEE] animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id_product} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-[#EEEEEE]">
              <div className="w-20 h-20 bg-[#EEEEEE] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-box-open text-3xl text-gray-300"></i>
              </div>
              <h3 className="text-xl font-bold text-[#326273] mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-400 mb-8 max-w-xs mx-auto">Nous n'avons trouvé aucun résultat pour vos filtres actuels.</p>
              <button 
                onClick={() => {setSelectedCategory("All"); setPriceRange(20000); setSearchTerm(""); setMinRating(0);}}
                className="px-8 py-3 bg-[#326273] text-white font-bold rounded-xl hover:bg-[#5C9EAD] transition-all shadow-lg shadow-[#326273]/20 active:scale-95"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;