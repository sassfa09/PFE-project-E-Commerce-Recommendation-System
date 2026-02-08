import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ProductDetails = () => {
  const { id } = useParams(); // كياخد الـ ID من الرابط
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`); // تأكدي من هاد الـ route فالبكاند
        setProduct(res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20 font-bold text-pacific animate-pulse">Chargement du produit...</div>;
  if (!product) return <div className="text-center py-20">Produit non trouvé.</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center text-gray-500 hover:text-pacific font-semibold transition-all"
      >
        ← Retour aux produits
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-8 rounded-3xl shadow-xl border border-platinum">
        {/* Image Section */}
        <div className="rounded-2xl overflow-hidden bg-gray-50 border border-platinum">
          <img 
            src={product.image_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770'} 
            alt={product.nom}
            className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <span className="bg-tangerine/10 text-tangerine px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
            {product.category || 'Collection 2026'}
          </span>
          <h1 className="text-5xl font-black text-slate-blue">{product.nom}</h1>
          <p className="text-3xl font-bold text-pacific">{product.prix} DH</p>
          
          <div className="border-t border-platinum pt-6">
            <h3 className="text-lg font-bold text-slate-blue mb-2">Description:</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description || "Aucune description disponible pour ce produit."}
            </p>
          </div>

          <div className="flex gap-4 pt-8">
            <button className="flex-1 bg-pacific text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-blue transition-all shadow-lg shadow-pacific/20">
              Ajouter au panier
            </button>
            <button className="p-4 rounded-2xl border border-platinum hover:bg-gray-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;