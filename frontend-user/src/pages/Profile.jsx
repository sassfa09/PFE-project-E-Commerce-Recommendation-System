import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section with Gradient */}
        <div className="relative bg-white rounded-3xl shadow-xl shadow-slate-blue/5 overflow-hidden border border-platinum">
          <div className="h-40 bg-gradient-to-r from-pacific via-slate-blue to-tangerine opacity-90"></div>
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-end gap-6">
              {/* Avatar Icon */}
              <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-2xl">
                <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-5xl font-black text-pacific">
                  {user?.nom ? user.nom[0].toUpperCase() : "U"}
                </div>
              </div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-black text-slate-blue tracking-tight">
                  {user?.nom}
                </h1>
                <p className="text-gray-500 font-medium">{user?.email}</p>
              </div>

              <button 
                onClick={logout}
                className="mb-2 bg-white text-red-500 border-2 border-red-50 px-6 py-2.5 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95"
              >
                Déconnexion
              </button>
            </div>

            <hr className="border-platinum my-8" />

            {/* Stats Grid - Creative Touch */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-platinum group hover:border-pacific transition-colors">
                <span className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Panier Actuel</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-blue">{cartItems.length}</span>
                  <span className="text-sm text-gray-500 font-medium">Articles</span>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-2xl border border-platinum group hover:border-tangerine transition-colors">
                <span className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Statut Compte</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-tangerine">Membre Or</span>
                  <span className="text-lg">✨</span>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-2xl border border-platinum group hover:border-pacific transition-colors">
                <span className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Points Fidélité</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-pacific">1,250</span>
                  <span className="text-xs bg-pacific/10 text-pacific px-2 py-1 rounded-md font-bold">PTS</span>
                </div>
              </div>
            </div>

            {/* Recent Activity / Placeholder */}
            <div className="mt-12">
              <h2 className="text-xl font-black text-slate-blue mb-6">Commandes récentes</h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-platinum text-center">
                <p className="text-gray-400 font-medium italic">Aucune commande n'a été passée pour le moment.</p>
                <button className="mt-4 text-pacific font-bold hover:underline">
                  Commencer mes achats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;