import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Navbar from "./Navbar";

const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Fixe */}
      <Sidebar />

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <Navbar />        {/* 🔵 Barre horizontale */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default LayoutWithSidebar;
