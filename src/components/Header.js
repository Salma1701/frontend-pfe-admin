import React from "react";
import { FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  // 🔥 Simuler le nom de l'admin connecté (normalement tu peux le récupérer depuis localStorage ou ton API)
  const adminName = "Admin"; 

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔥 Déconnecter
    navigate("/login"); // 🔥 Retourner à login
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo ou titre */}
      <div className="text-2xl font-bold text-indigo-600">
        Digital Process Distribution
      </div>

      {/* Droite */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-indigo-600">
          <FaBell size={20} />
          {/* 🔴 Badge de notification (optionnel) */}
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* Admin connecté */}
        <div className="flex items-center gap-2 text-gray-700">
          <FaUserCircle size={28} className="text-indigo-600" />
          <span className="font-semibold">{adminName}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-500 transition"
          title="Se déconnecter"
        >
          <FaSignOutAlt size={22} />
        </button>

      </div>
    </header>
  );
};

export default Header;
