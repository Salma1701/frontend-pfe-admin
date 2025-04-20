import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Fragment } from "react";
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
import { ToastContainer } from "react-toastify";
import AdminVisitesPage from "./components/pages/AdminVisitesPage";
import RaisonsVisitePage from "./components/pages/RaisonsVisitePage";
import AdminPromotionsPage from "./components/pages/AdminPromotionsPage";
import AdminObjectifsPage from "./components/pages/AdminObjectifsPage";
import MapCommercials from "./components/pages/MapCommercials";
function LayoutWithSidebar({ children }) {
  return (
    <div className="flex">
      {/* 🧱 Sidebar fixée */}
      <Sidebar />
      {/* 👉 Contenu principal */}
      <div className="flex-1 flex flex-col min-h-screen ml-64 bg-gray-100">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
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
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <Dashboard />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <Products />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/units"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <UnitsPage />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <CategoriesPage />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/clients-list"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <ClientsPage />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <Orders />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <InvoicesPage />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/invoices/:id"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <BandeDeCommande />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/bande-de-commande/:id"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <BandeDeCommande />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <UsersPage />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/visite"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <AdminVisitesPage />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
        <Route
  path="/promotions"
  element={
    <PrivateRoute>
      <LayoutWithSidebar>
        <AdminPromotionsPage />
      </LayoutWithSidebar>
    </PrivateRoute>
  }
/>
<Route
  path="/objectifs"
  element={
    <PrivateRoute>
      <LayoutWithSidebar>
        <AdminObjectifsPage />
      </LayoutWithSidebar>
    </PrivateRoute>
  }
/>
  {/* autres routes */}
       <Route
        path="/raisons-visite"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <RaisonsVisitePage />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
  path="/map-commercials"
  element={
    <PrivateRoute>
      <LayoutWithSidebar>
        <MapCommercials />
      </LayoutWithSidebar>
    </PrivateRoute>
  }
/>
      <Route
        path="/suppliers"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <Suppliers />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer />
    </Router>
  );

}

export default App;
