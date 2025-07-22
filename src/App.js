import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Products from "./components/pages/Products";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import UnitsPage from "./components/pages/UnitsPage";
import CategoriesPage from "./components/pages/CategoriesPage";
import Orders from "./components/pages/Orders";
import BandeDeCommande from "./components/pages/BandeDeCommande";
import UsersPage from "./components/pages/UsersPage";
import Suppliers from "./components/pages/Suppliers";
import ClientsPage from "./components/pages/ClientsPage";
import InvoicesPage from "./components/pages/InvoicesPage";
import AdminVisitesPage from "./components/pages/AdminVisitesPage";
import RaisonsVisitePage from "./components/pages/RaisonsVisitePage";
import AdminPromotionsPage from "./components/pages/AdminPromotionsPage";
import AdminObjectifsPage from "./components/pages/AdminObjectifsPage";
import MapCommercials from "./components/pages/MapCommercials";
import PublicRoute from "./components/pages/publicRoute";
import Navbar from "./components/Navbar";
import ReclamationsPage from "./components/pages/ReclamationsPage";
import AdminSatisfactionPage from "./components/pages/AdminSatisfactionPage";
import BonDeCommandeView from "./components/pages/BonDeCommandeView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./components/pages/ResetPassword";
import ProductDetails from "./components/pages/ProductDetails";
import AdminCategoriesClientsPage from "./components/pages/AdminCategoriesClientsPage";

function LayoutWithSidebar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay pour mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        sidebar-responsive
        ${sidebarOpen ? 'open' : ''}
        bg-white shadow-lg
      `}>
        <Sidebar onClose={closeSidebar} />
      </div>
      
      {/* Main content */}
      <div className="main-content-responsive flex flex-col">
        <Header onMenuClick={toggleSidebar} />
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto responsive-container">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><LayoutWithSidebar><Dashboard /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><LayoutWithSidebar><Products /></LayoutWithSidebar></PrivateRoute>} />
     
      <Route path="/units" element={<PrivateRoute><LayoutWithSidebar><UnitsPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/categories" element={<PrivateRoute><LayoutWithSidebar><CategoriesPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/categories-clients" element={<PrivateRoute><LayoutWithSidebar><AdminCategoriesClientsPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/clients-list" element={<PrivateRoute><LayoutWithSidebar><ClientsPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><LayoutWithSidebar><Orders /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/invoices" element={<PrivateRoute><LayoutWithSidebar><InvoicesPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/invoices/:id" element={<PrivateRoute><LayoutWithSidebar><BandeDeCommande /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/bande-de-commande/:id" element={<PrivateRoute><LayoutWithSidebar><BandeDeCommande /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><LayoutWithSidebar><UsersPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/visite" element={<PrivateRoute><LayoutWithSidebar><AdminVisitesPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/promotions" element={<PrivateRoute><LayoutWithSidebar><AdminPromotionsPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/reclamations/:id" element={<ReclamationsPage />} />
      <Route path="/objectifs" element={<PrivateRoute><LayoutWithSidebar><AdminObjectifsPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/satisfaction" element={<PrivateRoute><LayoutWithSidebar><AdminSatisfactionPage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/raisons-visite" element={<PrivateRoute><LayoutWithSidebar><RaisonsVisitePage /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/map-commercials" element={<PrivateRoute><LayoutWithSidebar><MapCommercials /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/bon-de-commande/:id" element={<PrivateRoute><LayoutWithSidebar><BonDeCommandeView /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/suppliers" element={<PrivateRoute><LayoutWithSidebar><Suppliers /></LayoutWithSidebar></PrivateRoute>} />
      <Route path="/reclamations" element={<PrivateRoute><LayoutWithSidebar><ReclamationsPage /></LayoutWithSidebar></PrivateRoute>} />
       <Route 
       path="/reset-password" element={<ResetPassword />} 
       /> 
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      {/* ✅ ToastContainer configuré */}
      <ToastContainer position="top-center" autoClose={4000} />
    </Router>
  );
}

export default App;
