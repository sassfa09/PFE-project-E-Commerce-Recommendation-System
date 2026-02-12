import { useState, useEffect } from "react";
import api from "../services/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleViewDetails = async (id) => {
    try {
      const res = await api.get(`/orders/${id}/items`);
      setSelectedItems(res.data);
      setShowModal(true);
    } catch (err) {
      alert("Impossible de charger les détails");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'payee': return 'bg-green-100 text-green-700';
      case 'expediee': return 'bg-blue-100 text-blue-700';
      case 'en_attente': return 'bg-yellow-100 text-yellow-700';
      case 'annulee': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-slate-blue">Chargement de vos commandes...</div>;

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-black text-[#326273] mb-8">Mes Commandes</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed">
          <p className="text-gray-500 font-bold text-lg">Vous n'avez pas encore passé de commande. 🛒</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id_commande} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Commande #{order.id_commande}</p>
                <h3 className="text-lg font-bold text-[#326273]">
                  {new Date(order.date_commande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                <p className="text-[#5C9EAD] font-black">{Number(order.montant_total).toFixed(2)} DH</p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${getStatusStyle(order.statut)}`}>
                  {order.statut.replace('_', ' ')}
                </span>
                <button 
                  onClick={() => handleViewDetails(order.id_commande)}
                  className="bg-[#326273] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#5C9EAD] transition-colors"
                >
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

   
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-[#326273] font-black text-xl mb-6">Articles commandés</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
              {selectedItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2 text-sm">
                  <div>
                    <p className="font-bold text-slate-700">{item.nom_produit}</p>
                    <p className="text-gray-400 text-xs">Qté: {item.quantite}</p>
                  </div>
                  <p className="font-black text-[#326273]">{item.prix_unitaire} DH</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;