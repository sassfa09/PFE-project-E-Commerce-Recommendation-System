import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, deleteItem, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl font-black text-slate-blue mb-4">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8 text-lg">Découvrez nos produits et commencez votre shopping !</p>
        <Link to="/products" className="bg-pacific text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-pacific/20 hover:bg-slate-blue transition-all">
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-black text-slate-blue mb-10">Mon Panier <span className="text-pacific">({cartItems.length})</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* List of Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id_product} className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-3xl border border-platinum shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={item.image_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770'} 
                alt={item.nom_produit} 
                className="w-32 h-32 object-cover rounded-2xl"
              />
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-blue">{item.nom_produit || item.nom}</h3>
                <p className="text-pacific font-black text-lg">{item.prix} DH</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-platinum">
                <button onClick={() => removeFromCart(item.id_product)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-tangerine transition-colors">-</button>
                <span className="font-bold text-lg w-6 text-center">{item.quantity}</span>
                <button onClick={() => addToCart(item)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-pacific transition-colors">+</button>
              </div>

              <button 
                onClick={() => deleteItem(item.id_product)}
                className="text-red-400 hover:text-red-600 p-2 transition-colors"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-blue text-white p-8 rounded-3xl shadow-2xl sticky top-28">
            <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-300">
                <span>Sous-total</span>
                <span>{cartTotal} DH</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Livraison</span>
                <span className="text-tangerine font-bold">Gratuite</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-black">
                <span>Total</span>
                <span>{cartTotal} DH</span>
              </div>
            </div>
            
            <button className="w-full bg-tangerine text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-tangerine/20">
              Passer à la caisse
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4">Paiement sécurisé & Retours gratuits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;