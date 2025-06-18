import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaToggleOn, FaToggleOff, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminObjectifsPage = () => {
  const [objectifs, setObjectifs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [commerciaux, setCommerciaux] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [progressData, setProgressData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);


  const [form, setForm] = useState({
    commercialId: "",
    dateDebut: "",
    dateFin: "",
    mission: "",
  });

 const [editForm, setEditForm] = useState({
    prime: "",
    pourcentageCible: "",
    mission: ""
  });
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
 const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    if (!form.dateDebut || !form.dateFin || !form.commercialId ) {
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
        };

        console.log("📦 Payload envoyé :", payload);

        await axios.post("http://localhost:4000/objectifs", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success("Objectifs créés !");
      setForm({ commercialId: "", dateDebut: "", dateFin: "", mission: ""});
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
      mission: obj.mission || "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingId(null);
  };

  const submitEdit = async () => {
    try {
      await axios.put(`http://localhost:4000/objectifs/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Objectif mis à jour !");
      closeEditModal();
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
      await axios.put(`http://localhost:4000/objectifs/${id}/status`, {}, {
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
            
      {/* Modal d'édition */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-indigo-700">Modifier l'objectif</h3>
              <button 
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Prime (€)
                </label>
                <input
                  type="number"
                  name="prime"
                  value={editForm.prime}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded shadow focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pourcentage cible (%)
                </label>
                <input
                  type="number"
                  name="pourcentageCible"
                  value={editForm.pourcentageCible}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded shadow focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mission
                </label>
                <textarea
                  name="mission"
                  value={editForm.mission}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded shadow focus:ring-2 focus:ring-indigo-300"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
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
          if (e.target.checked) {
            // Sélectionne uniquement cette catégorie, remplace les autres
            setSelectedCategories([cat.nom]);
          } else {
            // Si décochée, vider la sélection
            setSelectedCategories([]);
          }
        }}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
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
                  <p className="font-bold">
                    {obj.commercial?.nom} {obj.commercial?.prenom} 
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${obj.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {obj.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </p>
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
