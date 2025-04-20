import {
  FaBoxOpen, FaUsers, FaTruck, FaReceipt,
  FaShoppingCart, FaBalanceScale, FaTags, FaUserFriends,
  FaChevronRight, FaChevronDown
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [openVisite, setOpenVisite] = useState(false);
  const location = useLocation();

  // Ouvrir automatiquement le sous-menu si l’URL est /raisons-visite
  useEffect(() => {
    if (location.pathname.startsWith("/raisons-visite")) {
      setOpenVisite(true);
    }
  }, [location.pathname]);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FaReceipt /> },
    { to: "/products", label: "Produits", icon: <FaBoxOpen /> },
    { to: "/users", label: "Utilisateurs", icon: <FaUsers /> },
    
    { to: "/orders", label: "Commandes", icon: <FaShoppingCart /> },
    { to: "/invoices", label: "Bon de Commande", icon: <FaReceipt /> },
    { to: "/units", label: "Gestion des Unités", icon: <FaBalanceScale /> },
    { to: "/categories", label: "Gestion des Catégories", icon: <FaTags /> },
    { to: "/clients-list", label: "Liste des Clients", icon: <FaUserFriends /> },
    { to: "/promotions", label: "Promotions", icon: <FaTags /> },
    { to: "/objectifs", label: "Objectifs commerciaux", icon: <FaBalanceScale /> },
    { to: "/map-commercials", label: "Carte Commerciaux", icon: <FaTruck /> },
  
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 fixed top-0 left-0 overflow-y-auto shadow-lg">
      <h1 className="text-xl font-bold mb-8">Digital Process</h1>

      <nav className="flex flex-col gap-4">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"
              }`
            }
          >
            {icon} {label}
          </NavLink>
        ))}

        {/* Bloc Visite avec lien vers /visite + toggle sous-menu */}
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

          {/* Sous-menu Raisons de visite */}
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
      </nav>
    </div>
  );
};

export default Sidebar;
