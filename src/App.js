import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Products from "./components/pages/Products";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header"; // 🆕 Import du Header
import { Fragment } from "react";
import UnitsPage from "./components/pages/UnitsPage";
import CategoriesPage from "./components/pages/CategoriesPage";
import Orders from "./components/pages/Orders";
import BandeDeCommande from "./components/pages/BandeDeCommande";
import UsersPage from "./components/pages/UsersPage";
import Suppliers from "./components/pages/Suppliers";

function LayoutWithSidebar({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header /> {/* 🔥 Header au-dessus de tout */}
        {children}
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <Fragment>
      <Routes>
        <Route path="/login" element={<Login />} />
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
          path="suppliers"
          element={
            <PrivateRoute>
              <LayoutWithSidebar>
                <Suppliers />
              </LayoutWithSidebar>
            </PrivateRoute>
          }
        />

      </Routes>
    </Fragment>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
