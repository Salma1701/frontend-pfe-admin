import {
  FaBoxOpen, FaUsers, FaTruck, FaReceipt,
  FaShoppingCart, FaBalanceScale, FaTags, FaUserFriends,
  FaChevronRight, FaChevronDown, FaTimes
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = ({ onClose }) => {
  const [openVisite, setOpenVisite] = useState(false);
  const [openClients, setOpenClients] = useState(false);
  const location = useLocation();

  // Ouvrir automatiquement le sous-menu si l'URL est /raisons-visite
  useEffect(() => {
    if (location.pathname.startsWith("/raisons-visite")) {
      setOpenVisite(true);
    }
  }, [location.pathname]);

  const handleNavClick = () => {
    // Fermer la sidebar sur mobile après un clic
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  return (
    <div className="h-screen w-full lg:w-64 bg-gray-900 text-white flex flex-col p-4 overflow-y-auto shadow-lg">
      {/* Header avec bouton fermer sur mobile */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg lg:text-xl font-bold">Digital Process</h1>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          title="Fermer le menu"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink 
          to="/" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaReceipt /> Dashboard
        </NavLink>
        
        <NavLink 
          to="/products" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaBoxOpen /> Produits
        </NavLink>
        
        <NavLink 
          to="/users" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaUsers /> Utilisateurs
        </NavLink>
        
        <NavLink 
          to="/orders" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaShoppingCart /> Commandes
        </NavLink>
        
        <NavLink 
          to="/invoices" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaReceipt /> Bon de Commande
        </NavLink>
        
        {/* Bloc Visite avec sous-menu */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setOpenVisite(!openVisite)}
            className="flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none text-left w-full text-sm lg:text-base"
            style={{ background: openVisite ? '#2563eb' : 'transparent', color: openVisite ? 'white' : '' }}
          >
            <div className="flex items-center gap-2">
              <FaUserFriends /> <span>Visite</span>
            </div>
            {openVisite ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openVisite && (
            <NavLink
              to="/raisons-visite"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `ml-8 mt-2 text-sm rounded px-2 py-1 transition ${
                  isActive ? "bg-blue-600 text-white" : "hover:text-white hover:bg-blue-500 text-gray-300"
                }`
              }
            >
              Raisons de visite
            </NavLink>
          )}
        </div>
        
        {/* Sous-menu Clients */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setOpenClients((prev) => !prev)}
            className="flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none text-left w-full text-sm lg:text-base"
            style={{ background: openClients ? '#2563eb' : 'transparent', color: openClients ? 'white' : '' }}
          >
            <div className="flex items-center gap-2">
              <FaUserFriends /> <span>Clients</span>
            </div>
            {openClients ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openClients && (
            <div className="ml-8 flex flex-col gap-1 mt-1">
              <NavLink 
                to="/clients-list" 
                onClick={handleNavClick}
                className={({ isActive }) => `flex items-center gap-2 px-2 py-1 rounded transition-all duration-200 text-sm ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white text-gray-300"}` }
              >
                Liste des Clients
              </NavLink>
              <NavLink 
                to="/categories-clients" 
                onClick={handleNavClick}
                className={({ isActive }) => `flex items-center gap-2 px-2 py-1 rounded transition-all duration-200 text-sm ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white text-gray-300"}` }
              >
                Catégories Clients
              </NavLink>
            </div>
          )}
        </div>
        
        <NavLink 
          to="/objectifs" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaBalanceScale /> Objectifs commerciaux
        </NavLink>
        
        <NavLink 
          to="/promotions" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaTags /> Promotions
        </NavLink>
        
        <NavLink 
          to="/units" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaBalanceScale /> Gestion des Unités
        </NavLink>
        
        <NavLink 
          to="/categories" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaTags /> Gestion des Catégories
        </NavLink>
        
        <NavLink 
          to="/satisfaction" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaReceipt /> Enquêtes Satisfaction
        </NavLink>
        
        <NavLink 
          to="/map-commercials" 
          onClick={handleNavClick}
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }
        >
          <FaTruck /> Carte Commerciaux
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
