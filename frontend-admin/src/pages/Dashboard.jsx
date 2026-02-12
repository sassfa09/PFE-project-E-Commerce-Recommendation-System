import { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState({
    totalSales: 0,
    paypalSales: 0,
    cashSales: 0,
    ordersCount: 0,
    outOfStock: 0,
    recentOrders: [],
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders and products in parallel
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders/all"),
          api.get("/products")
        ]);
        
        const orders = ordersRes.data || [];
        // Handle different possible structures for products response
        const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data.data || []);

        // 1. Calculate total sales (using Number to ensure math precision)
        const total = orders.reduce(
          (sum, order) => sum + Number(order.montant_total || 0),
          0
        );
        
        // 2. Calculate PayPal sales (Checking for "PayPal" case-insensitive)
        const paypal = orders
          .filter(o => String(o.type_paiement).toLowerCase() === "paypal")
          .reduce((sum, o) => sum + Number(o.montant_total || 0), 0);

        // 3. Calculate Cash sales (Checking for "Cash" case-insensitive)
        const cash = orders
          .filter(o => String(o.type_paiement).toLowerCase() === "cash")
          .reduce((sum, o) => sum + Number(o.montant_total || 0), 0);

        setData({
          totalSales: total,
          paypalSales: paypal,
          cashSales: cash,
          ordersCount: orders.length,
          outOfStock: products.filter(p => p.stock <= 0).length,
          recentOrders: orders.slice(0, 5), // Get only the 5 latest orders
          loading: false
        });
      } catch (err) {
        console.error("Dashboard Error:", err);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Total Sales", value: `${data.totalSales.toLocaleString()} DH`, icon: "fa-wallet", color: "bg-[#326273]" },
    { label: "PayPal Sales", value: `${data.paypalSales.toLocaleString()} DH`, icon: "fa-brands fa-paypal", color: "bg-[#003087]" },
    { label: "Cash Sales", value: `${data.cashSales.toLocaleString()} DH`, icon: "fa-money-bill-wave", color: "bg-[#5C9EAD]" },
    { label: "Stock Alert", value: data.outOfStock, icon: "fa-triangle-exclamation", color: "bg-red-500" },
  ];

  if (data.loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#326273]"></div>
        <span className="ml-3 font-bold text-[#326273]">Chargement des statistiques...</span>
      </div>
    );

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-2xl font-black text-[#326273]">Dashboard Admin</h1>
        <p className="text-gray-400 text-sm">Aperçu financier et gestion des stocks.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#EEEEEE] flex items-center gap-5 transition-transform hover:scale-105"
          >
            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-xl font-black text-[#326273]">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-8 rounded-[2rem] border border-[#EEEEEE] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[#326273] font-black italic">Dernières Commandes</h3>
          <span className="text-xs font-bold text-gray-400">{data.ordersCount} commandes au total</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase font-black border-b border-gray-50">
                <th className="pb-4">Client</th>
                <th className="pb-4">Méthode</th>
                <th className="pb-4">Montant</th>
                <th className="pb-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentOrders.length > 0 ? (
                data.recentOrders.map((order) => (
                  <tr key={order.id_commande} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#326273]">
                          {order.client_name || "Client Inconnu"}
                        </span>
                        <span className="text-[10px] text-gray-400">{order.client_email}</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-bold uppercase">
                      {String(order.type_paiement).toLowerCase() === "paypal" ? (
                        <span className="text-blue-600 flex items-center gap-1">
                          <i className="fa-brands fa-paypal"></i> PayPal
                        </span>
                      ) : (
                        <span className="text-green-600 flex items-center gap-1">
                          <i className="fa-solid fa-money-bill-wave"></i> Cash
                        </span>
                      )}
                    </td>
                    <td className="py-4 font-black text-[#326273]">
                      {Number(order.montant_total).toFixed(2)} DH
                    </td>
                    <td className="py-4">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${
                        order.statut === 'payee' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.statut}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400 font-bold">
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;