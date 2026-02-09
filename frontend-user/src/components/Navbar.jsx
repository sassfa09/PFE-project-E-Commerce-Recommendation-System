import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navSearch, setNavSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setCategories(data);
        setLoading(false);
      }).catch(err => console.error(err));

    axios.get("http://localhost:5000/api/products")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setAllProducts(data);
      }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (navSearch.trim().length > 1) {
      const filtered = allProducts.filter(p => 
        p.nom_produit && p.nom_produit.toLowerCase().includes(navSearch.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [navSearch, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowSuggestions(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      navigate(`/products?search=${navSearch}`);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="bg-white sticky top-0 z-50 font-sans shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      {/* Top Section */}
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center gap-8">
        
        {/* Logo - Blue Slate */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-[#326273] flex-shrink-0">
          RECO<span className="text-[#5C9EAD]">MIND</span>
        </Link>

        {/* Search Bar - Minimalist with Platinum background */}
        <div className="hidden md:flex flex-1 max-w-xl relative" ref={dropdownRef}>
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Rechercher des produits..." 
              className="w-full bg-[#EEEEEE]/40 border border-transparent rounded-full py-2.5 pl-12 pr-4 outline-none focus:bg-white focus:border-[#5C9EAD]/30 focus:ring-4 focus:ring-[#5C9EAD]/5 transition-all text-sm text-[#326273]"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => navSearch.length > 1 && setShowSuggestions(true)}
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5C9EAD]">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-[#EEEEEE] shadow-xl rounded-2xl mt-3 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              {suggestions.map((p) => (
                <div 
                  key={p.id_product}
                  className="flex items-center gap-4 p-3 hover:bg-[#EEEEEE]/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setNavSearch(p.nom_produit);
                    setShowSuggestions(false);
                    navigate(`/products?search=${p.nom_produit}`);
                  }}
                >
                  <img src={p.image_url || "/placeholder.png"} alt="" className="w-11 h-11 object-cover rounded-lg border border-[#EEEEEE]" />
                  <div>
                    <p className="text-sm font-bold text-[#326273]">{p.nom_produit}</p>
                    <p className="text-xs text-[#5C9EAD] font-bold">{p.prix} DH</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Icons Area */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Cart Icon - Tangerine Dream for Count */}
          <Link to="/cart" className="relative p-2.5 text-[#326273] hover:bg-[#EEEEEE]/50 rounded-full transition-colors group">
            <i className="fa-solid fa-cart-shopping text-xl group-hover:scale-110 transition-transform"></i>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#E39774] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-[#EEEEEE]/50 rounded-full transition-all border border-transparent"
              >
                <div className="w-9 h-9 bg-gradient-to-tr from-[#326273] to-[#5C9EAD] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {user.nom ? user.nom[0].toUpperCase() : 'U'}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white border border-[#EEEEEE] shadow-2xl rounded-2xl py-2 z-50 overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#EEEEEE] mb-1">
                    <p className="text-[10px] font-bold text-[#5C9EAD] uppercase tracking-wider">Mon Compte</p>
                    <p className="text-sm font-bold text-[#326273] truncate">{user.nom}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-sm text-[#326273] hover:bg-[#EEEEEE]/50 transition-colors">
                    <i className="fa-regular fa-circle-user text-lg text-[#5C9EAD]"></i> Profil
                  </Link>
                  <Link to="/my-orders" className="flex items-center gap-3 px-5 py-3 text-sm text-[#326273] hover:bg-[#EEEEEE]/50 transition-colors">
                    <i className="fa-solid fa-receipt text-lg text-[#5C9EAD]"></i> Mes Commandes
                  </Link>
                  <div className="px-2 mt-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white bg-[#E39774] hover:bg-[#d18663] rounded-xl transition-colors shadow-sm"
                    >
                      <i className="fa-solid fa-power-off"></i> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm font-bold text-white bg-[#5C9EAD] hover:bg-[#4a8a99] px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95">
              Connexion
            </Link>
          )}
        </div>
      </div>

      {/* Categories Bar - Platinum with Subtle slate text */}
      <div className="border-t border-[#EEEEEE] overflow-x-auto no-scrollbar bg-white/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3 flex items-center gap-10 min-w-max justify-center">
          <Link to="/products" className="text-xs font-black text-[#326273] hover:text-[#5C9EAD] transition-colors flex items-center gap-2">
            <span className="w-2 h-2 bg-[#E39774] rounded-full"></span> BOUTIQUE
          </Link>
          {loading ? (
            <div className="flex gap-8 animate-pulse">
               {[1,2,3,4].map(i => <div key={i} className="h-2 w-16 bg-[#EEEEEE] rounded-full"></div>)}
            </div>
          ) : (
            categories.map((cat) => (
              <Link 
                key={cat.id_categorie} 
                to={`/products?cat=${cat.id_categorie}`} 
                className="text-[11px] font-bold text-gray-400 hover:text-[#326273] transition-colors tracking-widest uppercase"
              >
                {cat.nom_categorie}
              </Link>
            ))
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;