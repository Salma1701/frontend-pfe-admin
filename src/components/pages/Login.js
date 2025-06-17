import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        email: email.trim(),
        password,
      });
      const token = res.data.access_token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data));

        navigate("/");
      } else {
        setError("Identifiants invalides");
      }
    } catch (err) {
      console.error(err);
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-100 flex items-center justify-center">
      <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md animate-fade-in border border-gray-200">
        
        {/* Logo et Titre */}
        <div className="flex flex-col items-center mb-6">
  <img
    src="/bg-preview.png"
    alt="Logo"
    className="h-24 w-24 object-contain mb-2 shadow-md rounded-full"  // 👈 Taille 24 et effet rond avec shadow
  />
  <h1 className="text-2xl font-bold text-gray-800 mt-2">Digital Process</h1>
  <p className="text-sm text-gray-500">Plateforme Force de Vente</p>
</div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-100 text-red-600 text-center p-2 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/60 backdrop-blur-md"
              placeholder="admin@digitalprocess.com"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm mb-2">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/60 backdrop-blur-md"
              placeholder="••••••••"
            />
            <div
              className="absolute top-10 right-4 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            Se connecter
          </button>
        </form>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
