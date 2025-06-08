import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaTimes, FaTags, FaBoxOpen, FaThLarge, FaList, FaEdit } from "react-icons/fa";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm"; // 👈 ajoute ça
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [zoomImage, setZoomImage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // 👈
  const [selectedProduct, setSelectedProduct] = useState(null); // 👈
  const [viewMode, setViewMode] = useState("grid");
  const [loadingToggleId, setLoadingToggleId] = useState(null);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:4000/produits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      const uniqueCats = [...new Set(res.data.map((p) => p.categorie?.nom))];
      setCategories(uniqueCats);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
    }
  };

  const toggleProductStatus = async (id, currentStatus) => {
    try {
      setLoadingToggleId(id);
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:4000/produits/${id}/status`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingToggleId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.nom?.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCat ? p.categorie?.nom === selectedCat : true)
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* 🔎 Header Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        {/* 🔍 Search */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow w-full sm:w-1/3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* 🔽 Filter by category */}
        <select
          className="px-4 py-2 rounded shadow bg-white border w-full sm:w-1/4"
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 🖼️ View mode */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-full ${viewMode === "grid" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
          >
            <FaThLarge />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-full ${viewMode === "list" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
          >
            <FaList />
          </button>
        </div>

        {/* ➕ Add Product */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition"
        >
          <FaPlus />
          Ajouter Produit
        </button>
      </div>

      {/* 📦 Products */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="relative bg-white/70 border shadow-xl rounded-xl overflow-hidden flex flex-col hover:scale-[1.02] transition">

              {/* 🖼️ Image */}
              <img
                src={prod.images?.[0] ? `http://localhost:4000${prod.images[0]}` : "/default.jpg"}
                alt={prod.nom}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => setZoomImage(prod.images?.[0] ? `http://localhost:4000${prod.images[0]}` : "/default.jpg")}
              />

              {/* 📝 Product details */}
              <div className="flex flex-col flex-1 p-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaBoxOpen className="text-indigo-500" />
                  {prod.nom}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{prod.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{prod.unite?.nom}</span>
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <FaTags />
                    {prod.categorie?.nom}
                  </span>
                </div>

                {/* 💵 Price + Toggle + Edit */}
                <div className="flex justify-between items-center mt-auto pt-4">
                  <span className="font-semibold text-indigo-700">
                    {prod.prix} TND
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedProduct(prod); setShowEditModal(true); }}
                      className="px-2 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-sm flex items-center gap-1"
                    >
                      <FaEdit />
                      Modifier
                    </button>
                    <button
                      onClick={() => toggleProductStatus(prod.id, prod.isActive)}
                      disabled={loadingToggleId === prod.id}
                      className={`px-2 py-1 rounded font-semibold text-white text-sm ${prod.isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                    >
                      {loadingToggleId === prod.id ? "..." : prod.isActive ? "Actif" : "Inactif"}
                    </button>
                  </div>
                </div>
              </div>

              {/* 🔥 Badge Actif/Inactif */}
              <div className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
                prod.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {prod.isActive ? "Actif" : "Inactif"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 📝 Table View
        <div className="overflow-x-auto bg-white shadow rounded-lg w-full">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Catégorie</th>
                <th className="p-3 text-left">Unité</th>
                <th className="p-3 text-left">Prix</th>
                <th className="p-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{prod.nom}</td>
                  <td className="p-3">{prod.categorie?.nom || "—"}</td>
                  <td className="p-3">{prod.unite?.nom || "—"}</td>
                  <td className="p-3">{prod.prix} TND</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleProductStatus(prod.id, prod.isActive)}
                      disabled={loadingToggleId === prod.id}
                      className={`px-4 py-1 rounded font-semibold text-white ${prod.isActive ? "bg-green-500" : "bg-red-500"} hover:opacity-80`}
                    >
                      {loadingToggleId === prod.id ? "..." : prod.isActive ? "Actif" : "Inactif"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔍 Zoom image Modal */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg overflow-hidden p-4 shadow-xl">
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>
            <img src={zoomImage} alt="Zoom" className="w-[80vw] max-w-md h-auto rounded-lg" />
          </div>
        </div>
      )}

      {/* ➕ Modal Ajouter Produit */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Ajouter un produit</h2>
            <AddProductForm onClose={() => { setShowAddModal(false); fetchProducts(); }} />
          </div>
        </div>
      )}

      {/* ✏️ Modal Modifier Produit */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Modifier un produit</h2>
            <EditProductForm
              product={selectedProduct}
              onClose={() => { setShowEditModal(false); setSelectedProduct(null); fetchProducts(); }}
              refreshProducts={fetchProducts}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
