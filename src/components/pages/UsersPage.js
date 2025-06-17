// src/pages/UsersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserTie, FaUserPlus, FaPen } from "react-icons/fa";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    tel: "",
    adresse: "",
    role: "commercial",
  });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/users${roleFilter !== "all" ? "?role=" + roleFilter : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs :", err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const user = users.find((u) => u.id === id);
      const newStatus = !user.isActive;
      await axios.put(
        `http://localhost:4000/users/${id}/status`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUsers(users.map((u) => (u.id === id ? { ...u, isActive: newStatus } : u)));
    } catch (err) {
      console.error("Erreur:", err.response?.data || err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setEditUserId(user.id);
    setForm({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: "",
      tel: user.tel,
      adresse: user.adresse || "",
      role: user.role,
    });
    setShowModal(true);
  };

  const handleSubmitUser = async () => {
    const { nom, prenom, email, password, tel, adresse, role } = form;
    if (!nom || !prenom || !email || (!editMode && !password) || !tel || !adresse) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:4000/users/${editUserId}`,
          { nom, prenom, email, tel, adresse, role },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("✅ Utilisateur modifié !");
      } else {
        const endpoint =
          role === "admin"
            ? "http://localhost:4000/users/create-admin"
            : "http://localhost:4000/users/create-commercial";

        await axios.post(endpoint, { nom, prenom, email, password, tel, adresse }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Utilisateur ajouté !");
      }

      setShowModal(false);
      setForm({ nom: "", prenom: "", email: "", password: "", tel: "", adresse: "", role: "commercial" });
      setEditMode(false);
      fetchUsers();
    } catch (err) {
      console.error("Erreur :", err);
      alert("❌ Erreur lors de l'opération.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center gap-3">
          <FaUserTie />
          Liste des Utilisateurs
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Filtrer par rôle :
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm"
            >
              <option value="all">Tous</option>
              <option value="admin">Administrateurs</option>
              <option value="commercial">Commerciaux</option>
            </select>
          </div>
          <button
            onClick={() => {
              setEditMode(false);
              setForm({ nom: "", prenom: "", email: "", password: "", tel: "", adresse: "", role: "commercial" });
              setShowModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded shadow flex items-center gap-2"
          >
            <FaUserPlus />
            Ajouter utilisateur
          </button>
        </div>

        <table className="w-full text-sm text-gray-700 rounded overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Téléphone</th>
              <th className="py-3 px-4 text-left">Rôle</th>
              <th className="py-3 px-4 text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{user.nom} {user.prenom}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.tel}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.isActive}
                          onChange={() => toggleStatus(user.id)}
                        />
                        <div className="relative w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300">
                          <div className="absolute left-[2px] top-[2px] bg-white w-7 h-7 rounded-full transition-all duration-300 peer-checked:translate-x-full flex items-center justify-center text-sm">
                            {user.isActive ? "✅" : "❌"}
                          </div>
                        </div>
                      </label>
                      <button
                        className="text-indigo-600 hover:text-indigo-800"
                        onClick={() => openEditModal(user)}
                        title="Modifier"
                      >
                        <FaPen />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">
              {editMode ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </h3>
            <div className="space-y-3">
              {["nom", "prenom", "email", ...(editMode ? [] : ["password"]), "tel", "adresse"].map((field) => (
                <input
                  key={field}
                  type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              ))}
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="commercial">Commercial</option>
                <option value="admin">Administrateur</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitUser}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  {editMode ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;