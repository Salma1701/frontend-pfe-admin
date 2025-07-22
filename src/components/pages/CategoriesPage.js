import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuPencil } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newNom, setNewNom] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showAddRow, setShowAddRow] = useState(false);
  const categoriesPerPage = 5;

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des catégories.");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Le nom de la catégorie est requis.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/categories",
        { nom: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Catégorie ajoutée !");
      setNewCategoryName("");
      setShowAddRow(false);
      fetchCategories();
    } catch (error) {
      toast.error("Erreur lors de l'ajout.");
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setNewNom(category.nom);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:4000/categories/${selectedCategory.id}`,
        { nom: newNom },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Catégorie mise à jour !");
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const handleToggleActive = async (category) => {
    try {
      await axios.put(
        `http://localhost:4000/categories/${category.id}`,
        { isActive: !category.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Catégorie ${!category.isActive ? "activée" : "désactivée"} !`);
      fetchCategories();
    } catch (error) {
      toast.error("Erreur lors du changement d'état.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.nom.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <ToastContainer />
      
      {/* Barre d'action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h2 className="text-3xl font-extrabold text-indigo-700">Gestion des Catégories</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddRow(!showAddRow)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            {showAddRow ? "Annuler" : "Ajouter"}
          </button>
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden min-h-[200px]">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="px-6 py-3 font-semibold">Nom</th>
              <th className="px-6 py-3 text-center font-semibold">Statut</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Ligne d'ajout */}
            {showAddRow && (
              <tr className="bg-blue-50 border-b">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    placeholder="Nom de la nouvelle catégorie"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-500 text-sm">Nouvelle</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handleAddCategory}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => {
                        setShowAddRow(false);
                        setNewCategoryName("");
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </td>
              </tr>
            )}
            
            {/* Catégories existantes */}
            {currentCategories.map((cat, idx) => (
              <tr
                key={cat.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 font-medium capitalize">{cat.nom}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      cat.isActive
                        ? "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200"
                        : "bg-red-100 text-red-700 border border-red-400 hover:bg-red-200"
                    }`}
                  >
                    {cat.isActive ? "Désactiver" : "Activer"}
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEditClick(cat)}
                    title="Modifier"
                    className="w-8 h-8 rounded-full border border-blue-400 flex items-center justify-center text-blue-600 hover:bg-blue-100 mx-auto"
                  >
                    <LuPencil className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t bg-gray-50">
        <div className="text-sm text-gray-600 mb-2 md:mb-0">
          {filteredCategories.length > 0 &&
            `${indexOfFirst + 1}–${Math.min(indexOfLast, filteredCategories.length)} sur ${
              filteredCategories.length
            } élément${filteredCategories.length > 1 ? "s" : ""}`}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 text-sm rounded ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-indigo-400`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Modal Modifier */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Modifier la Catégorie</h3>
            <input
              type="text"
              value={newNom}
              onChange={(e) => setNewNom(e.target.value)}
              className="w-full border rounded px-4 py-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={handleUpdate}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
