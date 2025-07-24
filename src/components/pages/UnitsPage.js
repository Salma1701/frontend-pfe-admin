import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { LuPencil, LuPlus } from "react-icons/lu";
import Modal from "../Modal";
import { SecondaryButton, PrimaryButton } from "../ModalButton";

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
        `/unite?search=${encodeURIComponent(searchValue)}&page=${page}&limit=${UNITS_PER_PAGE}`,
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
        "/unite",
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
        `/unite/${editUnit.id}`,
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
        `/unite/${id}/status`,
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
      {/* ✅ Barre d'action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h2 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Gestion des Unités
        </h2>
        <div className="flex items-center gap-3">
            <button
            onClick={() => setShowAddRow(!showAddRow)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {showAddRow ? "Annuler" : "Ajouter"}
          </button>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs"
          />
        
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
                      {unit.isActive ? "Active" : "Inactive"}
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
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter une Unité"
        subtitle="Créez une nouvelle unité de mesure"
        icon={LuPlus}
        maxWidth="max-w-md"
        footer={
          <>
            <SecondaryButton onClick={() => setShowAddModal(false)} disabled={isAdding}>
              Annuler
            </SecondaryButton>
            <PrimaryButton onClick={addUnit} disabled={isAdding}>
              {isAdding ? "Ajout..." : "Ajouter"}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Nom de l'unité *
            </label>
            <input
              type="text"
              placeholder="Nom de la nouvelle unité"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
              autoFocus
            />
          </div>
        </div>
      </Modal>

      {/* ✅ Modal modification */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier l'Unité"
        subtitle="Mettez à jour le nom de l'unité"
        icon={LuPencil}
        maxWidth="max-w-md"
        footer={
          <>
            <SecondaryButton onClick={() => setShowEditModal(false)} disabled={isEditing}>
              Annuler
            </SecondaryButton>
            <PrimaryButton onClick={handleEditUnit} disabled={isEditing}>
              {isEditing ? "Modification..." : "Enregistrer"}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Nom de l'unité *
            </label>
            <input
              type="text"
              placeholder="Nom de l'unité"
              value={editUnitName}
              onChange={(e) => setEditUnitName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
              autoFocus
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnitsPage;
