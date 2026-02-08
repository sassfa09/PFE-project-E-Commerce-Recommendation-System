import { createContext, useState, useEffect } from "react";
import api from "../services/api"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check the user when the page loads
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // According to userRoutes.js, the path is /users/profile
          const res = await api.get("/users/profile");
          setUser(res.data.data); // Because the backend returns { success: true, data: user }
        } catch (error) {
          console.error("Error fetching user:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // 2. Register function
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", {
        nom: name,             // Match with backend
        email: email,
        mot_de_pass: password  // Match with backend
      });
      
     
      // The user must log in after registration
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // 3. Login function
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email: email,
        mot_de_pass: password // Match with backend
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user); // Backend returns user: { id, nom, email }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // 4. Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
