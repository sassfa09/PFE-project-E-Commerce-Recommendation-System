import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const getImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=400';
    if (img.startsWith('http')) return img;
    return `http://localhost:5000/${img}`;
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative">
      
      {/* Badge AI Match */}
      {product.score && (
        <div className="absolute top-3 right-3 z-10 bg-pacific/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1 animate-pulse">
          <i className="fa-solid fa-microchip text-[8px]"></i>
          AI {Math.round(product.score * 100)}% MATCH
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FBFBFB]">
        <Link to={`/product/${product.id_product}`}>
          <img 
            src={getImageUrl(product.img_url)} 
            alt={product.nom_produit} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }} 
          />
        </Link>
        
        {/* Discount Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-blue text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">
          -15%
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-black text-pacific uppercase tracking-wider">
            {product.nom_categorie || 'Premium'}
          </p>
          <div className="flex gap-1 text-[8px] text-tangerine">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star-half-stroke"></i>
          </div>
        </div>
        
        <Link to={`/product/${product.id_product}`}>
          <h3 className="text-sm font-bold text-slate-blue mb-3 truncate group-hover:text-pacific transition-colors leading-tight">
            {product.nom_produit}
          </h3>
        </Link>
        
        {/* Price & Action */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 line-through font-medium">
              {(parseFloat(product.prix) * 1.15).toFixed(2)} DH
            </span>
            <span className="text-xl font-black text-slate-blue tracking-tight">
              {product.prix} <span className="text-xs">DH</span>
            </span>
          </div>
          
          <button 
            onClick={() => addToCart(product)} 
            className="bg-slate-blue text-white w-10 h-10 rounded-xl hover:bg-pacific transition-all duration-300 flex items-center justify-center shadow-lg shadow-slate-blue/20 group-hover:rotate-[360deg]"
          >
            <i className="fa-solid fa-plus text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;