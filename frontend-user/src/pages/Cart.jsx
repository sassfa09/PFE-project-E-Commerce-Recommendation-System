import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, deleteItem, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);

  // Function that ensures we are always dealing with a valid number before sending it to PayPal
  const getSafeTotal = () => {
    const total = parseFloat(cartTotal);
    return isNaN(total) ? 0 : total;
  };

  const submitOrder = async (type, paypalId = null) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Veuillez vous connecter pour passer une commande.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        type_paiement: type,
        paypal_order_id: paypalId,
        items: cartItems.map(item => ({
          id_produit: item.id_product || item.id_produit, 
          quantite: item.quantity,
          prix_unitaire: item.prix
        }))
      };

      const res = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert("Commande réussie !");
        clearCart();
        navigate("/my-orders");
      }
    } catch (err) {
      console.error("Backend Error :", err.response?.data || err.message);
      alert(err.response?.data?.message || "Erreur lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl font-black mb-6 text-slate-blue">Votre panier est vide</h2>
        <Link to="/products" className="bg-pacific text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-pacific/20 transition-transform hover:scale-105 inline-block">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-black text-slate-blue mb-10">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Product list */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id_product || item.id_produit} className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <img src={item.image_url} alt={item.nom_produit} className="w-24 h-24 object-cover rounded-2xl bg-gray-50" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-blue text-lg">{item.nom_produit}</h3>
                <p className="text-pacific font-black">{item.prix} DH</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl">
                  <button onClick={() => removeFromCart(item.id_product || item.id_produit)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-red-500">-</button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-pacific">+</button>
                </div>
                <button onClick={() => deleteItem(item.id_product || item.id_produit)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-trash-can text-xl"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-black mb-6 text-slate-blue">Résumé</h2>
            
            <div className="mb-6 space-y-4">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Mode de paiement</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setPaymentMethod("Cash")}
                  className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${paymentMethod === 'Cash' ? 'border-pacific text-pacific bg-pacific/5' : 'border-gray-50 text-gray-400 hover:border-gray-200'}`}
                >
                  <i className="fa-solid fa-money-bill-wave mr-2"></i> Cash
                </button>
                <button 
                  onClick={() => setPaymentMethod("PayPal")}
                  className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${paymentMethod === 'PayPal' ? 'border-pacific text-pacific bg-pacific/5' : 'border-gray-50 text-gray-400 hover:border-gray-200'}`}
                >
                  <i className="fa-brands fa-paypal mr-2"></i> PayPal
                </button>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-xs">Total to pay</span>
                <span className="text-3xl font-black text-pacific">{getSafeTotal()} DH</span>
              </div>
            </div>

            {paymentMethod === "Cash" ? (
              <button 
                onClick={() => submitOrder("Cash")}
                disabled={loading}
                className="w-full bg-slate-blue text-white py-5 rounded-2xl font-black hover:bg-pacific transition-all shadow-xl shadow-slate-blue/10 disabled:opacity-50 active:scale-95"
              >
                {loading ? "Traitement..." : "Confirmer la commande"}
              </button>
            ) : (
              <div className="relative z-10">
                <PayPalButtons 
                  style={{ layout: "vertical", shape: "pill", label: "pay" }}
                  
                  forceReRender={[getSafeTotal()]} 
                  createOrder={(data, actions) => {
                    // Convert price to USD (roughly divide by 10)
                    const totalUSD = (getSafeTotal() / 10).toFixed(2);
                    
                    return actions.order.create({
                      purchase_units: [{
                        amount: {
                          currency_code: "USD",
                          value: totalUSD
                        }
                      }]
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                      submitOrder("PayPal", details.id);
                    });
                  }}
                  onError={(err) => {
                    console.error("PayPal Error:", err);
                    alert("Une erreur est survenue avec PayPal.");
                  }}
                />
              </div>
            )}
            <p className="text-center text-[10px] text-gray-300 mt-6 font-bold uppercase tracking-widest">
              <i className="fa-solid fa-lock mr-1"></i> 100% secure payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
