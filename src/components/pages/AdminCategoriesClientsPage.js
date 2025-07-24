import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { LuPencil } from "react-icons/lu";
import Modal from "../Modal";
import { SecondaryButton, PrimaryButton } from "../ModalButton";

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
      await axios.post("/categorie-client", { nom: newCat, isActive: true });
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
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">Gestion des catégories clients</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto gap-3">
          <input
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            placeholder="Nouvelle catégorie"
            className="border rounded px-4 py-2 w-full max-w-xs"
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
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">
                  Aucune catégorie trouvée.
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat, idx) => (
                <tr
                  key={cat.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 font-medium capitalize">{cat.nom}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        cat.isActive
                          ? 'bg-green-100 text-green-700 border border-green-400 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 border border-red-400 hover:bg-red-200' 
                      }`}
                      onClick={() => toggleStatus(cat.id, cat.isActive)}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="w-8 h-8 rounded-full border border-blue-400 flex items-center justify-center text-blue-600 hover:bg-blue-100 mx-auto"
                      onClick={() => openEditModal(cat)}
                      title="Modifier"
                    >
                      <LuPencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Modifier Catégorie"
        subtitle="Mettez à jour le nom de la catégorie"
        icon={LuPencil}
        maxWidth="max-w-sm"
        footer={
          <>
            <SecondaryButton onClick={() => setEditModalOpen(false)}>
              Annuler
            </SecondaryButton>
            <PrimaryButton onClick={submitEdit}>
              Enregistrer
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Nom de la catégorie *
            </label>
            <input
              value={editCatName}
              onChange={e => setEditCatName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
              placeholder="Entrez le nom de la catégorie"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategoriesClientsPage;