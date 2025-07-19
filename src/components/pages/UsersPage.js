// src/pages/UsersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserTie, FaUserPlus, FaPen,
  FaDownload, FaEye, FaEyeSlash
} from "react-icons/fa";
import { toast } from "react-toastify";
import Papa from "papaparse";

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
  const itemsPerPage = 5;

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
    const regex = /^(?:(?:\+33)|(?:0))([67]\d{8})$/;
    return regex.test(cleaned);
  };

  const handleSubmitUser = async () => {
    const { nom, prenom, email, password, tel, adresse, role } = form;
    if (!isValidFrenchPhoneNumber(tel)) {
      setErrorMessage("❌ Numéro de téléphone invalide.");
      return;
    }

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:4000/users/${editUserId}`,
          { nom, prenom, email, tel, adresse },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ Utilisateur modifié !");
      } else {
        const endpoint = role === "admin"
          ? "http://localhost:4000/users/create-admin"
          : "http://localhost:4000/users/create-commercial";
        await axios.post(endpoint, { nom, prenom, email, password, tel, adresse }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Utilisateur ajouté !");
      }

      setShowModal(false);
      setForm({ nom: "", prenom: "", email: "", password: "", tel: "", adresse: "", role: "commercial" });
      setEditMode(false);
      fetchUsers();
    } catch (err) {
      const res = err.response?.data;
      const message = res?.message;
      if (typeof message === "string") {
        setErrorMessage("❌ " + message);
      } else if (Array.isArray(message)) {
        setErrorMessage("❌ " + message.join("\n"));
      } else {
        setErrorMessage("❌ Erreur inconnue.");
      }
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center gap-3">
          <FaUserTie /> Liste des Utilisateurs
        </h2>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">Tous</option>
              <option value="admin">Administrateurs</option>
              <option value="commercial">Commerciaux</option>
            </select>
            <input
              type="text"
              placeholder="Rechercher..."
              className="border p-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={exportCSV} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
              <FaDownload /> Export CSV
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setForm({ nom: "", prenom: "", email: "", password: "", tel: "", adresse: "", role: "commercial" });
                setShowModal(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaUserPlus /> Ajouter utilisateur
            </button>
          </div>
        </div>

        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-indigo-100 text-gray-800">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3 text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-6">Aucun utilisateur trouvé.</td></tr>
            ) : (
              paginatedUsers.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.nom} {user.prenom}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.tel}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2 text-center">
                    <input type="checkbox" checked={user.isActive} onChange={() => toggleStatus(user.id)} />
                    <button onClick={() => openEditModal(user)} className="text-indigo-600 ml-2"><FaPen /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
          {/* Message de pagination à gauche */}
          <div className="text-sm text-gray-600">
            {filteredUsers.length > 0 && (
              <>
                {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""}
              </>
            )}
          </div>

          {/* Pagination à droite */}
          <div className="flex items-center gap-1 mt-3 md:mt-0">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-indigo-500 text-white"}`}
            >
              Précédent
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 rounded text-sm ${currentPage === index + 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-indigo-500 text-white"}`}
            >
              Suivant
            </button>
          </div>
        </div>

        {/* Modal ajout/modif */}
        {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">
        {editMode ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
      </h3>

      {errorMessage && (
        <p className="text-red-600 text-sm mb-3 whitespace-pre-line">{errorMessage}</p>
      )}

      <div className="space-y-3">
        {["nom", "prenom", "email", "tel", "adresse"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize mb-1">
              {field}
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          </div>
        ))}

        {!editMode && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 border rounded pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <span
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rôle</label>
              <select
                className="w-full p-2 border rounded"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="commercial">Commercial</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmitUser}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {editMode ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default UsersPage;
