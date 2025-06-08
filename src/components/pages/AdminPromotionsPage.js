// ✅ FRONTEND - AdminPromotionsPage.js (React avec Axios + Toast)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaToggleOn, FaToggleOff, FaPercent } from "react-icons/fa";
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
      await axios.patch(`http://localhost:4000/promotions/${id}/status`, {}, {
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
    console.error("Erreur lors de la création de la promotion :", error.response?.data || error.message);
    toast.error("Erreur lors de la création de la promotion");
  }
};


  useEffect(() => {
    if (!token) toast.error("Token manquant. Veuillez vous reconnecter.");
    else fetchPromotions();
  }, []);

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
        <FaPercent /> Liste des Promotions
      </h2>

      <div className="mb-6 bg-white shadow p-4 rounded">
        <h3 className="font-semibold text-lg mb-2">Nouvelle Promotion</h3>
        <input name="titre" value={newPromo.titre} onChange={handleNewPromoChange} placeholder="Titre" className="border p-2 mb-2 w-full" />
        <textarea name="description" value={newPromo.description} onChange={handleNewPromoChange} placeholder="Description" className="border p-2 mb-2 w-full" />
        <input name="tauxReduction" type="number" value={newPromo.tauxReduction} onChange={handleNewPromoChange} className="border p-2 mb-2 w-full" placeholder="Taux de réduction" />
        <input name="dateDebut" type="date" value={newPromo.dateDebut} onChange={handleNewPromoChange} className="border p-2 mb-2 w-full" />
        <input name="dateFin" type="date" value={newPromo.dateFin} onChange={handleNewPromoChange} className="border p-2 mb-2 w-full" />
        <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Ajouter</button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Titre</th>
            <th className="p-2">Description</th>
            <th className="p-2">Taux</th>
            <th className="p-2">Début</th>
            <th className="p-2">Fin</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promo) => (
            <tr key={promo.id} className="border-t">
              <td className="p-2">{promo.titre}</td>
              <td className="p-2">{promo.description}</td>
              <td className="p-2">{promo.tauxReduction}%</td>
              <td className="p-2">{new Date(promo.dateDebut).toLocaleDateString()}</td>
              <td className="p-2">{new Date(promo.dateFin).toLocaleDateString()}</td>
              <td className="p-2">
                {promo.isActive ? (
                  <span className="text-green-600 font-semibold">Actif</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactif</span>
                )}
              </td>
              <td className="p-2 flex gap-2">
                <button onClick={() => handleEdit(promo)} className="text-indigo-600 hover:text-indigo-800">
                  <FaEdit />
                </button>
                <button onClick={() => handleToggleStatus(promo.id)} className={promo.isActive ? "text-red-600" : "text-green-600"}>
                  {promo.isActive ? <FaToggleOff /> : <FaToggleOn />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && editForm && (
        <div className="mt-6 bg-white shadow p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">Modifier Promotion</h3>
          <input name="titre" value={editForm.titre} onChange={handleChange} className="border p-2 mb-2 w-full" />
          <textarea name="description" value={editForm.description} onChange={handleChange} className="border p-2 mb-2 w-full" />
          <input name="tauxReduction" type="number" value={editForm.tauxReduction} onChange={handleChange} className="border p-2 mb-2 w-full" />
          <input name="dateDebut" type="date" value={editForm.dateDebut.split('T')[0]} onChange={handleChange} className="border p-2 mb-2 w-full" />
          <input name="dateFin" type="date" value={editForm.dateFin.split('T')[0]} onChange={handleChange} className="border p-2 mb-2 w-full" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600">Annuler</button>
            <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded">Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotionsPage;