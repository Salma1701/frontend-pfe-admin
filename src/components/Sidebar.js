import {
    FaBoxOpen,
    FaUsers,
    FaTruck,
    FaReceipt,
    FaShoppingCart,
    FaBalanceScale, // ⚖️ pour unités
    FaTags,         // 🏷️ pour catégories
  } from "react-icons/fa";
  import { NavLink } from "react-router-dom";
  
  const Sidebar = () => {
    const links = [
      { to: "/dashboard", label: "Dashboard", icon: <FaReceipt /> },
      { to: "/products", label: "Produits", icon: <FaBoxOpen /> },
      { to: "/users", label: "Utilisateurs", icon: <FaUsers /> },
      { to: "/suppliers", label: "Fournisseurs", icon: <FaTruck /> },
      { to: "/orders", label: "Commandes", icon: <FaShoppingCart /> },
      { to: "/invoices", label: "Bande de Commande", icon: <FaReceipt /> },
      { to: "/units", label: "Gestion des Unités", icon: <FaBalanceScale /> }, // 🆕 Unités
      { to: "/categories", label: "Gestion des Catégories", icon: <FaTags /> }, // 🆕 Catégories
    ];
  
    return (
      <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-xl font-bold mb-8">Digital Process</h1>
        <nav className="flex flex-col gap-4">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
                }`
              }
            >
              {icon} {label}
            </NavLink>
          ))}
        </nav>
      </div>
    );
  };
  
  export default Sidebar;
  