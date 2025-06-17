import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTags } from "react-icons/fa";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newNom, setNewNom] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

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

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      try {
        await axios.delete(`http://localhost:4000/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Catégorie supprimée avec succès !");
        fetchCategories();
      } catch (error) {
        toast.error("Erreur lors de la suppression.");
      }
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Catégorie mise à jour !");
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center gap-3">
          <FaTags className="text-indigo-500" /> Liste des Catégories
        </h2>

        {/* ➕ Ajouter une catégorie */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">➕ Ajouter une nouvelle catégorie</h3>
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
    <input
      type="text"
      placeholder="Nom de la nouvelle catégorie"
      value={newCategoryName}
      onChange={(e) => setNewCategoryName(e.target.value)}
      className="border border-gray-300 px-4 py-2 rounded w-full sm:w-2/3"
    />
    <button
      onClick={handleAddCategory}
      className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
    >
      Ajouter
    </button>
  </div>
</div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Aucune catégorie trouvée.</p>
          ) : (
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-indigo-50 text-indigo-800">
                <tr>
                  <th className="px-6 py-3 font-semibold text-left">Nom</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-medium capitalize">{cat.nom}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                        onClick={() => handleEditClick(cat)}
                      >
                        <LuPencil />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <LuTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL MODIFIER */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
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
