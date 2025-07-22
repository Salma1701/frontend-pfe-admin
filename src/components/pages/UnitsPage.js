import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBalanceScale, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuPencil } from "react-icons/lu";

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUnit, setEditUnit] = useState(null);
  const [editUnitName, setEditUnitName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);

  const token = localStorage.getItem("token");

  const getErrorMessage = (err, fallback = "Une erreur est survenue") => {
    if (err?.response?.data?.message) {
      if (Array.isArray(err.response.data.message)) {
        return err.response.data.message.join(" ");
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUnits(1, search);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const totalPages = Math.ceil(total / UNITS_PER_PAGE);

  const addUnit = async () => {
    if (!newUnit.trim()) return toast.error("Le nom de l'unité est requis.");
    setIsAdding(true);
    try {
      await axios.post(
        "http://localhost:4000/unite",
        { nom: newUnit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Unité ajoutée !");
      setNewUnit("");
      setShowAddRow(false);
      fetchUnits(currentPage, search);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur ajout unité"));
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditClick = (unit) => {
    setEditUnit(unit);
    setEditUnitName(unit.nom);
    setShowEditModal(true);
  };

  const handleEditUnit = async (e) => {
    e.preventDefault();
    if (!editUnitName.trim()) return toast.error("Le nom de l'unité est requis.");
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

      {/* ✅ Barre d'action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h2 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
          <FaBalanceScale className="text-indigo-500" /> Gestion des Unités
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs"
          />
          <button
            onClick={() => setShowAddRow(!showAddRow)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {showAddRow ? "Annuler" : "Ajouter"}
          </button>
        </div>
      </div>

      {/* ✅ Liste */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center py-10">Chargement...</div>
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
              {/* Ligne d'ajout */}
              {showAddRow && (
                <tr className="bg-blue-50 border-b">
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="Nom de la nouvelle unité"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      onKeyPress={(e) => e.key === 'Enter' && addUnit()}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-500 text-sm">Nouvelle</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={addUnit}
                        disabled={isAdding}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        {isAdding ? "Ajout..." : "Sauvegarder"}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddRow(false);
                          setNewUnit("");
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              
              {/* Unités existantes */}
              {units.map((unit, idx) => (
                <tr key={unit.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 font-medium capitalize">{unit.nom}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleUnitStatus(unit.id, unit.isActive)}
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        unit.isActive
                          ? "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200"
                          : "bg-red-100 text-red-700 border border-red-400 hover:bg-red-200"
                      }`}
                    >
                      {unit.isActive ? "Désactiver" : "Activer"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEditClick(unit)}
                      title="Modifier"
                      className="w-8 h-8 rounded-full border border-blue-400 flex items-center justify-center text-blue-600 hover:bg-blue-100 mx-auto"
                    >
                      <LuPencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Pagination */}
      {!loading && units.length > 0 && (
        <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
          <div className="text-sm text-gray-600">
            Affichage de {(currentPage - 1) * UNITS_PER_PAGE + 1} à {Math.min(currentPage * UNITS_PER_PAGE, total)} sur {total} éléments
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => currentPage > 1 && fetchUnits(currentPage - 1, search)}
              className="px-3 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300"
            >Précédent</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => fetchUnits(i + 1, search)}
                className={`px-3 py-1 rounded border text-sm ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => currentPage < totalPages && fetchUnits(currentPage + 1, search)}
              className="px-3 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300"
            >Suivant</button>
          </div>
        </div>
      )}

      {/* ✅ Modal ajout */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={addUnit} className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ajouter une Unité</h3>
            <input
              type="text"
              placeholder="Nom de la nouvelle unité"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="w-full border rounded px-4 py-2 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowAddModal(false)} disabled={isAdding}>Annuler</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" disabled={isAdding}>{isAdding ? "Ajout..." : "Ajouter"}</button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ Modal modification */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleEditUnit} className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Modifier l'Unité</h3>
            <input
              type="text"
              placeholder="Nom de l'unité"
              value={editUnitName}
              onChange={(e) => setEditUnitName(e.target.value)}
              className="w-full border rounded px-4 py-2 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowEditModal(false)} disabled={isEditing}>Annuler</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" disabled={isEditing}>{isEditing ? "Modification..." : "Enregistrer"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UnitsPage;
