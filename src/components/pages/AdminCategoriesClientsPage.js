import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { LuPencil } from "react-icons/lu";
import { Dialog } from "@headlessui/react";

const AdminCategoriesClientsPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [editCatName, setEditCatName] = useState("");
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categorie-client");
      setCategories(res.data);
    } catch {
      toast.error("Erreur lors du chargement des catégories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    try {
      await axios.post("/categorie-client", { nom: newCat });
      toast.success("Catégorie ajoutée !");
      setNewCat("");
      fetchCategories();
    } catch (err) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const openEditModal = (cat) => {
    setSelectedCat(cat);
    setEditCatName(cat.nom);
    setEditModalOpen(true);
  };

  const submitEdit = async () => {
    try {
      await axios.put(`/categorie-client/${selectedCat.id}`, { nom: editCatName });
      setEditModalOpen(false);
      fetchCategories();
      toast.success("Catégorie modifiée !");
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `/categorie-client/${id}/status`,
        { isActive: !currentStatus },
        { headers: { 'Content-Type': 'application/json' } }
      );
      fetchCategories();
      toast.success(`Catégorie ${!currentStatus ? "activée" : "désactivée"}`);
    } catch (err) {
      console.error("Erreur PUT statut catégorie:", err?.response?.data || err);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">Gestion des catégories clients</h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center w-full md:w-auto gap-3">
            <input
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              placeholder="Nouvelle catégorie"
              className="border rounded px-3 py-2 w-full max-w-xs"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700" onClick={addCategory}>
              Ajouter
            </button>
          </div>

          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 shadow-sm w-full md:w-auto max-w-xs md:ml-auto gap-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une catégorie..."
              className="bg-transparent outline-none flex-1 text-gray-700"
            />
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow mb-4">
          <table className="min-w-full bg-white rounded-lg text-sm">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="px-6 py-3 text-left rounded-tl-lg">Nom</th>
                <th className="px-6 py-3 text-center rounded-tr-lg">Statut & Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-6 text-gray-400">Aucune catégorie trouvée.</td>
                </tr>
              ) : (
                filteredCategories.map(cat => (
                  <tr key={cat.id} className="border-b last:border-b-0 hover:bg-indigo-50 transition">
                    <td className="px-6 py-3 font-medium">{cat.nom}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                            cat.isActive
                              ? 'bg-green-100 text-green-700 border border-green-400'
                              : 'bg-red-100 text-red-700 border border-red-400'
                          }`}
                          onClick={() => toggleStatus(cat.id, cat.isActive)}
                        >
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          className="w-8 h-8 rounded-full border border-blue-400 flex items-center justify-center text-blue-600 hover:bg-blue-100"
                          onClick={() => openEditModal(cat)}
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
              <Dialog.Title className="text-lg font-bold">Modifier Catégorie</Dialog.Title>
              <input
                value={editCatName}
                onChange={e => setEditCatName(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-4 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setEditModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={submitEdit}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminCategoriesClientsPage;