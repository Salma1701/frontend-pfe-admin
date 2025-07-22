// src/pages/UsersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserTie, FaUserPlus, FaPen,
  FaDownload, FaEye, FaEyeSlash, FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";
import Papa from "papaparse";
import { LuPencil } from "react-icons/lu";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", password: "",
    tel: "", adresse: "", role: "commercial",
  });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/users${roleFilter !== "all" ? "?role=" + roleFilter : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data);
    } catch {
      toast.error("Erreur de chargement des utilisateurs.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const filteredUsers = users.filter((user) =>
    `${user.nom} ${user.prenom}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleStatus = async (id) => {
    try {
      const user = users.find((u) => u.id === id);
      const newStatus = !user.isActive;
      await axios.put(
        `http://localhost:4000/users/${id}/status`,
        { isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => u.id === id ? { ...u, isActive: newStatus } : u));
    } catch {
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  const exportCSV = () => {
    const csv = Papa.unparse(users);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "utilisateurs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setEditUserId(user.id);
    setForm({ ...user, password: "" });
    setErrorMessage("");
    setShowModal(true);
  };

  const isValidFrenchPhoneNumber = (number) => {
    const cleaned = number.replace(/\s+/g, '');
    const regex = /^(?:(?:\+33)|(?:0))([1-9]\d{8})$/;
    return regex.test(cleaned);
  };

  // Fonction pour formater automatiquement le numéro de téléphone
  const formatPhoneNumber = (value) => {
    // Nettoyer le numéro
    const cleaned = value.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    
    // Formater selon le format français
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    } else if (cleaned.startsWith('+33') && cleaned.length === 12) {
      return cleaned.replace(/(\+33)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
    } else if (cleaned.startsWith('33') && cleaned.length === 11) {
      return '+' + cleaned.replace(/(\d{2})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
    }
    
    return value;
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    setForm(prev => ({ ...prev, tel: formatted }));
  };

  const handleSubmitUser = async () => {
    // Validation
    if (!form.nom || !form.prenom || !form.email || !form.tel || !form.adresse) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }

    // Validation du mot de passe selon le mode
    if (!editMode && !form.password) {
      setErrorMessage("Le mot de passe est obligatoire pour un nouvel utilisateur.");
      return;
    }

    if (editMode && form.password && form.password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (!isValidFrenchPhoneNumber(form.tel)) {
      setErrorMessage("Le numéro de téléphone doit être un numéro français valide (ex: 06 12 34 56 78 ou +33 6 12 34 56 78).");
      return;
    }

    // Validation pour empêcher la promotion d'un commercial vers admin
    if (editMode) {
      const originalUser = users.find(u => u.id === editUserId);
      if (originalUser && originalUser.role === 'commercial' && form.role === 'admin') {
        setErrorMessage("Un commercial ne peut pas être promu administrateur.");
        return;
      }
    }

    try {
      if (editMode) {
        // Filtrer les propriétés interdites pour la modification
        const { id, latitude, longitude, isActive, ...updateData } = form;
        
        // Si le mot de passe est vide en mode édition, l'exclure complètement
        if (!updateData.password) {
          delete updateData.password;
        }
        
        await axios.put(
          `http://localhost:4000/users/${editUserId}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Utilisateur modifié avec succès.");
      } else {
        await axios.post(
          "http://localhost:4000/users/commercial",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Utilisateur ajouté avec succès.");
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(Array.isArray(error.response.data.message) 
          ? error.response.data.message.join(', ') 
          : error.response.data.message);
      } else {
        setErrorMessage("Erreur lors de l'opération.");
      }
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">Gestion des Utilisateurs</h2>

        {/* Filtres et actions */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-4 pr-4 py-2 w-full border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded shadow bg-white border w-full md:w-1/4"
          >
            <option value="all">Tous les rôles</option>
            <option value="commercial">Commerciaux</option>
            <option value="admin">Administrateurs</option>
          </select>
          <button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaDownload /> Exporter CSV
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setForm({ nom: "", prenom: "", email: "", password: "", tel: "", adresse: "", role: "commercial" });
              setErrorMessage("");
              setShowModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaUserPlus /> Ajouter utilisateur
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow mb-4">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="px-6 py-3 text-left text-base font-semibold">Nom</th>
                <th className="px-6 py-3 text-left text-base font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-base font-semibold">Téléphone</th>
                <th className="px-6 py-3 text-left text-base font-semibold">Rôle</th>
                <th className="px-6 py-3 text-center text-base font-semibold">Statut</th>
                <th className="px-6 py-3 text-center text-base font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`transition hover:bg-indigo-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-3 capitalize font-medium">{user.nom} {user.prenom}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.tel}</td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 text-sm rounded-full font-semibold border bg-blue-100 text-blue-800 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`px-3 py-1 text-sm rounded-full font-semibold border ${
                          user.isActive
                            ? "text-green-600 border-green-400 bg-green-100"
                            : "text-gray-500 border-gray-300 bg-gray-100"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => openEditModal(user)}
                        title="Modifier"
                        className="w-8 h-8 rounded-full border border-blue-400 flex items-center justify-center text-blue-600 hover:bg-blue-100 mx-auto"
                      >
                        <LuPencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600 mb-2 md:mb-0">
            {filteredUsers.length > 0 &&
              `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur ${
                filteredUsers.length
              } utilisateur${filteredUsers.length > 1 ? "s" : ""}`}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed text-gray-500"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                } hover:bg-indigo-400`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed text-gray-500"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Suivant
            </button>
          </div>
        </div>

        {/* Modal ajout/modif */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
              {/* Header fixe */}
              <div className="p-8 pb-4 border-b border-gray-200">
                {/* Bouton fermer */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTimes size={24} />
                </button>

                <h3 className="text-2xl font-bold text-indigo-700 pr-8">
                  {editMode ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
                </h3>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto p-8 pt-4">
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">⚠️</span>
                      <span className="font-medium">{errorMessage}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      placeholder="Entrez le nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={form.prenom}
                      onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                      placeholder="Entrez le prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="exemple@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="06 12 34 56 78 ou +33 6 12 34 56 78"
                      value={form.tel}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Format accepté : 06 12 34 56 78, +33 6 12 34 56 78
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={form.adresse}
                      onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                      placeholder="Entrez l'adresse complète"
                    />
                  </div>
                  {!editMode && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-12"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          placeholder="Minimum 6 caractères"
                        />
                        <button
                          type="button"
                          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}
                  {editMode && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe (optionnel)</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-12"
                          placeholder="Laissez vide pour conserver le mot de passe actuel"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Minimum 6 caractères si vous souhaitez changer le mot de passe
                      </p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rôle *</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="commercial">Commercial</option>
                      <option 
                        value="admin" 
                        disabled={editMode && users.find(u => u.id === editUserId)?.role === 'commercial'}
                      >
                        Administrateur
                      </option>
                    </select>
                    {editMode && users.find(u => u.id === editUserId)?.role === 'commercial' && (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span className="text-sm">Un commercial ne peut pas être promu administrateur</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer fixe avec boutons */}
              <div className="p-8 pt-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmitUser}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                  >
                    {editMode ? (
                      <>
                        <FaPen size={16} />
                        Modifier
                      </>
                    ) : (
                      <>
                        <FaUserPlus size={16} />
                        Ajouter
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
