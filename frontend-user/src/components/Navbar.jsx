import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios"; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Erreur categories Navbar:", err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
    
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center gap-8">
          
          <Link to="/" className="text-2xl font-black tracking-tighter text-slate-blue">
            RECO<span className="text-pacific">MIND</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              className="w-full bg-gray-50 border border-platinum rounded-2xl py-2.5 px-11 outline-none focus:ring-4 focus:ring-pacific/10 transition-all"
            />
            <span className="absolute left-4 top-3 text-gray-400">🔍</span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="w-10 h-10 bg-pacific rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-pacific/20">
                  {user.nom[0].toUpperCase()}
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link to="/login" className="font-bold text-slate-blue hover:text-pacific transition-colors">Connexion</Link>
            )}

            <Link to="/cart" className="relative p-2 text-slate-blue hover:text-pacific transition-colors">
  <i className="fa-solid fa-bag-shopping text-2xl"></i>
  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-tangerine text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white">
      {cartCount}
    </span>
  )}
</Link>
          </div>
        </div>
      </div>

    
      <div className="bg-white py-3 overflow-x-auto border-b border-gray-50">
        <div className="container mx-auto px-6 flex items-center gap-8 min-w-max">
          <button className="bg-slate-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-xs">
            <span>☰</span> TOUTES LES CATÉGORIES
          </button>
       
          {categories.map((cat) => (
            <Link 
              key={cat.id_categorie} 
              to={`/products?cat=${cat.id_categorie}`} 
              className="flex items-center gap-2 text-gray-500 hover:text-pacific transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📦</span>
              <span className="text-[11px] font-black uppercase tracking-tight">{cat.nom_categorie}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;