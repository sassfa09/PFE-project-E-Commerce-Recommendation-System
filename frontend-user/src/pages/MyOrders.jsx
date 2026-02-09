import { useState, useEffect } from "react";
import api from "../services/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(Array.isArray(res.data) ? res.data : (res.data.data || []));
      } catch (err) {
        console.error("Erreur orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

const getStatusStyle = (status) => {
  switch (status) {
    case 'payee': return 'bg-green-100 text-green-700';
    case 'expediee': return 'bg-blue-100 text-blue-700';
    case 'en_attente': return 'bg-yellow-100 text-yellow-700';
    case 'annulee': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

  if (loading) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-black text-slate-blue mb-8">Mes Commandes</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
        </div>
      ) : (
        <div className="grid gap-6">
         {orders.map((order) => (
  <div key={order.id_commande} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Commande #{order.id_commande}</p>
      <h3 className="text-lg font-bold text-slate-blue">
        {new Date(order.date_commande).toLocaleDateString('fr-FR')}
      </h3>
      {/* التعديل هنا: montant_total عوض total */}
      <p className="text-pacific font-black">{order.montant_total} DH</p>
    </div>
    
    <div className="flex items-center gap-4">
      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${getStatusStyle(order.statut)}`}>
        {order.statut}
      </span>
      <button className="text-sm font-bold text-slate-blue hover:underline">
        Détails
      </button>
    </div>
  </div>
))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;