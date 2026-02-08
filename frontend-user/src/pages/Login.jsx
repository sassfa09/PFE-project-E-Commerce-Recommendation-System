import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      navigate("/");
    } else {
      alert(result.message); 
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-blue/5 w-full max-w-md border border-platinum">
        <h2 className="text-3xl font-black text-slate-blue mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-8">Login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-blue mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-platinum focus:border-pacific focus:ring-2 focus:ring-pacific/20 outline-none transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-blue mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-platinum focus:border-pacific focus:ring-2 focus:ring-pacific/20 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-pacific text-white py-4 rounded-xl font-bold hover:bg-slate-blue transition-all shadow-lg shadow-pacific/20 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account? 
          <Link to="/register" className="text-tangerine font-bold ml-1 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;