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

  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-6">
      <ToastContainer />
      {/* Ajout Catégorie */}
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Nom de la nouvelle catégorie"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm"
        />
        <button
          onClick={handleAddCategory}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="px-6 py-4 text-left text-base font-semibold">Nom</th>
              <th className="px-6 py-4 text-center text-base font-semibold">Active</th>
             <th className="w-[120px] px-6 py-4 text-center text-base font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat, idx) => (
              <tr
                key={cat.id}
                className={`transition-all duration-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-indigo-50`}
              >
                <td className="px-6 py-4 capitalize font-medium">{cat.nom}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`px-3 py-1 text-sm rounded-full font-semibold border 
                    ${
                      cat.isActive
                        ? "text-green-600 border-green-400 bg-green-100"
                        : "text-gray-500 border-gray-300 bg-gray-100"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
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

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600 mb-2 md:mb-0">
            {categories.length > 0 &&
              `${indexOfFirst + 1}–${Math.min(indexOfLast, categories.length)} sur ${
                categories.length
              } élément${categories.length > 1 ? "s" : ""}`}
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
