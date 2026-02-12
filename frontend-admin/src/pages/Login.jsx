import { useState, useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext"; // تأكد من المسار
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AdminAuthContext); // كنخدمو بـ AdminAuth
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email: email,             // هادي صحيحة
      mot_de_pass: password    // بدلها هنا! صيفط password اللي عندك فـ الـ state لـ mot_de_pass
    });

    if (res.data.token) {
      // 1. خزن التوكن
      localStorage.setItem("adminToken", res.data.token);
      
      // 2. تحديث الـ Context
      login(res.data.token); 
      
      // 3. التوجه للـ Dashboard
      navigate("/dashboard");
    }
  } catch (err) {
    console.log(err.response?.data);
    setError(err.response?.data?.message || "Erreur de connexion");
  }
};

  return (
    <div className="min-h-screen bg-[#EEEEEE] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-[#326273]/10 w-full max-w-md border border-white">
        
        {/* Logo Admin */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#326273] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#326273]/20">
            <i className="fa-solid fa-lock text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-black text-[#326273] uppercase tracking-tighter">
            Admin <span className="text-[#5C9EAD]">Portal</span>
          </h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Veuillez vous identifier</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-100 animate-shake">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
              Identifiant Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-[#FBFCFC] border border-[#EEEEEE] focus:border-[#5C9EAD] focus:ring-4 focus:ring-[#5C9EAD]/5 outline-none transition-all text-[#326273] font-medium"
              placeholder="admin@recomind.ma"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
              Mot de passe
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-[#FBFCFC] border border-[#EEEEEE] focus:border-[#5C9EAD] focus:ring-4 focus:ring-[#5C9EAD]/5 outline-none transition-all text-[#326273] font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl active:scale-[0.98] mt-4 flex items-center justify-center gap-2
              ${loading ? 'bg-gray-400' : 'bg-[#326273] hover:bg-[#5C9EAD] shadow-[#326273]/20'}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Accéder au Dashboard <i className="fa-solid fa-arrow-right text-xs"></i></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#EEEEEE] text-center">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             &copy; 2026 Recomind Admin System
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;