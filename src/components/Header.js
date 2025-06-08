import React, { useEffect, useState } from "react";
import { FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [reclamations, setReclamations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const adminName = localStorageData?.user.nom;

  const fetchReclamationsOuvertes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/reclamations/ouvertes", {
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
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo / Titre */}
      <div className="text-2xl font-bold text-indigo-600">
        Digital Process Distribution
      </div>

      {/* Zone droite */}
      <div className="flex items-center gap-6 relative">
        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            className="text-gray-600 hover:text-indigo-600"
            title="Réclamations ouvertes"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaBell size={20} />
          </button>

          {reclamations.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {reclamations.length}
            </span>
          )}

          {/* Menu déroulant */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow-md z-50 max-h-80 overflow-y-auto">
              <div className="p-3 font-semibold border-b">📢 Réclamations ouvertes</div>
              {reclamations.length === 0 ? (
                <div className="p-3 text-gray-500">Aucune réclamation</div>
              ) : (
                reclamations.map((rec, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      navigate("/reclamations");
                      setShowDropdown(false);
                    }}
                  >
                    <div className="font-semibold">{rec.sujet}</div>
                    <div className="text-gray-500 text-xs">
                      Client : {rec.client?.nom ?? "—"}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 Nom Admin */}
        <div className="flex items-center gap-2 text-gray-700">
          <FaUserCircle size={28} className="text-indigo-600" />
          <span className="font-semibold">{adminName}</span>
        </div>

        {/* 🚪 Déconnexion */}
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
