import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  // الحالة ديال الفورم (State)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
console.log("Data to send:", formData);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate("/"); 
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 min-h-[80vh]">
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-blue/5 w-full max-w-md border border-platinum">
        <h2 className="text-3xl font-black text-slate-blue mb-2 text-center">Create Account</h2>
        <p className="text-gray-500 text-center mb-8 italic">Join our smart shopping community</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-bold text-slate-blue mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-platinum focus:border-pacific outline-none transition-all shadow-sm"
              placeholder="e.g. ahmed"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-slate-blue mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-platinum focus:border-pacific outline-none transition-all shadow-sm"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-slate-blue mb-2 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-platinum focus:border-pacific outline-none transition-all shadow-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-tangerine text-white py-4 rounded-xl font-bold hover:bg-slate-blue transition-all shadow-lg shadow-tangerine/30 active:scale-95"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 font-medium">
          Already have an account? 
          <Link to="/login" className="text-pacific font-bold ml-1 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
  
};

export default Register;