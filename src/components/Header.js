import React, { useEffect, useState } from "react";
import { FaBell, FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [reclamations, setReclamations] = useState([]);

  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const adminName = localStorageData?.user.nom;

  const fetchReclamationsOuvertes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/reclamations/ouvertes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReclamations(res.data);
    } catch (error) {
      console.error("Erreur récupération réclamations", error);
    }
  };

  useEffect(() => {
    fetchReclamationsOuvertes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md px-4 sm:px-6 py-4 flex justify-between items-center">
      {/* Menu mobile + Logo */}
      <div className="flex items-center gap-4">
        {/* Bouton menu mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
          title="Menu"
        >
          <FaBars size={20} />
        </button>
        
        {/* Logo / Titre */}
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600 truncate">
          Digital Process Distribution
        </div>
      </div>

      {/* Zone droite */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            className="text-gray-600 hover:text-indigo-600 relative p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Réclamations ouvertes"
            onClick={() => navigate("/reclamations")}
          >
            <FaBell size={18} className="sm:w-5 sm:h-5" />
            {reclamations.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center">
                {reclamations.length}
              </span>
            )}
          </button>
        </div>

        {/* 👤 Nom Admin - caché sur mobile */}
        <div className="hidden sm:flex items-center gap-2 text-gray-700">
          <FaUserCircle size={24} className="text-indigo-600" />
          <span className="font-semibold text-sm lg:text-base">{adminName}</span>
        </div>

        {/* 🚪 Déconnexion */}
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-500 transition p-2 rounded-md hover:bg-gray-100"
          title="Se déconnecter"
        >
          <FaSignOutAlt size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
