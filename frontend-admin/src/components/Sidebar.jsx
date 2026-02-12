// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
 const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "fa-chart-pie" },
    { name: "Produits", path: "/products/manage", icon: "fa-box" }, 
    { name: "Commandes", path: "/orders", icon: "fa-shopping-cart" }, 
    { name: "Catégories", path: "/categories/manage", icon: "fa-list" },
  ];

  return (
    <aside className="w-72 bg-[#326273] min-h-screen flex flex-col text-white sticky top-0">
      <div className="p-8">
        <h1 className="text-2xl font-black tracking-tighter uppercase">
          RECO<span className="text-[#5C9EAD]">ADMIN</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                isActive 
                ? "bg-white text-[#326273] shadow-lg shadow-black/10 scale-105" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-white/5">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Version 2.0.1</p>
      </div>
    </aside>
  );
};

export default Sidebar;