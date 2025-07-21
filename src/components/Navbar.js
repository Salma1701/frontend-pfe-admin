import { NavLink } from "react-router-dom";
import {
  FaChartBar, FaBox, FaUsers, FaClipboardList, FaClipboardCheck,
  FaTags, FaMapMarkerAlt, FaBullseye, FaBars, FaTimes
} from "react-icons/fa";
import { useState } from "react";
// plus besoin de useState

const Navbar = () => {
  // const [openClients, setOpenClients] = useState(false);
  // const [openVisite, setOpenVisite] = useState(false);
  // const [openCommandes, setOpenCommandes] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-slate-100 border-b border-gray-300 shadow-sm">
      <div className="max-w-full px-6">
        {/* Menu burger pour mobile */}
        <div className="md:hidden flex items-center justify-between h-14">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setMobileOpen((v) => !v)} className="p-2">
            {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
        {/* Navbar desktop */}
        <ul className="hidden md:flex flex-wrap items-center h-auto text-xs font-medium text-gray-800 gap-x-10  w-full overflow-visible">
          {/* Groupe 1 */}
          <div className="flex flex-row items-center gap-2">
            <li>
              <NavLink to="/" className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                <FaChartBar /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                <FaBox /> Produits
              </NavLink>
            </li>
            <li>
              <NavLink to="/users" className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                <FaUsers /> Utilisateurs
              </NavLink>
            </li>
          </div>
          {/* Commandes sous-menu */}
          <div className="flex flex-row items-center gap-2 relative group">
            <li>
              <div className="flex items-center gap-1 px-2 py-1 rounded transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                <FaClipboardList /> Commandes
              </div>
              <div className="absolute left-0 top-full mt-2 min-w-[180px] w-max flex flex-col bg-white shadow-lg rounded z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 py-2">
                <NavLink to="/orders" className={({ isActive }) => `flex items-center gap-1 px-3 py-1 whitespace-nowrap ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                  Commandes
                </NavLink>
                <NavLink to="/invoices" className={({ isActive }) => `flex items-center gap-1 px-3 py-1 whitespace-nowrap ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                  Bon de Commande
                </NavLink>
              </div>
            </li>
          </div>
          {/* Visite sous-menu */}
          <div className="flex flex-row items-center gap-2 relative group">
            <li>
              <div className="flex items-center gap-1 px-2 py-1 rounded transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                <FaUsers /> Visite
              </div>
              <div className="absolute left-0 top-full mt-2 min-w-[180px] flex flex-col bg-white shadow-lg rounded z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 py-2">
                <NavLink to="/visite" className={({ isActive }) => `flex items-center gap-1 px-3 py-1 whitespace-nowrap ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                  Visite
                </NavLink>
                <NavLink to="/raisons-visite" className={({ isActive }) => `flex items-center gap-1 px-3 py-1 whitespace-nowrap ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                  Raisons de visite
                </NavLink>
              </div>
            </li>
          </div>
          {/* Clients sous-menu */}
          <div className="flex flex-row items-center gap-2 relative group">
            <li>
              <div className="flex items-center gap-1 px-2 py-1 rounded transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                <FaUsers /> Clients
              </div>
              <div className="absolute left-0 top-full mt-2 min-w-[180px] flex flex-col bg-white shadow-lg rounded z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 py-2">
                <NavLink to="/clients-list" className={({ isActive }) => `flex items-center gap-1 px-3 py-1 whitespace-nowrap ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                  Clients
                </NavLink>
                <NavLink to="/categories-clients" className={({ isActive }) => `flex items-center gap-1 px-3 py-1 whitespace-nowrap ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                  Catégories Clients
                </NavLink>
              </div>
            </li>
          </div>
          {/* Le reste des liens */}
          <div className="flex flex-row items-center gap-2">
            <li>
              <NavLink to="/objectifs" className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                <FaBullseye /> Objectifs
              </NavLink>
            </li>
            <li>
              <NavLink to="/promotions" className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                <FaTags /> Promotions
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories" className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                <FaClipboardList /> Catégories
              </NavLink>
            </li>
            <li>
              <NavLink to="/units" className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                <FaClipboardList /> Unités
              </NavLink>
            </li>
            <li>
              <NavLink to="/satisfaction" className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                <FaClipboardCheck /> Enquêtes
              </NavLink>
            </li>
            <li>
              <NavLink to="/map-commercials" className={({ isActive }) => `flex items-center gap-1 px-2 py-1 rounded transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>
                <FaMapMarkerAlt /> Carte
              </NavLink>
            </li>
          </div>
        </ul>
        {/* Navbar mobile (vertical, accordéon) */}
        {mobileOpen && (
          <ul className="flex flex-col md:hidden bg-white shadow-lg rounded-b z-50 p-4 gap-y-2">
            {/* Dashboard, Produits, Utilisateurs */}
            <li><NavLink to="/" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }><FaChartBar /> Dashboard</NavLink></li>
            <li><NavLink to="/products" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }><FaBox /> Produits</NavLink></li>
            <li><NavLink to="/users" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }><FaUsers /> Utilisateurs</NavLink></li>
            {/* Accordéon Commandes */}
            <li>
              <details className="group">
                <summary className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-blue-50 hover:text-blue-600"> <FaClipboardList /> Commandes </summary>
                <div className="flex flex-col ml-4 gap-1 mt-1">
                  <NavLink to="/orders" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>Commandes</NavLink>
                  <NavLink to="/invoices" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>Bon de Commande</NavLink>
                </div>
              </details>
            </li>
            {/* Accordéon Visite */}
            <li>
              <details className="group">
                <summary className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-blue-50 hover:text-blue-600"> <FaUsers /> Visite </summary>
                <div className="flex flex-col ml-4 gap-1 mt-1">
                  <NavLink to="/visite" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>Visite</NavLink>
                  <NavLink to="/raisons-visite" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>Raisons de visite</NavLink>
                </div>
              </details>
            </li>
            {/* Accordéon Clients */}
            <li>
              <details className="group">
                <summary className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-blue-50 hover:text-blue-600"> <FaUsers /> Clients </summary>
                <div className="flex flex-col ml-4 gap-1 mt-1">
                  <NavLink to="/clients-list" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>Clients</NavLink>
                  <NavLink to="/categories-clients" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }>Catégories Clients</NavLink>
                </div>
              </details>
            </li>
            {/* Le reste des liens */}
            <li><NavLink to="/objectifs" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }><FaBullseye /> Objectifs</NavLink></li>
            <li><NavLink to="/promotions" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }><FaTags /> Promotions</NavLink></li>
            <li><NavLink to="/categories" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }><FaClipboardList /> Catégories</NavLink></li>
            <li><NavLink to="/units" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }><FaClipboardList /> Unités</NavLink></li>
            <li><NavLink to="/satisfaction" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }><FaClipboardCheck /> Enquêtes</NavLink></li>
            <li><NavLink to="/map-commercials" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}` }><FaMapMarkerAlt /> Carte</NavLink></li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
