import { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useCart();
  const location = useLocation();
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      navigate(`/products?search=${encodeURIComponent(navSearch)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-slate-blue font-semibold relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-pacific after:rounded-full"
      : "text-slate-blue/70 hover:text-slate-blue relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-pacific after:rounded-full after:transition-all after:duration-300";

  return (
    <header className="sticky top-0 z-50 font-sans bg-white/70 backdrop-blur-md border-b border-platinum/60 shadow-[0_10px_30px_rgba(35,41,70,0.05)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-black tracking-tight text-slate-blue flex items-center gap-1"
        >
          RECO<span className="text-pacific">MIND</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold ml-6">
          <Link to="/" className={isActive("/")}>
            Accueil
          </Link>
          <Link to="/products" className={isActive("/products")}>
            Boutique
          </Link>
          <Link to="/my-orders" className={isActive("/my-orders")}>
            Commandes
          </Link>
        </nav>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md ml-auto relative" ref={dropdownRef}>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher un produit…"
              className="w-full bg-platinum/60 border border-transparent rounded-full py-2.5 pl-10 pr-4 outline-none focus:bg-white focus:border-pacific/40 focus:ring-4 focus:ring-pacific/10 text-sm text-slate-blue"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => navSearch.length > 1 && setShowSuggestions(true)}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pacific">
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
            </span>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-platinum shadow-xl rounded-2xl mt-3 overflow-hidden z-[60]">
              {suggestions.map((p) => (
                <button
                  type="button"
                  key={p.id_product}
                  className="w-full flex items-center gap-4 p-3 hover:bg-platinum/60 cursor-pointer text-left"
                  onClick={() => {
                    setNavSearch(p.nom_produit);
                    setShowSuggestions(false);
                    navigate(`/products?search=${encodeURIComponent(p.nom_produit)}`);
                  }}
                >
                  <img
                    src={p.image_url || "/placeholder.png"}
                    alt=""
                    className="w-11 h-11 object-cover rounded-lg border border-platinum"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-blue truncate">
                      {p.nom_produit}
                    </p>
                    <p className="text-xs text-pacific font-bold">{p.prix} DH</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side: cart + user + mobile menu */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <Link
            to="/cart"
            className="relative p-2 text-slate-blue hover:bg-platinum/70 rounded-full transition-colors group"
          >
            <i className="fa-solid fa-cart-shopping text-lg group-hover:scale-110 transition-transform"></i>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-tangerine text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-platinum/70 rounded-full transition-all border border-transparent"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-slate-blue to-pacific rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {user.nom ? user.nom[0].toUpperCase() : "U"}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white border border-platinum shadow-2xl rounded-2xl py-2 z-50 overflow-hidden">
                  <div className="px-5 py-3 border-b border-platinum/70 mb-1">
                    <p className="text-[10px] font-bold text-pacific uppercase tracking-[0.2em]">
                      Mon compte
                    </p>
                    <p className="text-sm font-bold text-slate-blue truncate">
                      {user.nom}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-5 py-3 text-sm text-slate-blue hover:bg-platinum/70 transition-colors"
                  >
                    <i className="fa-regular fa-circle-user text-lg text-pacific"></i> Profil
                  </Link>
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-3 px-5 py-3 text-sm text-slate-blue hover:bg-platinum/70 transition-colors"
                  >
                    <i className="fa-solid fa-receipt text-lg text-pacific"></i> Mes commandes
                  </Link>
                  <div className="px-3 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white bg-tangerine hover:bg-[#d87400] rounded-xl transition-colors"
                    >
                      <i className="fa-solid fa-power-off text-xs"></i> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex text-xs font-bold text-white bg-pacific hover:bg-[#008ecc] px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95"
            >
              Connexion
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-full hover:bg-platinum/70 text-slate-blue"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`fa-solid ${isMobileMenuOpen ? "fa-xmark" : "fa-bars"} text-lg`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-platinum bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                placeholder="Rechercher un produit…"
                className="w-full bg-platinum/60 border border-transparent rounded-full py-2.5 pl-10 pr-4 outline-none focus:bg-white focus:border-pacific/40 focus:ring-4 focus:ring-pacific/10 text-sm text-slate-blue"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onKeyDown={handleSearchSubmit}
                onFocus={() => navSearch.length > 1 && setShowSuggestions(true)}
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pacific">
                <i className="fa-solid fa-magnifying-glass text-xs"></i>
              </span>
            </div>

            <nav className="flex flex-col gap-2 text-sm font-semibold">
              <Link to="/" className={isActive("/")} onClick={() => setIsMobileMenuOpen(false)}>
                Accueil
              </Link>
              <Link
                to="/products"
                className={isActive("/products")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Boutique
              </Link>
              <Link
                to="/my-orders"
                className={isActive("/my-orders")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mes commandes
              </Link>
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 inline-flex justify-center rounded-full bg-pacific text-white px-4 py-2 text-xs font-bold"
                >
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;