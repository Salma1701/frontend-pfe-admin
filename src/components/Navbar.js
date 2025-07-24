import { NavLink } from "react-router-dom";
import {
  FaChartBar, FaBox, FaUsers, FaClipboardList, FaClipboardCheck,
  FaTags, FaMapMarkerAlt, FaBullseye, FaBars, FaTimes, FaChevronDown
} from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenSubmenu(null);
  };

  const menuItems = [
    { to: "/", icon: <FaChartBar />, label: "Dashboard" },
    { to: "/products", icon: <FaBox />, label: "Produits" },
    { to: "/users", icon: <FaUsers />, label: "Utilisateurs" },
    {
      label: "Commandes",
      icon: <FaClipboardList />,
      submenu: [
        { to: "/orders", label: "Commandes" },
        { to: "/invoices", label: "Bon de Commande" },
      ]
    },
    {
      label: "Visite",
      icon: <FaUsers />,
      submenu: [
        { to: "/visite", label: "Visite" },
        { to: "/raisons-visite", label: "Raisons de visite" },
      ]
    },
    {
      label: "Clients",
      icon: <FaUsers />,
      submenu: [
        { to: "/clients-list", label: "Clients" },
        { to: "/categories-clients", label: "Catégories Clients" },
      ]
    },
    { to: "/objectifs", icon: <FaBullseye />, label: "Objectifs" },
    { to: "/promotions", icon: <FaTags />, label: "Promotions" },
    { to: "/units", icon: <FaTags />, label: "Unités" },
    { to: "/categories", icon: <FaTags />, label: "Catégories" },
    { to: "/satisfaction", icon: <FaClipboardCheck />, label: "Satisfaction" },
    { to: "/map-commercials", icon: <FaMapMarkerAlt />, label: "Carte" },
  ];

  return (
    <nav className="bg-slate-100 border-b border-gray-300 shadow-sm">
      <div className="max-w-full px-4 sm:px-8">
        {/* Menu burger pour mobile */}
        <div className="lg:hidden flex items-center justify-between h-17">
          <span className="font-bold text-lg text-gray-1000">Menu</span>
          <button 
            onClick={() => setMobileOpen((v) => !v)} 
            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.to ? (
                    <NavLink
                      to={item.to}
                      onClick={closeMobileMenu}
                      className={({ isActive }) => 
                        `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive 
                            ? "bg-blue-100 text-blue-700 font-semibold" 
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`
                      }
                    >
                      {item.icon} {item.label}
                    </NavLink>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {item.icon} {item.label}
                        </span>
                        <FaChevronDown 
                          className={`transition-transform ${openSubmenu === item.label ? 'rotate-180' : ''}`} 
                          size={12} 
                        />
                      </button>
                      {openSubmenu === item.label && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <NavLink
                              key={subIndex}
                              to={subItem.to}
                              onClick={closeMobileMenu}
                              className={({ isActive }) => 
                                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                  isActive 
                                    ? "bg-blue-100 text-blue-700 font-semibold" 
                                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                }`
                              }
                            >
                              {subItem.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navbar desktop */}
        <ul className="hidden lg:flex flex-wrap items-center h-auto text-xs font-medium text-gray-800 gap-x-6 lg:gap-x-8 w-full overflow-visible">
          {/* Groupe 1 - Liens simples */}
          <div className="flex flex-row items-center gap-2">
            {menuItems.slice(0, 3).map((item, index) => (
              <li key={index}>
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => 
                    `flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      isActive 
                        ? "bg-blue-100 text-blue-700 font-semibold" 
                        : "hover:bg-blue-50 hover:text-blue-600"
                    }`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              </li>
            ))}
          </div>

          {/* Sous-menus */}
          {menuItems.slice(3, 6).map((item, index) => (
            <div key={index} className="flex flex-row items-center gap-2 relative group">
              <li>
                <div className="flex items-center gap-1 px-2 py-1 rounded transition-colors hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                  {item.icon} {item.label}
                </div>
                <div className="absolute left-0 top-full mt-2 min-w-[180px] w-max flex flex-col bg-white shadow-lg rounded-lg z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 py-2 border">
                  {item.submenu.map((subItem, subIndex) => (
                    <NavLink 
                      key={subIndex}
                      to={subItem.to} 
                      className={({ isActive }) => 
                        `flex items-center gap-1 px-3 py-2 whitespace-nowrap transition-colors ${
                          isActive 
                            ? "bg-blue-100 text-blue-700 font-semibold" 
                            : "hover:bg-blue-50 hover:text-blue-600"
                        }`
                      }
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              </li>
            </div>
          ))}

          {/* Le reste des liens */}
          <div className="flex flex-row items-center gap-2">
            {menuItems.slice(6).map((item, index) => (
              <li key={index}>
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => 
                    `flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      isActive 
                        ? "bg-blue-100 text-blue-700 font-semibold" 
                        : "hover:bg-blue-50 hover:text-blue-600"
                    }`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              </li>
            ))}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
