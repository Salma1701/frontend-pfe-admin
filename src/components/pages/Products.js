import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaTags,
  FaBoxOpen,
  FaThLarge,
  FaList,
  FaEdit,
} from "react-icons/fa";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [zoomImage, setZoomImage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center gap-3">
          <FaBoxOpen />
          Gestion des Produits
        </h2>

        {/* 🔎 Filtres et Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="pl-10 pr-4 py-2 w-full border rounded shadow-sm"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-4 py-2 rounded shadow bg-white border w-full md:w-1/4"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full shadow ${
                viewMode === "grid"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full shadow ${
                viewMode === "list"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <FaList />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2"
            >
              <FaPlus />
              Ajouter
            </button>
          </div>
        </div>

        {/* 🧾 Vue produit */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="relative bg-white border shadow-lg rounded-xl overflow-hidden hover:scale-[1.02] transition"
              >
                <img
                  src={
                    prod.images?.[0]
                      ? `http://localhost:4000${prod.images[0]}`
                      : "/default.jpg"
                  }
                  alt={prod.nom}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() =>
                    setZoomImage(
                      prod.images?.[0]
                        ? `http://localhost:4000${prod.images[0]}`
                        : "/default.jpg"
                    )
                  }
                />
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <FaBoxOpen className="text-indigo-500" />
                    {prod.nom}
                  </h3>
                  <p className="text-gray-500 text-sm">{prod.description}</p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      {prod.unite?.nom}
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <FaTags />
                      {prod.categorie?.nom}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-indigo-700">
                      {prod.prix} TND
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(prod);
                          setShowEditModal(true);
                        }}
                        className="px-2 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-sm flex items-center gap-1"
                      >
                        <FaEdit /> Modifier
                      </button>
                      <button
                        onClick={() =>
                          toggleProductStatus(prod.id, prod.isActive)
                        }
                        disabled={loadingToggleId === prod.id}
                        className={`px-2 py-1 rounded text-white text-sm ${
                          prod.isActive
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {loadingToggleId === prod.id
                          ? "..."
                          : prod.isActive
                          ? "Actif"
                          : "Inactif"}
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
                    prod.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {prod.isActive ? "Actif" : "Inactif"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg w-full">
            <table className="w-full text-sm text-gray-700 rounded overflow-hidden">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="py-3 px-4 text-left">Nom</th>
                  <th className="py-3 px-4 text-left">Catégorie</th>
                  <th className="py-3 px-4 text-left">Unité</th>
                  <th className="py-3 px-4 text-left">Prix</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{prod.nom}</td>
                    <td className="py-3 px-4">{prod.categorie?.nom || "—"}</td>
                    <td className="py-3 px-4">{prod.unite?.nom || "—"}</td>
                    <td className="py-3 px-4">{prod.prix} TND</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          toggleProductStatus(prod.id, prod.isActive)
                        }
                        disabled={loadingToggleId === prod.id}
                        className={`px-4 py-1 rounded font-semibold text-white ${
                          prod.isActive ? "bg-green-500" : "bg-red-500"
                        } hover:opacity-80`}
                      >
                        {loadingToggleId === prod.id
                          ? "..."
                          : prod.isActive
                          ? "Actif"
                          : "Inactif"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🔍 Zoom image */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg overflow-hidden p-4 shadow-xl">
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>
            <img
              src={zoomImage}
              alt="Zoom"
              className="w-[80vw] max-w-md h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* ➕ Modal Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">
              Ajouter un produit
            </h2>
            <AddProductForm
              onClose={() => {
                setShowAddModal(false);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}

      {/* ✏️ Modal Modifier */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedProduct(null);
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">
              Modifier un produit
            </h2>
            <EditProductForm
              product={selectedProduct}
              onClose={() => {
                setShowEditModal(false);
                setSelectedProduct(null);
                fetchProducts();
              }}
              refreshProducts={fetchProducts}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
