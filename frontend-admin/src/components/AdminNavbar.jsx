// src/components/AdminNavbar.jsx
import { useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";

const AdminNavbar = () => {
  const { logout } = useContext(AdminAuthContext);

  return (
    <header className="h-20 bg-white border-b border-[#EEEEEE] flex items-center justify-between px-10 sticky top-0 z-40">
      <h2 className="text-[#326273] font-black text-lg uppercase tracking-tight">Panneau de Contrôle</h2>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-[#EEEEEE]">
          <div className="text-right">
            <p className="text-sm font-black text-[#326273]">Admin Recomind</p>
            <p className="text-[10px] font-bold text-[#5C9EAD] uppercase">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-[#EEEEEE] rounded-full flex items-center justify-center text-[#326273]">
            <i className="fa-solid fa-user-shield"></i>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="text-[#E39774] hover:text-red-600 transition-colors font-bold text-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-power-off"></i> Déconnexion
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;