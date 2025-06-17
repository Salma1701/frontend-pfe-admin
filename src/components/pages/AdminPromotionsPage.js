// ✅ FRONTEND - AdminPromotionsPage.js (React avec Axios + Toast)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaToggleOn, FaToggleOff, FaPercent } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [editForm, setEditForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPromo, setNewPromo] = useState({
    titre: "",
    description: "",
    tauxReduction: 0,
    dateDebut: "",
    dateFin: "",
  });

  const token = localStorage.getItem("token");

  const fetchPromotions = async () => {
    try {
      const res = await axios.get("http://localhost:4000/promotions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromotions(res.data);
    } catch {
      toast.error("Erreur chargement promotions");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`http://localhost:4000/promotions/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Statut modifié");
      fetchPromotions();
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  };

  const handleEdit = (promo) => {
    setEditForm(promo);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const updatedPromo = {
        ...editForm,
        tauxReduction: parseFloat(editForm.tauxReduction),
        dateDebut: new Date(editForm.dateDebut).toISOString(),
        dateFin: new Date(editForm.dateFin).toISOString(),
      };
      await axios.post(`http://localhost:4000/promotions`, updatedPromo, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Promotion modifiée");
      setIsEditing(false);
      setEditForm(null);
      fetchPromotions();
    } catch {
      toast.error("Erreur modification promotion");
    }
  };

  const handleNewPromoChange = (e) => {
    setNewPromo({ ...newPromo, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...newPromo,
        tauxReduction: parseFloat(newPromo.tauxReduction),
        dateDebut: new Date(newPromo.dateDebut).toISOString(),
        dateFin: new Date(newPromo.dateFin).toISOString(),
      };

      await axios.post(`http://localhost:4000/promotions`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Promotion ajoutée");
      setNewPromo({
        titre: "",
        description: "",
        tauxReduction: 0,
        dateDebut: "",
        dateFin: "",
      });
      fetchPromotions();
    } catch (error) {
      toast.error("Erreur lors de la création de la promotion");
    }
  };

  useEffect(() => {
    if (!token) toast.error("Token manquant. Veuillez vous reconnecter.");
    else fetchPromotions();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center gap-3">
          <FaPercent className="text-indigo-500" /> Liste des Promotions
        </h2>

        {/* Formulaire d'ajout */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Nouvelle Promotion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="titre" value={newPromo.titre} onChange={handleNewPromoChange} placeholder="Titre" className="border p-2 rounded w-full" />
            <input name="tauxReduction" type="number" value={newPromo.tauxReduction} onChange={handleNewPromoChange} className="border p-2 rounded w-full" placeholder="Taux de réduction" />
            <input name="dateDebut" type="date" value={newPromo.dateDebut} onChange={handleNewPromoChange} className="border p-2 rounded w-full" />
            <input name="dateFin" type="date" value={newPromo.dateFin} onChange={handleNewPromoChange} className="border p-2 rounded w-full" />
            <textarea name="description" value={newPromo.description} onChange={handleNewPromoChange} placeholder="Description" className="border p-2 rounded w-full md:col-span-2" />
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-semibold shadow">
              Ajouter
            </button>
          </div>
        </div>

        {/* Liste des promotions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-indigo-50 text-indigo-800">
              <tr>
                <th className="px-6 py-3 font-semibold text-left">Titre</th>
                <th className="px-6 py-3 font-semibold text-left">Description</th>
                <th className="px-6 py-3 font-semibold text-left">Taux</th>
                <th className="px-6 py-3 font-semibold text-left">Début</th>
                <th className="px-6 py-3 font-semibold text-left">Fin</th>
                <th className="px-6 py-3 font-semibold text-center">Statut</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo, idx) => (
                <tr key={promo.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 font-medium capitalize">{promo.titre}</td>
                  <td className="px-6 py-4">{promo.description}</td>
                  <td className="px-6 py-4">{promo.tauxReduction}%</td>
                  <td className="px-6 py-4">{new Date(promo.dateDebut).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(promo.dateFin).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-medium ${promo.isActive ? "text-green-600" : "text-red-500"}`}>
                      {promo.isActive ? "✅ Active" : "❌ Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(promo)} className="text-gray-600 hover:text-gray-800" title="Modifier">
                      <LuPencil size={18} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(promo.id)}
                      className="text-gray-600 hover:text-gray-800"
                      title="Changer le statut"
                    >
                      {promo.isActive ? <FaToggleOff size={20} /> : <FaToggleOn size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isEditing && editForm && (
          <div className="mt-6 bg-white shadow-xl p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-4">Modifier Promotion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="titre" value={editForm.titre} onChange={handleChange} className="border p-2 rounded w-full" />
              <input name="tauxReduction" type="number" value={editForm.tauxReduction} onChange={handleChange} className="border p-2 rounded w-full" />
              <input name="dateDebut" type="date" value={editForm.dateDebut.split('T')[0]} onChange={handleChange} className="border p-2 rounded w-full" />
              <input name="dateFin" type="date" value={editForm.dateFin.split('T')[0]} onChange={handleChange} className="border p-2 rounded w-full" />
              <textarea name="description" value={editForm.description} onChange={handleChange} className="border p-2 rounded w-full md:col-span-2" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600">Annuler</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded">Enregistrer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromotionsPage;
