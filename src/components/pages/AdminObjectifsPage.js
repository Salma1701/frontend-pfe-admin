import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminObjectifsPage = () => {
  const [objectifs, setObjectifs] = useState([]);
  const [form, setForm] = useState({
    commercialId: "",
    dateDebut: "",
    dateFin: "",
    montantCible: "",
    categorieProduit: "",
    prime: "",
    mission: "",
    bonus: ""
  });
  const [commerciaux, setCommerciaux] = useState([]);
  const token = localStorage.getItem("token");

  const fetchObjectifs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/objectifs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setObjectifs(res.data);
    } catch {
      toast.error("Échec du chargement des objectifs.");
    }
  };

  const fetchCommerciaux = async () => {
    try {
      const res = await axios.get("http://localhost:4000/users?role=commercial", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommerciaux(res.data);
    } catch {
      toast.error("Échec du chargement des commerciaux.");
    }
  };

  useEffect(() => {
    fetchObjectifs();
    fetchCommerciaux();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.dateDebut || !form.dateFin || !form.montantCible) {
      return toast.error("Veuillez remplir les champs obligatoires : dates et montant.");
    }

    const cleanedForm = {
        ...form,
        commercialId: Number(form.commercialId),
        dateDebut: form.dateDebut || null,
        dateFin: form.dateFin || null,
        montantCible: parseFloat(form.montantCible),
        prime: parseFloat(form.prime),
        bonus: form.bonus ? parseFloat(form.bonus) : null,
      };

    try {
      await axios.post("http://localhost:4000/objectifs", cleanedForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Objectif ajouté avec succès !");
      setForm({ commercialId: "", dateDebut: "", dateFin: "", montantCible: "", categorieProduit: "", prime: "", mission: "", bonus: "" });
      fetchObjectifs();
    } catch {
      toast.error("Erreur lors de l'enregistrement de l'objectif.");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/objectifs/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchObjectifs();
    } catch {
      toast.error("Impossible de modifier le statut de l'objectif.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6">Suivi des Objectifs Commerciaux</h2>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-2xl font-semibold mb-4">Définir un nouvel objectif</h3>
        <div className="grid grid-cols-2 gap-4">
          <select name="commercialId" value={form.commercialId} onChange={handleChange} className="border p-2 rounded">
            <option value="">Sélectionner un commercial</option>
            {commerciaux.map(c => (
              <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
            ))}
          </select>
          <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange} className="border p-2 rounded" />
          <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange} className="border p-2 rounded" />
          <input type="number" name="montantCible" value={form.montantCible} onChange={handleChange} placeholder="Objectif en €" className="border p-2 rounded" />
          <input name="categorieProduit" value={form.categorieProduit} onChange={handleChange} placeholder="Catégorie produit (facultatif)" className="border p-2 rounded" />
          <input type="number" name="prime" value={form.prime} onChange={handleChange} placeholder="Prime associée (€)" className="border p-2 rounded" />
          <input name="mission" value={form.mission} onChange={handleChange} placeholder="Mission spéciale (ex: 10 ventes)" className="border p-2 rounded" />
          <input name="bonus" value={form.bonus} onChange={handleChange} placeholder="Bonus personnalisé (€)" className="border p-2 rounded" />
        </div>
        <button onClick={handleSubmit} className="mt-5 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          Valider l'objectif
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-2xl font-semibold mb-4">Objectifs définis</h3>
        {objectifs.length === 0 ? (
          <p className="text-gray-500">Aucun objectif défini pour le moment.</p>
        ) : (
          <div className="divide-y">
            {objectifs.map(obj => (
              <div key={obj.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{obj.commercial?.nom} {obj.commercial?.prenom}</p>
                  <p className="text-sm">Cible : <span className="font-medium">{obj.montantCible} €</span> | Catégorie : {obj.categorieProduit || 'Toutes'}</p>
                  <p className="text-sm">Prime prévue : <span className="font-medium">{obj.prime} €</span></p>
                  {obj.mission && <p className="text-sm">Mission : {obj.mission}</p>}
                  {obj.bonus && <p className="text-sm">Bonus individuel : <span className="font-medium">{obj.bonus} €</span></p>}
                  <p className="text-xs text-gray-500">Période : {obj.dateDebut.slice(0, 10)} → {obj.dateFin.slice(0, 10)}</p>
                </div>
                <button onClick={() => toggleStatus(obj.id)}>
                  {obj.isActive ? <FaToggleOn className="text-green-500" size={20} /> : <FaToggleOff className="text-gray-400" size={20} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminObjectifsPage;
