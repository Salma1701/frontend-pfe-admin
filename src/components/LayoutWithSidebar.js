import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Navbar from "./Navbar";

const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar Fixe */}
      <Sidebar />

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 left-64 right-0 z-50">
          <Header />
        </div>
        <div className="fixed top-[64px] left-64 right-0 z-40"> {/* 64px = hauteur Header */}
          <Navbar />
        </div>
        <main className="p-2 pt-[90px]">{children}</main> {/* 64px Header + 48px Navbar */}
      </div>
    </div>
  );
};

export default LayoutWithSidebar;
