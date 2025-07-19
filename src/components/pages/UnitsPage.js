import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBalanceScale, FaPlus, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UNITS_PER_PAGE = 10;

const UnitsPage = () => {
  const [units, setUnits] = useState([]); 
  const [total, setTotal] = useState(0);
  const [newUnit, setNewUnit] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Pour l'édition
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUnit, setEditUnit] = useState(null);
  const [editUnitName, setEditUnitName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // Helper pour extraire le message d'erreur du backend
  const getErrorMessage = (err, fallback = "Une erreur est survenue") => {
    if (err?.response?.data?.message) {
      if (Array.isArray(err.response.data.message)) {
        return err.response.data.message.join(' ');
      }
      return err.response.data.message;
    }
    return fallback;
  };

  const fetchUnits = async (page = 1, searchValue = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/unite?search=${encodeURIComponent(searchValue)}&page=${page}&limit=${UNITS_PER_PAGE}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnits(res.data.data);
      setTotal(res.data.total);
      setCurrentPage(res.data.page);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur chargement unités"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits(1, "");
  }, []);

  // Recherche
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUnits(1, search);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Pagination
  const totalPages = Math.ceil(total / UNITS_PER_PAGE);

  // Ajout d'une unité
  const addUnit = async (e) => {
    e.preventDefault();
    if (!newUnit.trim()) {
      toast.error("Le nom de l'unité est requis.");
      return;
    }
    setIsAdding(true);
    try {
      await axios.post(
        "http://localhost:4000/unite",
        { nom: newUnit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Unité ajoutée !");
      setNewUnit("");
      setShowAddModal(false);
      fetchUnits(currentPage, search);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur ajout unité"));
    } finally {
      setIsAdding(false);
    }
  };

  // Modification d'une unité
  const handleEditClick = (unit) => {
    setEditUnit(unit);
    setEditUnitName(unit.nom);
    setShowEditModal(true);
  };

  const handleEditUnit = async (e) => {
    e.preventDefault();
    if (!editUnitName.trim()) {
      toast.error("Le nom de l'unité est requis.");
      return;
    }
    setIsEditing(true);
    try {
      await axios.put(
        `http://localhost:4000/unite/${editUnit.id}`,
        { nom: editUnitName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Unité modifiée !");
      setShowEditModal(false);
      fetchUnits(currentPage, search);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur modification unité"));
    } finally {
      setIsEditing(false);
    }
  };

  // Changement de statut
  const toggleUnitStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:4000/unite/${id}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUnits(currentPage, search);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur modification statut"));
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
            <FaBalanceScale className="text-indigo-500" /> Gestion des Unités
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
          >
            <FaPlus /> Ajouter une unité
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher une unité par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
       
        {/* Liste des unités */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden min-h-[200px]">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span>Chargement...</span>
            </div>
          ) : (
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nom</th>
                  <th className="px-6 py-3 text-center font-semibold">Statut</th>
                  <th className="px-6 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit, idx) => (
                  <tr key={unit.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-medium capitalize">{unit.nom}</td>
                    <td className="px-6 py-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={unit.isActive}
                          onChange={() => toggleUnitStatus(unit.id, unit.isActive)}
                        />
                        <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300 relative">
                          <div className="absolute left-[2px] top-[2px] bg-white w-7 h-7 rounded-full transition-all duration-300 peer-checked:translate-x-full flex items-center justify-center text-xs shadow">
                            {unit.isActive ? "✅" : "❌"}
                          </div>
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        title="Modifier"
                        onClick={() => handleEditClick(unit)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            
          )}
          
        </div>
        

        {/* Message de pagination + pagination */}
{!loading && units.length > 0 && (
  <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
    {/* Message de pagination à gauche */}
    <div className="text-sm text-gray-600">
      Affichage de {(currentPage - 1) * UNITS_PER_PAGE + 1} à {Math.min(currentPage * UNITS_PER_PAGE, total)} sur {total} éléments
    </div>

    {/* Boutons de pagination à droite */}
    <div className="flex gap-2">
      <button
        onClick={() => currentPage > 1 && fetchUnits(currentPage - 1, search)}
        className="px-3 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300"
      >
        Précédent
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => fetchUnits(i + 1, search)}
          className={`px-3 py-1 rounded border text-sm ${
            currentPage === i + 1
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => currentPage < totalPages && fetchUnits(currentPage + 1, search)}
        className="px-3 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300"
      >
        Suivant
      </button>
    </div>
  </div>
)}


      {/* MODAL AJOUTER */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={addUnit}
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Ajouter une Unité
            </h3>
            <input
              type="text"
              placeholder="Nom de la nouvelle unité"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="w-full border rounded px-4 py-2 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowAddModal(false)}
                disabled={isAdding}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                disabled={isAdding}
              >
                {isAdding ? "Ajout..." : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL MODIFIER */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleEditUnit}
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Modifier l'Unité
            </h3>
            <input
              type="text"
              placeholder="Nom de l'unité"
              value={editUnitName}
              onChange={(e) => setEditUnitName(e.target.value)}
              className="w-full border rounded px-4 py-2 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
                disabled={isEditing}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                disabled={isEditing}
              >
                {isEditing ? "Modification..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
      </div>
  );
};

export default UnitsPage;