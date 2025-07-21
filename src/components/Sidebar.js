import {
  FaBoxOpen, FaUsers, FaTruck, FaReceipt,
  FaShoppingCart, FaBalanceScale, FaTags, FaUserFriends,
  FaChevronRight, FaChevronDown
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [openVisite, setOpenVisite] = useState(false);
  const [openClients, setOpenClients] = useState(false); // Added state for Clients submenu
  const location = useLocation();

  // Ouvrir automatiquement le sous-menu si l’URL est /raisons-visite
  useEffect(() => {
    if (location.pathname.startsWith("/raisons-visite")) {
      setOpenVisite(true);
    }
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Dashboard", icon: <FaReceipt /> },
    { to: "/products", label: "Produits", icon: <FaBoxOpen /> },
    { to: "/users", label: "Utilisateurs", icon: <FaUsers /> },
    
    { to: "/orders", label: "Commandes", icon: <FaShoppingCart /> },
    { to: "/invoices", label: "Bon de Commande", icon: <FaReceipt /> },
    { to: "/units", label: "Gestion des Unités", icon: <FaBalanceScale /> },
    { to: "/categories", label: "Gestion des Catégories", icon: <FaTags /> },
    { to: "/categories-clients", label: "Catégories Clients", icon: <FaTags /> },
    { to: "/clients-list", label: "Liste des Clients", icon: <FaUserFriends /> },
    { to: "/promotions", label: "Promotions", icon: <FaTags /> },
    { to: "/objectifs", label: "Objectifs commerciaux", icon: <FaBalanceScale /> },
    { to: "/satisfaction", label: "Enquêtes Satisfaction", icon: <FaReceipt /> },
    { to: "/map-commercials", label: "Carte Commerciaux", icon: <FaTruck /> },
  
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 fixed top-0 left-0 overflow-y-auto shadow-lg">
      <h1 className="text-xl font-bold mb-8">Digital Process</h1>

      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaReceipt /> Dashboard</NavLink>
        <NavLink to="/products" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaBoxOpen /> Produits</NavLink>
        <NavLink to="/users" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaUsers /> Utilisateurs</NavLink>
        <NavLink to="/orders" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaShoppingCart /> Commandes</NavLink>
        <NavLink to="/invoices" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaReceipt /> Bon de Commande</NavLink>
        {/* Bloc Visite avec sous-menu, juste après Bon de Commande */}
        <div className="flex flex-col">
          <NavLink
            to="/visite"
            onClick={() => setOpenVisite(!openVisite)}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"
              }`
            }
          >
            <div className="flex items-center gap-2">
              <FaUserFriends /> <span>Visite</span>
            </div>
            {openVisite ? <FaChevronDown /> : <FaChevronRight />}
          </NavLink>
          {openVisite && (
            <NavLink
              to="/raisons-visite"
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
        {/* Sous-menu Clients après Visite */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setOpenClients((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none text-left w-full"
            style={{ background: openClients ? '#2563eb' : 'transparent', color: openClients ? 'white' : '' }}
          >
            <FaUserFriends /> <span>Clients</span> {openClients ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openClients && (
            <div className="ml-8 flex flex-col gap-1 mt-1">
              <NavLink to="/clients-list" className={({ isActive }) => `flex items-center gap-2 px-2 py-1 rounded transition-all duration-200 text-sm ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white text-gray-300"}` }>
                Liste des Clients
              </NavLink>
              <NavLink to="/categories-clients" className={({ isActive }) => `flex items-center gap-2 px-2 py-1 rounded transition-all duration-200 text-sm ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white text-gray-300"}` }>
                Catégories Clients
              </NavLink>
            </div>
          )}
        </div>
        <NavLink to="/objectifs" className={({ isActive }) => `flex items-center gap-2 px-4  py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaBalanceScale /> Objectifs commerciaux</NavLink>
        {/* Le reste du menu */}
        <NavLink to="/promotions" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaTags /> Promotions</NavLink>
        <NavLink to="/units" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaBalanceScale /> Gestion des Unités</NavLink>
        <NavLink to="/categories" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaTags /> Gestion des Catégories</NavLink>
        <NavLink to="/satisfaction" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaReceipt /> Enquêtes Satisfaction</NavLink>
        <NavLink to="/map-commercials" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"}` }><FaTruck /> Carte Commerciaux</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
