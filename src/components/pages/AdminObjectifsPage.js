import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminObjectifsPage = () => {
  const [objectifs, setObjectifs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [commerciaux, setCommerciaux] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [progressData, setProgressData] = useState([]);

  const [form, setForm] = useState({
    commercialId: "",
    dateDebut: "",
    dateFin: "",
    mission: "",
    montantCible: "",
  });

  const [editForm, setEditForm] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([
      fetchObjectifs(),
      fetchCommerciaux(),
      fetchCategories(),
      fetchProgress(),
    ]);
  };

  const fetchObjectifs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/objectifs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setObjectifs(res.data);
    } catch {
      toast.error("Échec chargement objectifs.");
    }
  };

  const fetchCommerciaux = async () => {
    try {
      const res = await axios.get("http://localhost:4000/users?role=commercial", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommerciaux(res.data);
    } catch {
      toast.error("Échec chargement commerciaux.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch {
      toast.error("Échec chargement catégories.");
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await axios.get("http://localhost:4000/objectifs/admin/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgressData(res.data);
    } catch {
      toast.error("Erreur chargement avancement.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.dateDebut || !form.dateFin || !form.commercialId || !form.montantCible) {
      return toast.error("Champs obligatoires manquants.");
    }

    try {
      for (const cat of selectedCategories) {
        const rawPourcentage = parseFloat(form[`pourcentage_${cat}`]);
        const rawPrime = parseFloat(form[`prime_${cat}`]);

        const payload = {
          commercialId: Number(form.commercialId),
          dateDebut: form.dateDebut,
          dateFin: form.dateFin,
          prime: isNaN(rawPrime) ? 0 : rawPrime,
          pourcentageCible: isNaN(rawPourcentage) ? undefined : rawPourcentage,
          categorieProduit: cat,
          mission: form.mission || undefined,
          montantCible: parseFloat(form.montantCible),
        };

        console.log("📦 Payload envoyé :", payload);

        await axios.post("http://localhost:4000/objectifs", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success("Objectifs créés !");
      setForm({ commercialId: "", dateDebut: "", dateFin: "", mission: "", montantCible: "" });
      setSelectedCategories([]);
      fetchAll();
    } catch (error) {
      toast.error("Erreur lors de la création des objectifs.");
      console.error("❌ Détails erreur :", error.response?.data || error.message);
    }
  };

  const handleEditClick = (obj) => {
    setEditingId(obj.id);
    setEditForm({
      prime: obj.prime,
      pourcentageCible: obj.pourcentageCible,
      mission: obj.mission,
    });
  };

  const submitEdit = async () => {
    try {
      await axios.put(`http://localhost:4000/objectifs/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Objectif mis à jour !");
      setEditingId(null);
      fetchAll();
    } catch {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`http://localhost:4000/objectifs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Supprimé !");
      fetchAll();
    } catch {
      toast.error("Erreur suppression.");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/objectifs/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
    } catch {
      toast.error("Erreur modification statut.");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter] text-gray-800">
      <ToastContainer />
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
          Gestion des Objectifs Commerciaux
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select name="commercialId" value={form.commercialId} onChange={handleChange} className="border px-4 py-2 rounded shadow">
            <option value="">Sélectionner un commercial</option>
            {commerciaux.map(c => (
              <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
            ))}
          </select>
          <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange} className="border px-4 py-2 rounded shadow" />
          <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange} className="border px-4 py-2 rounded shadow" />
          <input name="mission" value={form.mission} onChange={handleChange} placeholder="Mission" className="border px-4 py-2 rounded shadow" />
          <input type="number" name="montantCible" value={form.montantCible} onChange={handleChange} placeholder="Montant cible (€)" className="border px-4 py-2 rounded shadow" />
        </div>

        <h3 className="text-lg font-semibold mt-4 mb-2">Catégories Produits</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={cat.nom}
                checked={selectedCategories.includes(cat.nom)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...selectedCategories, cat.nom]
                    : selectedCategories.filter((c) => c !== cat.nom);
                  setSelectedCategories(updated);
                }}
              />
              {cat.nom}
            </label>
          ))}
        </div>

        {selectedCategories.map((catNom) => (
          <div key={catNom} className="mt-4 border p-4 rounded bg-gray-50 shadow">
            <h4 className="font-bold mb-2">Catégorie : {catNom}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="number" placeholder="Pourcentage cible (%)" className="border p-2 rounded"
                onChange={(e) => setForm(prev => ({ ...prev, [`pourcentage_${catNom}`]: e.target.value }))} />
              <input type="number" placeholder="Prime (€)" className="border p-2 rounded"
                onChange={(e) => setForm(prev => ({ ...prev, [`prime_${catNom}`]: e.target.value }))} />
            </div>
          </div>
        ))}

        <button onClick={handleSubmit} className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700">
          Valider tous les objectifs
        </button>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Objectifs Enregistrés</h3>
          {objectifs.map(obj => (
            <div key={obj.id} className="py-4 border-b flex justify-between items-center">
              <div>
                <p><strong>{obj.commercial?.nom} {obj.commercial?.prenom}</strong></p>
                <p>Prime : {obj.prime} €</p>
                {obj.pourcentageCible && <p>Objectif : {obj.pourcentageCible}%</p>}
                {obj.mission && <p>Mission : {obj.mission}</p>}
                <p className="text-xs text-gray-500">
                  Période : {obj.dateDebut?.slice(0, 10)} → {obj.dateFin?.slice(0, 10)}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <button onClick={() => toggleStatus(obj.id)}>
                  {obj.isActive ? <FaToggleOn className="text-green-500" size={22} /> : <FaToggleOff className="text-gray-400" size={22} />}
                </button>
                <button onClick={() => handleEditClick(obj)} className="text-blue-600 underline">Modifier</button>
                <button onClick={() => handleDelete(obj.id)} className="text-red-500 underline">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminObjectifsPage;
