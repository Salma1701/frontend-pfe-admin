// ... importations inchangées
import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaTags,
  FaBoxOpen,
  FaThLarge,
  FaList,
  FaEdit,
  FaFileExport,
} from "react-icons/fa";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [loadingToggleId, setLoadingToggleId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const exportToCSV = () => {
    const data = products.map((p) => ({
      Nom: p.nom,
      Description: p.description,
      Catégorie: p.categorie?.nom || "",
      Unité: p.unite?.nom || "",
      "Prix TTC (€)": Number(p.prix_unitaire_ttc).toFixed(2),
      "TVA (%)": p.tva,
      Statut: p.isActive ? "Actif" : "Inactif",
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "produits.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.nom?.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCat ? p.categorie?.nom === selectedCat : true)
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
<div className="flex justify-end mb-4 gap-2">
  <button
    onClick={() => setViewMode("grid")}
    className={`p-2 rounded ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
    title="Vue en grille"
  >
    <FaThLarge />
  </button>
  <button
    onClick={() => setViewMode("list")}
    className={`p-2 rounded ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
    title="Vue en liste"
    
  >
    <FaList />
   
  </button>
   
</div>
 console.log("mode :", viewMode);
  return (
   <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
  <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">

    <div className="flex justify-between items-center mb-6">
  <h2 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
    <FaBoxOpen className="text-indigo-500" /> Gestion des Produits
  </h2>

  {/* Boutons Grille / Liste */}
  <div className="flex gap-2 text-lg">
    <button
      onClick={() => setViewMode("grid")}
      className={`p-2 rounded ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
    >
      <FaThLarge />
    </button>
    <button
      onClick={() => setViewMode("list")}
      className={`p-2 rounded ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
    >
      <FaList />
    </button>
  </div>
</div>


   {/* Ligne : recherche & filtre à gauche, boutons à droite */}
<div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-6 gap-4 w-full">

  {/* 🔍 Recherche + 📦 Catégories (à gauche) */}
  <div className="flex items-center gap-4 flex-wrap">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Rechercher..."
      className="border border-gray-300 px-6 py-2 rounded-md text-base font-medium w-[200px]"
    />

    <select
      value={selectedCat}
      onChange={(e) => setSelectedCat(e.target.value)}
      className="border border-gray-300 px-6 py-2 rounded-md text-base font-medium w-[200px] bg-white"
    >
      <option value="">Toutes les catégories</option>
      {categories.map((cat, i) => (
        <option key={i} value={cat}>{cat}</option>
      ))}
    </select>
  </div>

  {/* 📁 Export + ➕ Ajouter (à droite) */}
  
  <div className="flex items-center gap-4">
    <button
      onClick={exportToCSV}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-base font-medium flex items-center gap-2 shadow"
    >
      <FaFileExport className="text-white" /> Export CSV
    </button>

    <button
      onClick={() => setShowAddModal(true)}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-base font-medium flex items-center gap-2 shadow"
    >
      <FaPlus className="text-white" /> Ajouter Produit
    </button>
  </div>
</div>


        {/* Cartes Produits */}
        {/* Affichage conditionnel selon viewMode */}
{viewMode === "grid" ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {currentProducts.map((prod) => (
      <div
        key={prod.id}
        onClick={() => setViewProduct(prod)}
        className="bg-white border shadow rounded-lg p-4 relative cursor-pointer hover:shadow-lg transition group"
      >
        {prod.images?.[0] && (
          <img
            src={`http://localhost:4000${prod.images[0]}`}
            alt={prod.nom}
            className="w-full h-40 object-cover rounded mb-2"
          />
        )}
        <h3 className="text-lg font-bold mb-1">{prod.nom}</h3>
        <p className="text-sm text-gray-500 mb-1">{prod.description}</p>
        <p className="text-sm">Catégorie: {prod.categorie?.nom}</p>
        <p className="text-sm">Unité: {prod.unite?.nom}</p>
        <p className="text-sm font-semibold text-indigo-700">
          {Number(prod.prix_unitaire_ttc).toFixed(2)} € TTC
        </p>

        <div
          className="absolute top-2 right-2 flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setSelectedProduct(prod);
              setShowEditModal(true);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => toggleProductStatus(prod.id, prod.isActive)}
            disabled={loadingToggleId === prod.id}
            className={`px-2 py-1 rounded text-sm text-white ${
              prod.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loadingToggleId === prod.id ? "..." : prod.isActive ? "✓" : "✕"}
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  // Mode liste ici ⬇️
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300 rounded-xl">
      <thead className="bg-indigo-100 text-indigo-800">
        <tr>
          <th className="py-2 px-4 text-left">Nom</th>
          <th className="py-2 px-4 text-left">Catégorie</th>
          <th className="py-2 px-4 text-left">Unité</th>
          <th className="py-2 px-4 text-left">Prix TTC (€)</th>
          <th className="py-2 px-4 text-left">TVA</th>
          <th className="py-2 px-4 text-center">Statut</th>
          <th className="py-2 px-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {currentProducts.map((prod) => (
          <tr
            key={prod.id}
            className="border-t hover:bg-gray-50 cursor-pointer"
            onClick={() => setViewProduct(prod)}
          >
            <td className="py-2 px-4">{prod.nom}</td>
            <td className="py-2 px-4">{prod.categorie?.nom}</td>
            <td className="py-2 px-4">{prod.unite?.nom}</td>
            <td className="py-2 px-4">
              {Number(prod.prix_unitaire_ttc).toFixed(2)} €
            </td>
            <td className="py-2 px-4">{prod.tva ?? "—"}</td>
            <td className="py-2 px-4 text-center">
              {prod.isActive ? (
                <span className="text-green-600 font-semibold">Actif</span>
              ) : (
                <span className="text-red-600 font-semibold">Inactif</span>
              )}
            </td>
            <td className="py-2 px-4 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setSelectedProduct(prod);
                    setShowEditModal(true);
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => toggleProductStatus(prod.id, prod.isActive)}
                  disabled={loadingToggleId === prod.id}
                  className={`px-2 py-1 rounded text-sm text-white ${
                    prod.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {loadingToggleId === prod.id ? "..." : prod.isActive ? "✓" : "✕"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}  

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* ➕ Modal Ajouter */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
<div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                }}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">
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

        {/* 👁️ Modal Visualisation */}
      {viewProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
      <button
        onClick={() => setViewProduct(null)}
        className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
      >
        <FaTimes size={20} />
      </button>

      {/* Titre + image */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">
          {viewProduct.nom}
        </h2>
        {viewProduct.images?.[0] && (
          <img
            src={`http://localhost:4000${viewProduct.images[0]}`}
            alt={viewProduct.nom}
            className="w-full h-52 object-cover rounded-xl border"
          />
        )}
      </div>

      {/* Détails produit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Description :</span><br />
            {viewProduct.description || "Non renseignée"}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Catégorie :</span><br />
            {viewProduct.categorie?.nom || "Non définie"}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Unité :</span><br />
            {viewProduct.unite?.nom || "Non définie"}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Colisage :</span><br />
            {viewProduct.colisage ?? "Non défini"}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Prix TTC :</span><br />
            <span className="text-indigo-700 font-bold">
              {Number(viewProduct.prix_unitaire_ttc).toFixed(2)} €
            </span>
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">TVA :</span><br />
            {viewProduct.tva != null ? `${viewProduct.tva} %` : "Non définie"}
          </p>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default Products;
