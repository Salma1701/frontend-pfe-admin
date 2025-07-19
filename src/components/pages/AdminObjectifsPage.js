import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminObjectifsPage = () => {
  const [commercials, setCommercials] = useState([]);
  const [objectifs, setObjectifs] = useState([]);
  const [filtrerGlobaux, setFiltrerGlobaux] = useState(false);
  const [form, setForm] = useState({
    commercialId: "",
    dateDebut: new Date().toISOString().slice(0, 10),
    dateFin: new Date().toISOString().slice(0, 10),
    montantCible: "",
    prime: "",
    mission: "",
  });
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // Nombre d'objectifs par page

const getPaginatedObjectifs = () => {
  const filtered = objectifs.filter((obj) => (filtrerGlobaux ? !obj.commercial : true));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filtered.slice(startIndex, endIndex);
};

const totalPages = Math.ceil(
  objectifs.filter((obj) => (filtrerGlobaux ? !obj.commercial : true)).length / itemsPerPage
);

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};
  const API_BASE = "http://localhost:4000";
  const token = localStorage.getItem("token");
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchCommercials = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users?role=commercial`, headers);
      setCommercials(res.data);
    } catch (err) {
      alert("Erreur chargement commerciaux : " + err.response?.data?.message);
    }
  };

  const fetchObjectifs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/objectifs`, headers);
      setObjectifs(res.data);
    } catch (err) {
      alert("Erreur chargement objectifs : " + err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchCommercials();
    fetchObjectifs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["montantCible", "prime"];
    setForm({
      ...form,
      [name]: numericFields.includes(name)
        ? value === "" ? "" : Number(value)
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/objectifs`, form, headers);
      fetchObjectifs();
      alert("✅ Objectif ajouté !");
    } catch (err) {
      alert("Erreur ajout objectif : " + err.response?.data?.message);
    }
  };

  const handleGlobalSubmit = async () => {
    try {
      if (form.commercialId) {
        alert("❌ Ne sélectionne pas de commercial pour un objectif global !");
        return;
      }

      const payload = {
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
        montantCible: Number(form.montantCible),
        prime: Number(form.prime),
        mission: form.mission || undefined,
      };

      const res = await fetch(`${API_BASE}/objectifs/global`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur inconnue");
      }

      await fetchObjectifs();
      alert("✅ Objectif global ajouté !");
    } catch (err) {
      alert("❌ Erreur ajout objectif global : " + err.message);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`${API_BASE}/objectifs/${id}/status`, {}, headers);
      fetchObjectifs();
    } catch (err) {
      alert("Erreur changement de statut : " + err.response?.data?.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Ajouter Objectif Commercial</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Commercial :</label>
          <select
            name="commercialId"
            value={form.commercialId}
            onChange={handleChange}
            className="w-full mt-1 border rounded px-3 py-2"
          >
            <option value="">-- Choisir --</option>
            {commercials.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom} {c.prenom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Date début :</label>
          <input
            type="date"
            name="dateDebut"
            value={form.dateDebut}
            onChange={handleChange}
            className="w-full mt-1 border rounded px-3 py-2"
            min="2024-01-01"
            max="2030-12-31"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date fin :</label>
          <input
            type="date"
            name="dateFin"
            value={form.dateFin}
            onChange={handleChange}
            className="w-full mt-1 border rounded px-3 py-2"
            min={form.dateDebut}
            max="2030-12-31"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Montant Cible (€):</label>
          <input
            type="number"
            name="montantCible"
            value={form.montantCible}
            onChange={handleChange}
            required
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Prime (€):</label>
          <input
            type="number"
            name="prime"
            value={form.prime}
            onChange={handleChange}
            required
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Mission (optionnel):</label>
          <input
            type="text"
            name="mission"
            value={form.mission}
            onChange={handleChange}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Ajouter
          </button>
          <button
            type="button"
            onClick={handleGlobalSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Objectif Global
          </button>
        </div>
      </form>

      <hr className="my-8" />
      <h3 className="text-xl font-semibold mb-4">📋 Liste des Objectifs</h3>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={filtrerGlobaux}
            onChange={(e) => setFiltrerGlobaux(e.target.checked)}
          />
          <span className="ml-2 text-sm text-gray-700">Afficher uniquement les objectifs globaux</span>
        </label>
      </div>

      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-indigo-100 text-indigo-800">
            <th className="border p-2">Commercial</th>
            <th className="border p-2">Cible (€)</th>
            <th className="border p-2">Prime (€)</th>
            <th className="border p-2">Période</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedObjectifs().map((obj) => (
  <tr key={obj.id} className="text-center">
    <td className="border p-2">
      {obj.commercial ? (
        <span className="text-gray-800">
          {obj.commercial.nom} {obj.commercial.prenom}
        </span>
      ) : (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
          Objectif Global
        </span>
      )}
    </td>
    <td className="border p-2">{obj.montantCible}</td>
    <td className="border p-2">{obj.prime}</td>
    <td className="border p-2">
      {new Date(obj.dateDebut).toLocaleDateString()} -{" "}
      {new Date(obj.dateFin).toLocaleDateString()}
    </td>
    <td className="border p-2">{obj.isActive ? "✅" : "❌"}</td>
    <td className="border p-2 flex justify-center gap-2">
      <button
        onClick={() => handleToggleStatus(obj.id)}
        className="text-yellow-600 hover:text-yellow-800"
      >
        🔄
      </button>
    </td>
  </tr>
))}
        </tbody>
      </table>
     <div className="flex justify-between items-center mt-4 px-1 text-sm text-gray-700">
  {/* Message à gauche */}
  <div>
    {objectifs.length > 0 && (
      <>
        {(currentPage - 1) * itemsPerPage + 1} –{" "}
        {Math.min(currentPage * itemsPerPage, objectifs.filter((obj) => (filtrerGlobaux ? !obj.commercial : true)).length)}{" "}
        sur {objectifs.filter((obj) => (filtrerGlobaux ? !obj.commercial : true)).length} éléments
      </>
    )}
  </div>

  {/* Pagination à droite */}
  <div className="flex items-center space-x-1">
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
    >
      Précédent
    </button>
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => goToPage(i + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === i + 1
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
    >
      Suivant
    </button>
  </div>
</div>

    </div>
  );
};

export default AdminObjectifsPage;
