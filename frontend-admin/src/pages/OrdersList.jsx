import { useState, useEffect } from "react";
import api from "../services/api";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States to control the Modal
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // 1. Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching all orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Change order status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { statut: newStatus });
      fetchOrders(); // Refresh the list after updating
    } catch (err) {
      alert("Error while updating status");
    }
  };

  // 3. Fetch order details for the Modal
  const handleOpenDetails = async (orderId) => {
    setModalLoading(true);
    setShowModal(true);
    try {
      const res = await api.get(`/orders/${orderId}/items`);
      setSelectedItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load details");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'payee': return 'bg-green-100 text-green-700 border-green-200';
      case 'expediee': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'en_attente': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'annulee': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-blue">Loading orders...</div>;

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header with quick statistics */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-blue tracking-tight">Orders Management</h1>
          <p className="text-gray-500 text-sm font-medium">Track and manage your customers' purchases in real time.</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-platinum text-right">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest block mb-1">
            Total Revenue
          </span>
          <span className="text-2xl font-black text-pacific">
            {orders.reduce((sum, o) => sum + parseFloat(o.montant_total || 0), 0).toFixed(2)} DH
          </span>
        </div>
      </div>

      {/* Main table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-platinum overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-platinum">
              <th className="p-5 text-xs font-black uppercase text-gray-400">ID</th>
              <th className="p-5 text-xs font-black uppercase text-gray-400">Client</th>
              <th className="p-5 text-xs font-black uppercase text-gray-400">Date</th>
              <th className="p-5 text-xs font-black uppercase text-gray-400">Total Amount</th>
              <th className="p-5 text-xs font-black uppercase text-gray-400">Status</th>
              <th className="p-5 text-xs font-black uppercase text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-platinum">
            {orders.map((order) => (
              <tr key={order.id_commande} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-5 font-bold text-slate-blue text-sm">#{order.id_commande}</td>
                <td className="p-5">
                  <div className="font-bold text-sm text-slate-blue">
                    {order.client_name || 'Unknown Client'}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    {order.client_email}
                  </div>
                </td>
                <td className="p-5 text-sm text-gray-500 font-medium">
                  {new Date(order.date_commande).toLocaleDateString('fr-FR')}
                </td>
                <td className="p-5 font-black text-slate-blue">
                  {parseFloat(order.montant_total).toFixed(2)} DH
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border ${getStatusStyle(order.statut)}`}>
                    {order.statut}
                  </span>
                </td>
                <td className="p-5 flex items-center gap-3">
                  <select 
                    value={order.statut}
                    onChange={(e) => handleStatusChange(order.id_commande, e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-platinum p-2 rounded-xl outline-none focus:border-pacific transition-all"
                  >
                    <option value="en_attente">Pending</option>
                    <option value="payee">Paid</option>
                    <option value="expediee">Shipped</option>
                    <option value="annulee">Cancelled</option>
                  </select>
                  <button 
                    onClick={() => handleOpenDetails(order.id_commande)}
                    className="p-2 bg-pacific/10 text-pacific rounded-xl hover:bg-pacific hover:text-white transition-all shadow-sm"
                    title="View products"
                  >
                    <i className="fa-solid fa-eye text-sm"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="p-20 text-center text-gray-300 font-bold italic">
            No orders were found in the database.
          </div>
        )}
      </div>

      {/* --- Products Details Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-platinum flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-blue text-xl tracking-tight">
                Product Details
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-all text-gray-400 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 max-h-[450px] overflow-y-auto">
              {modalLoading ? (
                <div className="py-10 text-center text-gray-400 font-bold">
                  Loading...
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-5 p-4 rounded-2xl border border-platinum hover:border-pacific/30 transition-all">
                      <img 
                        src={item.img_url ? (item.img_url.startsWith('http') ? item.img_url : `http://localhost:5000/${item.img_url}`) : 'https://via.placeholder.com/150'} 
                        className="w-20 h-20 object-cover rounded-2xl border border-platinum shadow-sm" 
                        alt={item.nom_produit}
                      />
                      <div className="flex-1">
                        <h4 className="font-black text-slate-blue text-sm leading-tight mb-1">
                          {item.nom_produit}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-400">
                            Price: {item.prix_unitaire} DH
                          </span>
                          <span className="text-xs font-black text-pacific bg-pacific/10 px-2 py-0.5 rounded-md">
                            x{item.quantite}
                          </span>
                        </div>
                      </div>
                      <span className="font-black text-slate-blue">
                        {(item.prix_unitaire * item.quantite).toFixed(2)} DH
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-platinum flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-slate-blue text-white px-10 py-3 rounded-2xl font-black hover:scale-95 transition-all shadow-lg shadow-slate-blue/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
