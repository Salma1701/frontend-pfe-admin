import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTags, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/categories", headers);
      setCategories(res.data);
    } catch (err) {
      console.error("Erreur chargement catégories :", err);
      toast.error("Erreur lors du chargement des catégories.");
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await axios.post("http://localhost:4000/categories", { nom: newCategory }, headers);
      setNewCategory("");
      fetchCategories();
      toast.success("Catégorie ajoutée avec succès !");
    } catch (err) {
      console.error("Erreur ajout catégorie :", err);
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout de la catégorie.");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;

    try {
      await axios.delete(`http://localhost:4000/categories/${id}`, headers);
      fetchCategories();
      toast.success("Catégorie supprimée !");
    } catch (err) {
      console.error("Erreur suppression catégorie :", err);
      toast.error(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  const updateCategory = async (id) => {
    if (!editName.trim()) return;

    try {
      await axios.patch(`http://localhost:4000/categories/${id}`, { nom: editName }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setEditId(null);
      setEditName("");
      fetchCategories();
      toast.success("Catégorie mise à jour !");
    } catch (err) {
      console.error("Erreur mise à jour catégorie :", err);
      toast.error(err.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <ToastContainer position="top-right" />

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
        <FaTags />
        Gestion des Catégories
      </h2>

      {/* Formulaire ajout catégorie */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Nom de la catégorie (ex: Fruits)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-3 rounded w-full shadow focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        />
        <button
          onClick={addCategory}
          disabled={!newCategory.trim()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus />
          Ajouter
        </button>
      </div>

      {/* Liste des catégories */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center">Aucune catégorie trouvée.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between py-4">
                {editId === cat.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  />
                ) : (
                  <span className="text-gray-700 font-medium">{cat.nom}</span>
                )}

                <div className="flex gap-2">
                  {editId === cat.id ? (
                    <>
                      <button
                        onClick={() => updateCategory(cat.id)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition"
                        title="Sauvegarder"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => {
                          setEditId(null);
                          setEditName("");
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded transition"
                        title="Annuler"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(cat.id);
                          setEditName(cat.nom);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
