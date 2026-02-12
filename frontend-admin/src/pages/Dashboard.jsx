// src/pages/Dashboard.jsx
const Dashboard = () => {
 
  const stats = [
    { label: "Ventes Totales", value: "45,290 DH", icon: "fa-wallet", color: "bg-[#5C9EAD]" },
    { label: "Commandes", value: "128", icon: "fa-bag-shopping", color: "bg-[#326273]" },
    { label: "Nouveaux Clients", value: "42", icon: "fa-user-plus", color: "bg-[#E39774]" },
    { label: "Produits en Rupture", value: "5", icon: "fa-triangle-exclamation", color: "bg-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#326273]">Tableau de Bord</h1>
        <p className="text-gray-400 text-sm">Bienvenue, voici un aperçu de votre activité aujourd'hui.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#EEEEEE] flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-[#326273]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-[#EEEEEE] h-80 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#EEEEEE] rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-chart-line text-[#5C9EAD] text-xl"></i>
            </div>
            <p className="text-[#326273] font-bold">Graphique des Ventes</p>
            <p className="text-gray-400 text-sm italic">Espace réservé pour les statistiques visuelles</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-[#EEEEEE] h-80">
            <h3 className="text-[#326273] font-black mb-4">Dernières Commandes</h3>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-[#EEEEEE] last:border-0">
                        <div className="w-2 h-2 bg-[#5C9EAD] rounded-full"></div>
                        <p className="text-xs font-bold text-[#326273]">Cmd #123{i}</p>
                        <p className="text-[10px] text-gray-400">Il y a 2h</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;