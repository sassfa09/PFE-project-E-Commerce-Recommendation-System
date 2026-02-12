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
        
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);

     
        
        const recRes = await axios.get(`http://localhost:5000/api/products?id_categorie=${res.data.id_categorie}`);
        
       
        const filteredRecs = recRes.data
          .filter(p => p.id_product !== parseInt(id))
          .slice(0, 4); 
        
        setRecommendations(filteredRecs);
        setLoading(false);
      } catch (err) {
        console.error("Erreur details:", err);
        setLoading(false);
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

  if (!product) return <div className="text-center py-20 font-bold">Produit introuvable.</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      <div className="container mx-auto px-6 py-10">
        
        {/* Breadcrumbs Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-pacific transition-colors">Accueil</Link>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
          <Link to="/products" className="hover:text-pacific transition-colors">Boutique</Link>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
          <span className="text-slate-blue font-bold truncate">{product.nom_produit}</span>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Product Image */}
            <div className="p-8 bg-[#FDFDFD] flex items-center justify-center border-r border-gray-50">
              <div className="relative group overflow-hidden rounded-3xl">
                <img 
                  src={product.image_url || 'https://placehold.co/600x600?text=Produit'} 
                  alt={product.nom_produit}
                  className="w-full h-auto max-h-[500px] object-contain transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <span className="bg-pacific/10 text-pacific text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {product.nom_categorie || 'New Collection'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-blue mb-4 leading-tight">
                {product.nom_produit}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                <span className="text-4xl font-black text-slate-blue">{product.prix} DH</span>
            
                <div className="flex flex-col">
                  <span className="text-gray-400 line-through text-sm">{(product.prix * 1.2).toFixed(2)} DH</span>
                  <span className="text-tangerine text-xs font-bold">Économisez 20%</span>
                </div>
              </div>

              <p className="text-gray-500 text-lg leading-relaxed mb-10 border-l-4 border-pacific/20 pl-6">
                {product.description || "Découvrez la qualité exceptionnelle de ce produit. Un design moderne allié à une performance inégalée pour satisfaire toutes vos attentes."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-[2] bg-pacific text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-blue hover:shadow-2xl hover:shadow-pacific/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-cart-plus"></i> Ajouter au panier
                </button>
                <button className="flex-1 bg-gray-50 text-slate-blue py-5 rounded-2xl font-black hover:bg-tangerine hover:text-white transition-all flex items-center justify-center gap-2">
                  <i className="fa-regular fa-heart"></i> Favoris
                </button>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <i className="fa-solid fa-truck-fast"></i>
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Livraison Gratuite</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <i className="fa-solid fa-rotate-left"></i>
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Retour 30 Jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- AI Recommendations Section --- */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-blue tracking-tighter">
                RECOMIND <span className="text-pacific italic">FOR YOU</span>
              </h2>
              <p className="text-gray-400 font-medium">Produits similaires qui pourraient vous plaire</p>
            </div>
            <div className="hidden md:block h-[2px] flex-1 mx-10 bg-gradient-to-r from-pacific/20 to-transparent"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {recommendations.length > 0 ? (
              recommendations.map(item => (
                <ProductCard key={item.id_product} product={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                <i className="fa-solid fa-wand-magic-sparkles mb-2 text-2xl animate-pulse"></i>
                <p>Recherche de suggestions...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;