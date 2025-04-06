import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa"; // 👁️ ✉️

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        email: email.trim(),  // 🔥 enlever les espaces
        password,
      });

      const token = res.data.access_token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        setError("Identifiants invalides"); // fallback au cas où pas de token
      }
    } catch (err) {
      console.error("Erreur de connexion :", err.response?.data || err.message);
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        
        {/* LOGO + TITRE */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-16 w-16 object-contain mb-2"
          />
          <h2 className="text-2xl font-bold text-gray-800">Connexion Admin</h2>
          <p className="text-sm text-gray-500">Digital Process Distribution</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <p className="text-red-500 bg-red-100 p-2 rounded text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email avec icône ✉️ */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="admin@example.com"
            />
            <div className="absolute top-9 right-4 text-gray-400">
              <FaEnvelope />
            </div>
          </div>

          {/* Password avec icône 👁️ */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
            />
            <div 
              className="absolute top-9 right-4 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Bouton Se connecter */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Se connecter
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
