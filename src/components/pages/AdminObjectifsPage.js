import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuPencil } from "react-icons/lu";
// Ajout du state pour l'édition

const AdminObjectifsPage = () => {
  const [editForm, setEditForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [commercials, setCommercials] = useState([]);
  const [objectifs, setObjectifs] = useState([]);
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
const [filtreAtteint, setFiltreAtteint] = useState(false);
// N'afficher que les objectifs commerciaux (pas globaux)
const objectifsCommerciaux = objectifs.filter((obj) => obj.commercial);
const objectifsFiltres = objectifsCommerciaux.filter((obj) => {
  if (!filtreAtteint) return true;
  
  // Vérifier si l'objectif est atteint
  const montantRealise = obj.montantRealise || 0;
  const pourcentage = obj.montantCible > 0 ? (montantRealise / obj.montantCible) * 100 : 0;
  const isAtteint = obj.isAtteint !== undefined ? obj.isAtteint : pourcentage >= 100;
  
  return isAtteint;
});
const getPaginatedObjectifs = () => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return objectifsFiltres.slice(startIndex, endIndex);
};
const totalPages = Math.ceil(objectifsFiltres.length / itemsPerPage);

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
      console.log('🔍 fetchObjectifs appelé');
      const res = await axios.get(`${API_BASE}/objectifs`, headers);
      console.log('📊 Réponse du backend:', res.data);
      
      // Log détaillé de chaque objectif
      res.data.forEach((obj, index) => {
        console.log(`📋 Objectif ${index + 1}:`, {
          id: obj.id,
          commercial: obj.commercial ? `${obj.commercial.nom} ${obj.commercial.prenom}` : 'Global',
          mission: obj.mission,
          montantCible: obj.montantCible,
          montantRealise: obj.montantRealise,
          isAtteint: obj.isAtteint,
          atteint: obj.atteint
        });
      });
      
      setObjectifs(res.data);
    } catch (err) {
      console.error('❌ Erreur fetchObjectifs:', err);
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

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`${API_BASE}/objectifs/${id}/status`, {}, headers);
      fetchObjectifs();
    } catch (err) {
      alert("Erreur changement de statut : " + err.response?.data?.message);
    }
  };

  const handleEdit = (obj) => {
    setEditForm({ ...obj });
    setIsEditing(true);
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
        </div>
      </form>

      <hr className="my-8" />
      
      {/* Statistiques des objectifs */}
      
      
      <h3 className="text-xl font-semibold mb-4">📋 Liste des Objectifs</h3>
      {/* Filtre objectifs atteints */}
      <div className="mb-4 flex items-center gap-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={filtreAtteint}
            onChange={(e) => setFiltreAtteint(e.target.checked)}
          />
          <span className="ml-2 text-sm text-gray-700">Afficher uniquement les objectifs atteints</span>
        </label>
      </div>

      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-indigo-100 text-indigo-800">
            <th className="border p-2">Commercial</th>
            <th className="border p-2">Cible (€)</th>
            <th className="border p-2">Réalisé (€)</th>
            <th className="border p-2">Progression</th>
            <th className="border p-2">Prime (€)</th>
            <th className="border p-2">Période</th>
            <th className="border p-2">Mission</th>
            <th className="border p-2">Atteint</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedObjectifs().map((obj) => (
  <tr key={obj.id} className="text-center">
    <td className="border p-2">
      {obj.commercial ? (
        <div className="flex items-center space-x-2">
          <span className="text-gray-800">
            {obj.commercial.nom} {obj.commercial.prenom}
          </span>
          {(() => {
            const montantRealise = obj.montantRealise || 0;
            const pourcentage = obj.montantCible > 0 ? (montantRealise / obj.montantCible) * 100 : 0;
            
            if (pourcentage >= 100) {
              return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                   Atteint
                </span>
              );
            } else if (pourcentage >= 80) {
              return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  ⚡ Proche
                </span>
              );
            }
            return null;
          })()}
        </div>
      ) : (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
          Objectif Global
        </span>
      )}
    </td>
    <td className="border p-2">{obj.montantCible.toLocaleString()} €</td>
    <td className="border p-2">
      {obj.montantRealise !== undefined ? `${obj.montantRealise.toLocaleString()} €` : '0 €'}
    </td>
    <td className="border p-2">
      {(() => {
        const montantRealise = obj.montantRealise || 0;
        const pourcentage = obj.montantCible > 0 ? (montantRealise / obj.montantCible) * 100 : 0;
        const isAtteint = pourcentage >= 100;
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isAtteint ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(pourcentage, 100)}%` }}
              ></div>
            </div>
            <span className={`text-xs font-semibold ${
              isAtteint ? 'text-green-600' : 'text-blue-600'
            }`}>
              {pourcentage.toFixed(0)}%
            </span>
          </div>
        );
      })()}
    </td>
    <td className="border p-2">{obj.prime.toLocaleString()} €</td>
    <td className="border p-2">
      {new Date(obj.dateDebut).toLocaleDateString()} -{" "}
      {new Date(obj.dateFin).toLocaleDateString()}
    </td>
    <td className="border p-2">{obj.mission || '-'}</td>
    <td className="border p-2 text-center">
      {(() => {
        const montantRealise = obj.montantRealise || 0;
        const pourcentage = obj.montantCible > 0 ? (montantRealise / obj.montantCible) * 100 : 0;
        const isAtteint = obj.isAtteint !== undefined ? obj.isAtteint : pourcentage >= 100;
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
            isAtteint 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-gray-100 text-gray-800 border border-gray-300'
          }`}>
            {isAtteint ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Oui
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Non
              </>
            )}
          </span>
        );
      })()}
    </td>
            <td className="border p-2 text-center">
          <button
            onClick={() => handleToggleStatus(obj.id)}
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              obj.isActive
                ? "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200"
                : "bg-red-100 text-red-700 border border-red-400 hover:bg-red-200"
            }`}
          >
            {obj.isActive ? "Active" : "Inactive"}
          </button>
        </td>
    <td className="border p-2 flex justify-center gap-2">
  <button
    title="Modifier"
    className="w-8 h-8 rounded-full border border-blue-400 flex items-center justify-center text-blue-600 hover:bg-blue-100"
    onClick={() => handleEdit(obj)}
  >
    <LuPencil className="w-4 h-4" />
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
        {Math.min(currentPage * itemsPerPage, objectifs.filter((obj) => (filtreAtteint ? !obj.commercial : true)).length)}{" "}
        sur {objectifs.filter((obj) => (filtreAtteint ? !obj.commercial : true)).length} éléments
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

{/* Formulaire d'édition d'objectif */}
{isEditing && editForm && (
  <div className="mt-6 bg-white shadow-xl p-6 rounded-xl">
    <h3 className="font-semibold text-lg mb-4">Modifier Objectif</h3>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await axios.put(
            `${API_BASE}/objectifs/${editForm.id}`,
            editForm,
            headers
          );
          setIsEditing(false);
          setEditForm(null);
          fetchObjectifs();
          alert("Objectif modifié !");
        } catch (err) {
          alert("Erreur modification : " + err.response?.data?.message);
        }
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Montant Cible (€):</label>
        <input
          name="montantCible"
          type="number"
          value={editForm.montantCible}
          onChange={(e) =>
            setEditForm({ ...editForm, montantCible: e.target.value })
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Prime (€):</label>
        <input
          name="prime"
          type="number"
          value={editForm.prime}
          onChange={(e) =>
            setEditForm({ ...editForm, prime: e.target.value })
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date début :</label>
        <input
          name="dateDebut"
          type="date"
          value={editForm.dateDebut.split('T')[0]}
          onChange={(e) =>
            setEditForm({ ...editForm, dateDebut: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date fin :</label>
        <input
          name="dateFin"
          type="date"
          value={editForm.dateFin.split('T')[0]}
          onChange={(e) =>
            setEditForm({ ...editForm, dateFin: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Mission (optionnel):</label>
        <input
          name="mission"
          type="text"
          value={editForm.mission}
          onChange={(e) =>
            setEditForm({ ...editForm, mission: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="md:col-span-2 flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setEditForm(null);
          }}
          className="px-4 py-2 text-gray-600"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Enregistrer
        </button>
      </div>
    </form>
  </div>
)}

    </div>
  );
};

export default AdminObjectifsPage;
