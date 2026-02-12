import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();


  const getImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=400';
    
 
    if (img.startsWith('http')) {
      return img;
    }
    return `http://localhost:5000/${img}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-[#F8F8F8]">
        <Link to={`/product/${product.id_product}`}>
          <img 
            src={getImageUrl(product.img_url)} 
            alt={product.nom_produit}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Product&background=random"; }}
          />
        </Link>
        
        <div className="absolute top-3 left-3 bg-tangerine text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
          -15%
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <p className="text-[10px] font-bold text-pacific uppercase tracking-widest mb-1">
          {product.nom_categorie || 'New Arrival'}
        </p>
        
        <Link to={`/product/${product.id_product}`}>
          <h3 className="text-sm font-bold text-slate-blue mb-2 truncate group-hover:text-pacific transition-colors">
            {product.nom_produit}
          </h3>
        </Link>
        
        {/* Price & Action */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              {(parseFloat(product.prix) * 1.15).toFixed(2)} DH
            </span>
            <span className="text-lg font-black text-slate-blue">
              {product.prix} DH
            </span>
          </div>
          
          <button 
            onClick={() => addToCart(product)} 
            className="bg-gray-50 text-slate-blue p-3 rounded-xl hover:bg-pacific hover:text-white transition-all group shadow-sm"
          >
            <i className="fa-solid fa-cart-plus text-lg group-hover:scale-110 transition-transform"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;