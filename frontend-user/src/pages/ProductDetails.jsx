import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch main product information from backend (Node.js)
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const mainProduct = res.data.data || res.data;
        setProduct(mainProduct);

        // 2. Fetch recommendations from AI engine (Python)
        try {
          const aiRes = await axios.get(`http://localhost:5005/recommend/${id}`);
          
          if (aiRes.data.success && aiRes.data.data.length > 0) {
            // Fetch full details of products suggested by AI
            const allRes = await axios.get(`http://localhost:5000/api/products`);
            const allProducts = allRes.data.data || allRes.data;
            
            // Extract recommended IDs
            const recommendedIds = aiRes.data.data.map(item => item.id);
            
            // Filter all products to display only recommended ones
            const aiFiltered = allProducts.filter(p => recommendedIds.includes(p.id_product));
            setRecommendations(aiFiltered);
          } else {
            // Fallback: If AI finds no results, return to old logic (same category)
            fetchFallbackRecommendations(mainProduct.id_categorie, id);
          }
        } catch (aiErr) {
          console.error("AI Service not available, fallback to categories");
          fetchFallbackRecommendations(mainProduct.id_categorie, id);
        }

        setLoading(false);
      } catch (err) {
        console.error("Details error:", err);
        setLoading(false);
      }
    };

    // Fallback function if AI fails or returns no results
    const fetchFallbackRecommendations = async (catId, currentId) => {
      const recRes = await axios.get(`http://localhost:5000/api/products`);
      const allProducts = recRes.data.data || recRes.data;
      const filtered = allProducts
        .filter(p => p.id_categorie === catId && p.id_product !== parseInt(currentId))
        .slice(0, 4);
      setRecommendations(filtered);
    };

    fetchFullData();
    window.scrollTo(0, 0); 
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pacific"></div>
    </div>
  );

  if (!product) return <div className="text-center py-20 font-bold">Product not found.</div>;

  const getImageUrl = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=600";
    if (img.startsWith('http')) return img;
    return `http://localhost:5000/${img}`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      <div className="container mx-auto px-6 py-10 text-left">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-pacific">Home</Link>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
          <span className="text-slate-blue font-bold">{product.nom_produit}</span>
        </div>

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
                {product.nom_categorie || 'Collection'}
              </span>

              <h1 className="text-4xl font-black text-slate-blue mb-4 uppercase">
                {product.nom_produit}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                <span className="text-4xl font-black text-pacific">{product.prix} DH</span>
                <span className="text-gray-300 line-through">{(product.prix * 1.2).toFixed(2)} DH</span>
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

        {/* Recommendations - Now powered by AI */}
        <div className="mt-20">
          <h2 className="text-2xl font-black text-slate-blue mb-10 uppercase tracking-tighter">
            Products <span className="text-pacific">Recommended by AI</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.length > 0 ? (
              recommendations.map(item => (
                <ProductCard key={item.id_product} product={item} />
              ))
            ) : (
              <p className="col-span-4 text-gray-400 text-center">Loading recommendations...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
