import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminPromotionsPage = () => {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    tauxReduction: 0,
    dateDebut: "",
    dateFin: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");

  const fetchPromos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/promotions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPromos(res.data);
    } catch (err) {
      toast.error("Erreur chargement des promotions");
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.patch(`http://localhost:4000/promotions/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Promotion modifiée !");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:4000/promotions", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Promotion ajoutée !");
      }
      setForm({ titre: "", description: "", tauxReduction: 0, dateDebut: "", dateFin: "" });
      fetchPromos();
    } catch {
      toast.error("Erreur ajout/modification promotion");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/promotions/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPromos();
    } catch {
      toast.error("Erreur changement de statut");
    }
  };

  const handleEdit = (promo) => {
    setEditingId(promo.id);
    setForm({
      titre: promo.titre,
      description: promo.description,
      tauxReduction: promo.tauxReduction,
      dateDebut: promo.dateDebut.split("T")[0],
      dateFin: promo.dateFin.split("T")[0]
    });
  };

  const filteredPromos = promos.filter(p => {
    if (filter === "active") return p.isActive;
    if (filter === "inactive") return !p.isActive;
    return true;
  });

  return (
    <div className="p-6 text-gray-800 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6">Gestion des Promotions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold mb-4">{editingId ? "Modifier" : "Nouvelle"} Promotion</h3>
          <div className="space-y-3">
            <input name="titre" value={form.titre} onChange={handleChange} placeholder="Titre" className="input w-full border p-2 rounded" />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input w-full border p-2 rounded" />
            <input type="number" name="tauxReduction" value={form.tauxReduction} onChange={handleChange} placeholder="Taux de réduction (%)" className="input w-full border p-2 rounded" />
            <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange} className="input w-full border p-2 rounded" />
            <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange} className="input w-full border p-2 rounded" />
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {editingId ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Liste des promotions</h3>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-1 rounded">
              <option value="all">Toutes</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </select>
          </div>

          <div className="divide-y">
            {filteredPromos.map(p => (
              <div key={p.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{p.titre}</p>
                  <p className="text-sm text-gray-500">{p.description}</p>
                  <p className="text-sm">Réduction : {p.tauxReduction}%</p>
                  <p className="text-xs text-gray-400">Du {p.dateDebut.slice(0,10)} au {p.dateFin.slice(0,10)}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  <button onClick={() => toggleStatus(p.id)}>
                    {p.isActive ? <FaToggleOn className="text-green-500" size={20} /> : <FaToggleOff className="text-gray-400" size={20} />}
                  </button>
                </div>
              </div>
            ))}
            {filteredPromos.length === 0 && <p className="text-sm text-gray-400">Aucune promotion à afficher.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPromotionsPage;
