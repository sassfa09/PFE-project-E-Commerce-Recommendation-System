import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
 
const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct]               = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading]               = useState(true);
 
  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setLoading(true);
 
        // 1. Fetch main product from Node.js backend
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const mainProduct = res.data.data || res.data;
        setProduct(mainProduct);
 
        // 2. Fetch AI recommendations directly — no second products fetch needed
        //    The AI engine already returns img_url, nom, prix, categorie
        try {
          const aiRes = await axios.get(`http://localhost:5005/recommend/${id}`);
 
          if (aiRes.data.success && aiRes.data.data.length > 0) {
            // Map AI response to the shape ProductCard expects
            const aiProducts = aiRes.data.data.map(item => ({
              id_product:    item.id,
              nom_produit:   item.nom,
              prix:          item.prix,
              img_url:       item.img_url,
              nom_categorie: item.categorie,
              match_level:   item.match_level,
              popularity:    item.popularity,
              views:         item.views,
            }));
            setRecommendations(aiProducts);
          } else {
            fetchFallback(mainProduct.id_categorie, id);
          }
        } catch (aiErr) {
          console.error("AI Service not available, falling back to category");
          fetchFallback(mainProduct.id_categorie, id);
        }
 
        setLoading(false);
      } catch (err) {
        console.error("Details error:", err);
        setLoading(false);
      }
    };
 
    // Fallback: same-category products if AI is down
    const fetchFallback = async (catId, currentId) => {
      try {
        const recRes = await axios.get(`http://localhost:5000/api/products`);
        const all = recRes.data.data || recRes.data;
        const filtered = all
          .filter(p => p.id_categorie === catId && p.id_product !== parseInt(currentId))
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 8);
        setRecommendations(filtered);
      } catch (e) {
        setRecommendations([]);
      }
    };
 
    fetchFullData();
    window.scrollTo(0, 0);
  }, [id]);
 
  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pacific"></div>
    </div>
  );
 
  if (!product) return (
    <div className="text-center py-20 font-bold">Product not found.</div>
  );
 
  const getImageUrl = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=600";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img}`;
  };
 
  // Badge config per match level
  const matchBadge = (level) => {
    switch (level) {
      case "Frequently Bought Together":
        return { icon: "fa-cart-shopping",      label: "Bought Together", bg: "#FFF3E0", color: "#E65100" };
      case "Top Recommendation":
        return { icon: "fa-star",               label: "Top Pick",        bg: "#EFF6FF", color: "#1D4ED8" };
      case "Trending & Popular":
        return { icon: "fa-fire",               label: "Trending",        bg: "#FFF1F2", color: "#BE123C" };
      case "Same Category":
        return { icon: "fa-layer-group",        label: "Same Category",   bg: "#F0FDF4", color: "#15803D" };
      case "Similar Style":
        return { icon: "fa-wand-magic-sparkles",label: "Similar Style",   bg: "#FAF5FF", color: "#7E22CE" };
      default:
        return { icon: "fa-thumbs-up",          label: "You May Like",    bg: "#F8FAFC", color: "#475569" };
    }
  };
 
  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      <div className="container mx-auto px-6 py-10 text-left">
 
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-pacific">Home</Link>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
          <Link to="/products" className="hover:text-pacific">Products</Link>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
          <span className="text-slate-blue font-bold">{product.nom_produit}</span>
        </div>
 
        {/* Product card */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
 
            {/* Image */}
            <div className="p-8 bg-[#FDFDFD] flex items-center justify-center border-r border-gray-50">
              <div className="aspect-square w-full max-w-[500px] rounded-3xl overflow-hidden bg-gray-50 border">
                <img
                  src={getImageUrl(product.img_url)}
                  alt={product.nom_produit}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
 
            {/* Details */}
            <div className="p-8 md:p-12">
              <span className="bg-pacific/10 text-pacific text-xs font-black px-4 py-1.5 rounded-full uppercase mb-6 inline-block">
                {product.nom_categorie || "Collection"}
              </span>
 
              <h1 className="text-4xl font-black text-slate-blue mb-4 uppercase">
                {product.nom_produit}
              </h1>
 
              <div className="flex items-center gap-6 mb-8">
                <span className="text-4xl font-black text-pacific">{product.prix} DH</span>
                <span className="text-gray-300 line-through">
                  {(product.prix * 1.2).toFixed(2)} DH
                </span>
              </div>
 
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
 
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-slate-blue text-white py-5 rounded-2xl font-black text-lg hover:bg-pacific transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
 
        {/* AI Recommendations */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-10">
            <i className="fa-solid fa-wand-magic-sparkles text-pacific text-xl"></i>
            <h2 className="text-2xl font-black text-slate-blue uppercase tracking-tighter">
              Products <span className="text-pacific">Recommended by AI</span>
            </h2>
          </div>
 
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.length > 0 ? (
              recommendations.map(item => (
                <div key={item.id_product} className="relative">
                  {item.match_level && (() => {
                    const { icon, label, bg, color } = matchBadge(item.match_level);
                    return (
                      <div
                        className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{ background: bg, color, fontSize: 9, fontWeight: 800,
                                 letterSpacing: "0.06em", textTransform: "uppercase",
                                 boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}
                      >
                        <i className={`fa-solid ${icon}`} style={{ fontSize: 9 }} />
                        {label}
                      </div>
                    );
                  })()}
                  <ProductCard product={item} />
                </div>
              ))
            ) : (
              <p className="col-span-4 text-gray-400 text-center py-10">
                No recommendations available.
              </p>
            )}
          </div>
        </div>
 
      </div>
    </div>
  );
};
 
export default ProductDetails;