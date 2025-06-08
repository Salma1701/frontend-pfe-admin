import { NavLink } from "react-router-dom";
import {
  FaChartBar, FaBox, FaUsers, FaClipboardList, FaClipboardCheck,
  FaTags, FaMapMarkerAlt, FaBullseye
} from "react-icons/fa";

const groupedLinks = [
  [
    { to: "/dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { to: "/map-commercials", label: "Carte", icon: <FaMapMarkerAlt /> },
  ],
  [
    { to: "/products", label: "Produits", icon: <FaBox /> },
    { to: "/categories", label: "Catégories", icon: <FaClipboardList /> },
    { to: "/units", label: "Unités", icon: <FaClipboardList /> },
  ],
  [
    { to: "/users", label: "Utilisateurs", icon: <FaUsers /> },
    { to: "/clients-list", label: "Clients", icon: <FaUsers /> },
  ],
  [
    { to: "/orders", label: "Commandes", icon: <FaClipboardList /> },
    { to: "/invoices", label: "Bon de Commande", icon: <FaClipboardCheck /> },
  ],
  [
    { to: "/promotions", label: "Promotions", icon: <FaTags /> },
    { to: "/objectifs", label: "Objectifs", icon: <FaBullseye /> },
  ],
];

const Navbar = () => {
  return (
    <nav className="bg-slate-100 border-b border-gray-300 shadow-sm">
      <div className="max-w-full px-6">
        <ul className="flex justify-between items-center h-14 text-sm font-medium text-gray-700">
          {groupedLinks.map((group, i) => (
            <div key={i} className="flex items-center gap-4 px-2 border-l border-gray-300 first:border-none">
              {group.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-1 px-2 py-1 rounded hover:text-blue-600 transition ${
                        isActive ? "text-blue-600 font-semibold underline" : ""
                      }`
                    }
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </div>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
