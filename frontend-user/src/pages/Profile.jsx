import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import api from "../services/api"; 

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrderCount(res.data.length);
      } catch (err) {
        console.error("Erreur stats:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUserStats();
  }, [user]);

  return (
    <div className="bg-[#FBFCFC] min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Card */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-[#EEEEEE] overflow-hidden">
            
            {/* Banner Gradient */}
            <div className="h-44 bg-gradient-to-r from-[#326273] via-[#5C9EAD] to-[#E39774] opacity-90 relative">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>
            
            <div className="px-8 pb-10">
              <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-end gap-6">
                
                {/* Avatar Box */}
                <div className="w-36 h-36 bg-white rounded-[2rem] p-3 shadow-xl shadow-[#326273]/5">
                  <div className="w-full h-full bg-gradient-to-br from-[#FBFCFC] to-[#EEEEEE] rounded-[1.5rem] flex items-center justify-center text-5xl font-black text-[#326273]">
                    {user?.nom ? user.nom[0].toUpperCase() : "U"}
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-[#326273] tracking-tight">
                      {user?.nom}
                    </h1>
                    <span className="bg-[#E39774]/10 text-[#E39774] text-[10px] font-black px-2 py-1 rounded-md uppercase">
                      {user?.role === 'admin' ? 'Administrateur' : 'Client Fidèle'}
                    </span>
                  </div>
                  <p className="text-gray-400 font-medium mt-1">
                    <i className="fa-regular fa-envelope mr-2"></i>{user?.email}
                  </p>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={logout}
                  className="mb-2 bg-white text-[#E39774] border-2 border-[#E39774]/10 px-6 py-2.5 rounded-xl font-bold hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 flex items-center gap-2"
                >
                  <i className="fa-solid fa-power-off"></i> Déconnexion
                </button>
              </div>

              <hr className="border-[#EEEEEE] mb-10" />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stat 1: Cart */}
                <Link to="/cart" className="bg-[#FBFCFC] p-6 rounded-2xl border border-[#EEEEEE] hover:border-[#5C9EAD] transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Panier</span>
                    <i className="fa-solid fa-cart-shopping text-[#5C9EAD] opacity-20 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#326273]">{cartItems.length}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase">Articles</span>
                  </div>
                </Link>

                {/* Stat 2: Orders Count */}
                <Link to="/my-orders" className="bg-[#FBFCFC] p-6 rounded-2xl border border-[#EEEEEE] hover:border-[#E39774] transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Commandes</span>
                    <i className="fa-solid fa-box-open text-[#E39774] opacity-20 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#326273]">{orderCount}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase">Passées</span>
                  </div>
                </Link>

                {/* Stat 3: Loyalty Points (Logic Simple) */}
                <div className="bg-[#FBFCFC] p-6 rounded-2xl border border-[#EEEEEE] hover:border-[#326273] transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fidélité</span>
                    <i className="fa-solid fa-star text-[#326273] opacity-20 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#326273]">{orderCount * 100}</span>
                    <span className="text-[10px] bg-[#326273]/10 text-[#326273] px-2 py-0.5 rounded font-black">PTS</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="mt-14">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-[#326273]">Dernière activité</h2>
                  <Link to="/my-orders" className="text-sm font-bold text-[#5C9EAD] hover:underline">
                    Voir tout
                  </Link>
                </div>
                
                {orderCount === 0 ? (
                   <div className="bg-[#FBFCFC] rounded-3xl p-10 border-2 border-dashed border-[#EEEEEE] text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <i className="fa-solid fa-ghost text-gray-200 text-2xl"></i>
                    </div>
                    <p className="text-gray-400 font-medium italic mb-6">
                      Votre historique est encore tout frais !
                    </p>
                    <Link 
                      to="/products"
                      className="inline-flex items-center gap-2 bg-[#326273] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5C9EAD] transition-all shadow-lg shadow-[#326273]/10"
                    >
                      Explorer la boutique
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#EEEEEE] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-check text-xl"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#326273]">Dernière commande effectuée</p>
                        <p className="text-xs text-gray-400">Vérifiez le statut dans vos commandes.</p>
                      </div>
                    </div>
                    <Link to="/my-orders" className="bg-[#EEEEEE] text-[#326273] px-4 py-2 rounded-lg text-xs font-bold">Détails</Link>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Settings / Security Shortcut */}
          <div className="mt-8 flex justify-center gap-8">
             <button className="text-xs font-bold text-gray-400 hover:text-[#326273] transition-colors uppercase tracking-widest">
               <i className="fa-solid fa-shield-halved mr-2"></i>Sécurité
             </button>
             <button className="text-xs font-bold text-gray-400 hover:text-[#326273] transition-colors uppercase tracking-widest">
               <i className="fa-solid fa-gear mr-2"></i>Paramètres
             </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;