import { useState } from "react";
import { useCart } from "../context/CartContext"; 
import API from "../services/api"; 
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  // Extract the correct values from your Context
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom_client: "",
    adresse: "",
    telephone: "",
    type_paiement: "cash_on_delivery"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Your cart is empty!");

    setLoading(true);
    try {
      // Prepare data for the backend
      const orderData = {
        nom_client: formData.nom_client,
        adresse: formData.adresse,
        telephone: formData.telephone,
        type_paiement: formData.type_paiement,
        
        items: cartItems,
        total_prix: cartTotal // Using cartTotal from Context
      };

      const res = await API.post("/orders", orderData);
      
      if (res.data.success) {
        alert("Order placed successfully!");
        clearCart(); 
        navigate("/my-orders");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error sending order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
      
      {/* Section 1: Delivery Information Form */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-platinum">
        <h2 className="text-2xl font-black text-slate-blue mb-6">
          Delivery Information
        </h2>
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <input
            type="text"
            name="nom_client"
            placeholder="Full Name"
            className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none"
            onChange={handleChange}
            required
          />
          <textarea
            name="adresse"
            placeholder="Full Address"
            rows="3"
            className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none"
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="tel"
            name="telephone"
            placeholder="Phone Number"
            className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none"
            onChange={handleChange}
            required
          />
          
          <div className="pt-4">
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
              Payment Method
            </label>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
              <input type="radio" checked readOnly />
              <span className="font-bold text-slate-blue">
                Cash on Delivery
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-blue text-white py-5 rounded-2xl font-black text-lg hover:opacity-90 transition-all mt-6"
          >
            {loading
              ? "Submitting..."
              : `Confirm Order (${cartTotal.toFixed(2)} DH)`}
          </button>
        </form>
      </div>

      {/* Section 2: Order Summary */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-blue">
          Order Summary
        </h2>
        <div className="bg-[#FBFCFC] border border-platinum rounded-3xl p-6">
          {cartItems.map((item) => (
            <div
              key={item.id_product}
              className="flex justify-between items-center mb-4 pb-4 border-b border-platinum last:border-0"
            >
              <div className="flex items-center gap-4">
                {/* Using img_url that we fixed in ProductCard */}
                <img
                  src={
                    item.img_url
                      ? item.img_url.startsWith("http")
                        ? item.img_url
                        : `http://localhost:5000/${item.img_url}`
                      : "https://via.placeholder.com/150"
                  }
                  className="w-16 h-16 object-cover rounded-xl border"
                  alt={item.nom_produit}
                />
                <div>
                  <h4 className="font-bold text-slate-blue text-sm">
                    {item.nom_produit}
                  </h4>
                  <p className="text-xs text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-black text-slate-blue">
                {(item.prix * item.quantity).toFixed(2)} DH
              </span>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-platinum mt-4">
            <span className="text-gray-400 font-bold uppercase text-xs">
              Subtotal
            </span>
            <span className="text-3xl font-black text-blue-600">
              {cartTotal.toFixed(2)} DH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
